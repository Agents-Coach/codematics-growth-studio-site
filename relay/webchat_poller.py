#!/usr/bin/env python3
"""
Codematics Web Chat Poller
==========================
Runs as a background daemon. Polls the relay server every 10 seconds
for new visitor messages, processes them via the Codemax AI API,
and sends responses back through the relay.

Usage:
  python webchat_poller.py

Environment variables:
  RELAY_URL        — relay server URL (default: http://localhost:8080)
  CODEMAX_API_KEY  — Codemax API key ( REQUIRED — get from your account )
  CODEMAX_BASE_URL — Codemax base URL (default: https://api.codemax.pro)
  POLL_INTERVAL    — seconds between polls (default: 10)
  MODEL            — model to use (default: claude-opus-4-7)
"""

import os
import sys
import json
import time
import logging
from datetime import datetime
from typing import Optional

import requests

# ── Configuration ──────────────────────────────────────────────────────────────

RELAY_URL      = os.environ.get("RELAY_URL",      "http://localhost:8080").rstrip("/")
CODEMAX_KEY    = os.environ.get("CODEMAX_API_KEY", os.environ.get("ANTHROPIC_API_KEY", "")).strip()
CODEMAX_BASE   = os.environ.get("CODEMAX_BASE_URL", "https://api.codemax.pro").rstrip("/")
POLL_INTERVAL  = int(os.environ.get("POLL_INTERVAL", "10"))
MODEL          = os.environ.get("MODEL", "claude-opus-4-7")

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("poller")

# ── Agent system prompt ─────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are the Codematics Web Chat Agent — the AI assistant on codematics.ai.

You represent Codematics Growth Studio. Be helpful, knowledgeable, and conversational.

## Who you are
- Front-line AI assistant for Codematics Growth Studio
- Built and operated by Aby (founder, @aby on X.com)
- Company: Codematics.ai | Email: hello@codematics.ai

## What Codematics does
Codematics designs and deploys custom AI agent workforces around specific business operations. Teams of AI agents work together — research, offers, copy, funnels, email, SEO, sales, launches, and automation.

## Service tiers
- **Audit** ($497 one-time): AI Growth Workflow Audit — maps bottlenecks, recommends agent stack, produces implementation roadmap. Delivered in 5-7 business days.
- **Build** ($1,497+ project): Custom Agent Workforce Build — architecture, build, deploy, team training. Delivered in 2-4 weeks.
- **Partner** ($2,997/mo): Growth Studio Operating Partner — Build tier + monthly optimization, refinement, new capability deployment.

## Use cases
Launching offers, building SEO authority, fixing broken funnels, content engines, sales follow-up systems, agency delivery automation, scaling content production, custom AI operations.

## Who you help
Founders, small business owners, agency operators, marketing leaders overwhelmed by manual workflows or wanting to leverage AI.

## How to communicate
- Conversational and warm, not robotic
- Answer directly and specifically
- Ask clarifying questions when the visitor's goal isn't clear
- Reference relevant service tiers when appropriate
- Do NOT oversell — inform and guide
- Keep responses focused — a few paragraphs max
- Plain text only (no markdown/formatting)

## Routing
**Handle yourself:** General questions about services, pricing, process, use cases, qualifying questions, scheduling interest.

**Escalate to Aby when:** Visitor asks for a specific booking link, wants to discuss a custom/complex project in detail, is ready to buy, or asks something outside your knowledge. Direct to hello@codematics.ai.

## Never do
- Make up pricing, timelines, or capabilities
- Share Aby's personal contact info
- Promise specific results
- Pretend to be human
- Share confidential information
"""

# ── Conversation history store ─────────────────────────────────────────────────
# session_id → list of messages for AI context

conversation_store: dict[str, list[dict]] = {}


def get_conversation(session_id: str) -> list[dict]:
    if session_id not in conversation_store:
        conversation_store[session_id] = []
    return conversation_store[session_id]


def add_to_conversation(session_id: str, role: str, text: str):
    get_conversation(session_id).append({"role": role, "content": text})
    # Keep max 20 turns per session
    if len(conversation_store[session_id]) > 20:
        conversation_store[session_id] = conversation_store[session_id][-20:]


# ── API calls ───────────────────────────────────────────────────────────────────

def _codemax_complete(messages: list[dict], session_id: str) -> str:
    """Call Codemax (OpenAI-compatible) for chat completion."""
    if not CODEMAX_KEY:
        return "⚠️ CODEMAX_API_KEY not set. Please configure your API key."

    headers = {
        "Authorization": f"Bearer {CODEMAX_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "max_tokens": 800,
        "temperature": 0.7,
    }

    try:
        resp = requests.post(
            f"{CODEMAX_BASE}/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30,
        )
        data = resp.json()

        if resp.status_code != 200:
            log.error("[%s] API error %d: %s", session_id[:8], resp.status_code, data)
            return "I'm having trouble connecting right now. Please try again in a moment, or email us at hello@codematics.ai."

        choice = data.get("choices", [{}])[0]
        return choice.get("message", {}).get("content", "").strip() or "Got it! Let me think about that..."

    except requests.exceptions.Timeout:
        log.error("[%s] API timeout", session_id[:8])
        return "I'm taking a moment to think — thanks for your patience!"
    except Exception as e:
        log.error("[%s] Unexpected error: %s", session_id[:8], e)
        return "I'm having trouble connecting right now. Please try again shortly!"


# ── Relay helpers ───────────────────────────────────────────────────────────────

def poll_incoming() -> list[dict]:
    try:
        resp = requests.get(f"{RELAY_URL}/poll_incoming", timeout=5)
        if resp.ok:
            return resp.json().get("messages", [])
    except Exception as e:
        log.debug("poll_incoming error: %s", e)
    return []


def get_session_context(session_id: str) -> tuple[list[dict], str]:
    """Fetch session history from relay. Returns (messages, page)."""
    try:
        resp = requests.get(f"{RELAY_URL}/messages/{session_id}", timeout=5)
        if resp.ok:
            data = resp.json()
            return data.get("messages", []), data.get("page", "/")
    except Exception as e:
        log.debug("get_session_context error: %s", e)
    return [], "/"


def send_response(session_id: str, response: str) -> bool:
    try:
        resp = requests.post(
            f"{RELAY_URL}/relay_response",
            json={"session_id": session_id, "response": response},
            timeout=10,
        )
        return resp.ok
    except Exception as e:
        log.error("[%s] Failed to send response: %s", session_id[:8], e)
        return False


def mark_processed(ids: list) -> bool:
    try:
        resp = requests.post(
            f"{RELAY_URL}/mark_processed",
            json={"ids": ids},
            timeout=5,
        )
        return resp.ok
    except Exception as e:
        log.error("mark_processed error: %s", e)
        return False


# ── Main loop ───────────────────────────────────────────────────────────────────

def run():
    if not CODEMAX_KEY:
        log.error("CODEMAX_API_KEY environment variable is not set.")
        log.error("Set it with: export CODEMAX_API_KEY=sk-...")
        sys.exit(1)

    log.info("Starting Codematics Web Chat Poller")
    log.info("  Relay URL:   %s", RELAY_URL)
    log.info("  Model:       %s", MODEL)
    log.info("  Poll every:  %ds", POLL_INTERVAL)
    log.info("  Codemax:     %s", CODEMAX_BASE)
    print()

    consecutive_errors = 0
    max_consecutive_errors = 10

    while True:
        try:
            messages = poll_incoming()

            if messages:
                log.info("Found %d new message(s)", len(messages))
                consecutive_errors = 0

                for msg in messages:
                    session_id = msg.get("session_id", "")
                    msg_id     = msg.get("id")
                    text       = msg.get("text", "")
                    page       = msg.get("page", "/")

                    if not session_id or not text:
                        continue

                    log.info("[%s] Processing: %r", session_id[:8], text[:60])

                    # Build AI conversation context
                    history, _ = get_session_context(session_id)
                    ai_messages = []
                    for h in history:
                        role = "user" if h.get("sender") == "widget" else "assistant"
                        ai_messages.append({"role": role, "content": h.get("text", "")})
                    # Current message
                    ai_messages.append({"role": "user", "content": text})

                    # Call AI
                    response = _codemax_complete(ai_messages, session_id)

                    # Store in local history
                    add_to_conversation(session_id, "user", text)
                    add_to_conversation(session_id, "assistant", response)

                    # Send back to relay
                    ok = send_response(session_id, response)
                    if ok:
                        log.info("[%s] ✓ Response sent (%d chars)", session_id[:8], len(response))
                        mark_processed([msg_id])
                    else:
                        log.error("[%s] ✗ Failed to send response", session_id[:8])

            # Small sleep between polls
            time.sleep(POLL_INTERVAL)

        except KeyboardInterrupt:
            log.info("Shutting down...")
            break
        except Exception as e:
            consecutive_errors += 1
            log.error("Loop error (%d/%d): %s", consecutive_errors, max_consecutive_errors, e)
            if consecutive_errors >= max_consecutive_errors:
                log.critical("Too many consecutive errors — exiting.")
                break
            time.sleep(POLL_INTERVAL * 2)


if __name__ == "__main__":
    run()
