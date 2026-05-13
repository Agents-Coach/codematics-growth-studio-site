#!/usr/bin/env python3
"""
Codematics Web Chat Relay Server
================================
Bridges: [Site Chat Widget] ←→ [Telegram Bot API] ←→ [Hermes Agent]

Architecture:
  1. Widget POSTs visitor message to /webhook
  2. Relay forwards to Telegram Bot API (sendMessage)
  3. Hermes agent (web-chat profile) receives via Telegram, responds
  4. Agent sends response back to /relay_response endpoint
  5. Widget polls /messages/<session_id> to receive response

Usage:
  python relay_server.py

Environment variables:
  TELEGRAM_BOT_TOKEN   — Bot token from BotFather (REQUIRED)
  HOST                 — Host to bind (default: 0.0.0.0)
  PORT                 — Port to bind (default: 8080)
  SECRET_KEY           — Session validation key (auto-generated if missing)
  LOG_LEVEL            — DEBUG|INFO|WARNING (default: INFO)
"""

import os
import sys
import json
import time
import uuid
import logging
import threading
import queue
from datetime import datetime, timedelta
from typing import Optional

from flask import Flask, request, jsonify
import requests

# ── Configuration ─────────────────────────────────────────────────────────────

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8080"))
SECRET_KEY = os.environ.get("SECRET_KEY", uuid.uuid4().hex[:32])
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()

# ── Logging ────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("relay")

if not TELEGRAM_BOT_TOKEN:
    log.error("TELEGRAM_BOT_TOKEN environment variable is not set.")
    log.error("Get a token from https://t.me/BotFather")
    sys.exit(1)

TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}"

# ── In-memory stores ───────────────────────────────────────────────────────────
# session_id → list of messages (widget ← agent)
# Max 1000 sessions, auto-expire after 30 min of inactivity

_session_store: dict[str, dict] = {}
_session_lock = threading.Lock()

MAX_SESSIONS = 1000
SESSION_TTL_HOURS = 1

# Incoming messages queue — messages forwarded from widget → Telegram
# These are picked up by the Hermes cron agent and processed
_incoming_queue: list[dict] = []
_incoming_lock = threading.Lock()
_last_incoming_id: dict = {"id": 0}  # track last processed incoming message


def _clean_expired():
    """Remove sessions older than SESSION_TTL."""
    cutoff = datetime.now() - timedelta(hours=SESSION_TTL_HOURS)
    expired = [
        sid for sid, data in _session_store.items()
        if data.get("last_activity", datetime.now()) < cutoff
    ]
    for sid in expired:
        del _session_store[sid]
    if expired:
        log.debug("Cleaned %d expired sessions", len(expired))


def _get_session(session_id: str) -> dict:
    with _session_lock:
        if session_id not in _session_store:
            if len(_session_store) >= MAX_SESSIONS:
                _clean_expired()
            _session_store[session_id] = {
                "messages": [],
                "last_activity": datetime.now(),
                "widget_page": None,
            }
        _session_store[session_id]["last_activity"] = datetime.now()
        return _session_store[session_id]


def _store_message(session_id: str, sender: str, text: str, timestamp: str = None):
    session = _get_session(session_id)
    session["messages"].append({
        "sender": sender,  # "widget" or "agent"
        "text": text,
        "timestamp": timestamp or datetime.now().isoformat(),
    })
    log.debug("[%s] Stored %s message: %r", session_id[:8], sender, text[:80])


def _get_messages(session_id: str) -> list:
    session = _get_session(session_id)
    return session["messages"]


# ── Telegram helpers ───────────────────────────────────────────────────────────

# Persistent chat_id storage (populated on first received message)
_telegram_chat_id: dict = {"chat_id": None}


def _telegram_send(text: str, parse_mode: str = "Markdown", silent: bool = False) -> bool:
    """Send a message from the bot to the configured admin chat."""
    if not _telegram_chat_id["chat_id"]:
        log.warning("No chat_id configured — cannot send to Telegram yet. "
                    "A visitor must message the bot first, or set ADMIN_CHAT_ID env var.")
        return False

    payload = {
        "chat_id": _telegram_chat_id["chat_id"],
        "text": text,
        "parse_mode": parse_mode,
    }
    if silent:
        payload["disable_notification"] = True

    try:
        resp = requests.post(f"{TELEGRAM_API}/sendMessage", json=payload, timeout=10)
        data = resp.json()
        if not data.get("ok"):
            log.warning("Telegram send failed: %s", data)
            return False
        return True
    except Exception as e:
        log.error("Telegram API error: %s", e)
        return False


def _poll_telegram_updates() -> list:
    """Poll Telegram for new updates. Returns list of message dicts."""
    try:
        resp = requests.get(f"{TELEGRAM_API}/getUpdates", timeout=5)
        data = resp.json()
        if not data.get("ok"):
            return []
        return data.get("result", [])
    except Exception as e:
        log.warning("getUpdates failed: %s", e)
        return []


def _register_telegram_webhook():
    """Poll Telegram to discover + store the admin chat_id.
    
    Set ADMIN_CHAT_ID env var to skip auto-detection.
    """
    if os.environ.get("ADMIN_CHAT_ID"):
        _telegram_chat_id["chat_id"] = os.environ.get("ADMIN_CHAT_ID")
        log.info("Admin chat_id set from ADMIN_CHAT_ID: %s", _telegram_chat_id["chat_id"])
        return

    updates = _poll_telegram_updates()
    for update in updates:
        for key in ("message", "edited_message", "callback_query"):
            msg = update.get(key, {})
            chat = msg.get("chat", {})
            if chat.get("id"):
                _telegram_chat_id["chat_id"] = str(chat["id"])
                log.info("Auto-detected admin chat_id: %s (from %s)", chat["id"], chat.get("username", "unknown"))
                return

    log.info("No chat_id detected yet. Visitor must message the bot, or set ADMIN_CHAT_ID.")


# ── Flask app ─────────────────────────────────────────────────────────────────

app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "token_prefix": TELEGRAM_BOT_TOKEN[:10] + "..."})


@app.route("/webhook", methods=["POST"])
def webhook():
    """
    Called by the site chat widget.
    Forwards the visitor's message to the Telegram bot.
    
    Expected JSON body:
    {
      "session_id": "uuid",
      "message": "Hello, what services do you offer?",
      "page": "/pricing",
      "visitor_id": "anonymous-uuid",
      "metadata": { ... }
    }
    """
    try:
        body = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    session_id = body.get("session_id", "").strip()
    message = body.get("message", "").strip()
    page = body.get("page", "/")
    visitor_id = body.get("visitor_id", "unknown")

    if not message:
        return jsonify({"error": "Message is required"}), 400
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    # Store widget page context
    _get_session(session_id)["widget_page"] = page

    # Push to incoming queue for Hermes cron agent
    with _incoming_lock:
        msg_id = int(time.time() * 1000)
        _incoming_queue.append({
            "id": msg_id,
            "session_id": session_id,
            "text": message,
            "page": page,
            "visitor_id": visitor_id,
            "timestamp": datetime.now().isoformat(),
            "processed": False,
        })

    # Format message for Telegram (relay → admin)
    header = (
        f"🌐 *New Chat from Website*\n"
        f"Page: {page}\n"
        f"Session: `{session_id[:8]}`\n"
        f"Visitor: `{visitor_id[:12]}`\n"
        f"{'─' * 20}\n\n"
    )
    telegram_text = header + message

    sent = _telegram_send(telegram_text)
    if not sent:
        log.error("Failed to forward message to Telegram for session %s", session_id[:8])
    else:
        log.info("[%s] Message forwarded to Telegram (queue_id: %d)", session_id[:8], msg_id)

    return jsonify({
        "ok": True,
        "session_id": session_id,
        "queue_id": msg_id,
        "forwarded": sent,
    })


# ── Persistent update cursor (prevents re-delivering messages) ──────────────────
_last_update_id = {"id": 0}


@app.route("/poll_incoming", methods=["GET"])
def poll_incoming():
    """
    Called by the Hermes cron agent to get unprocessed incoming messages.
    The agent marks them processed after handling.

    Response:
    { "messages": [{ "id", "session_id", "text", "page", "visitor_id", "timestamp" }] }
    """
    unprocessed = []
    with _incoming_lock:
        for msg in _incoming_queue:
            if not msg.get("processed"):
                unprocessed.append({
                    "id": msg["id"],
                    "session_id": msg["session_id"],
                    "text": msg["text"],
                    "page": msg["page"],
                    "visitor_id": msg["visitor_id"],
                    "timestamp": msg["timestamp"],
                })

    return jsonify({
        "messages": unprocessed,
        "count": len(unprocessed),
    })


@app.route("/mark_processed", methods=["POST"])
def mark_processed():
    """
    Called by Hermes after processing a message.
    Body: { "ids": [123, 456] } — marks those queue IDs as processed.
    """
    try:
        body = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    ids = body.get("ids", [])
    with _incoming_lock:
        for msg in _incoming_queue:
            if msg["id"] in ids:
                msg["processed"] = True
        # Prune old processed messages
        _incoming_queue[:] = [m for m in _incoming_queue
                               if not m.get("processed") or
                               (datetime.now() - datetime.fromisoformat(m["timestamp"])).total_seconds() < 3600]

    return jsonify({"ok": True, "marked": len(ids)})


@app.route("/poll_telegram", methods=["GET"])
def poll_telegram():
    """
    Called by the Hermes cron agent to check for new Telegram messages.
    Returns messages sent TO the bot by the admin (replies/commands).
    
    Hermes should poll this every 30-60 seconds.
    Response shape:
    { "messages": [{ "chat_id": "...", "text": "...", "update_id": N }] }
    """
    updates = _poll_telegram_updates()
    new_messages = []

    for update in updates:
        update_id = update.get("update_id", 0)
        if update_id <= _last_update_id["id"]:
            continue  # already seen

        # Record the highest update_id we've processed
        if update_id > _last_update_id["id"]:
            _last_update_id["id"] = update_id

        for key in ("message", "edited_message"):
            msg = update.get(key, {})
            chat = msg.get("chat", {})
            text = msg.get("text", msg.get("caption", ""))

            # Skip empty or very short messages
            if not text or len(text.strip()) < 2:
                continue

            # Auto-register the admin chat_id from first inbound message
            if not _telegram_chat_id["chat_id"] and chat.get("id"):
                _telegram_chat_id["chat_id"] = str(chat["id"])
                log.info("Auto-registered admin chat_id from inbound: %s", chat["id"])

            new_messages.append({
                "chat_id": str(chat.get("id", "")),
                "text": text.strip(),
                "update_id": update_id,
                "from_first_name": msg.get("from", {}).get("first_name", ""),
            })

    return jsonify({
        "messages": new_messages,
        "count": len(new_messages),
        "last_update_id": _last_update_id["id"],
    })


@app.route("/relay_response", methods=["POST"])
def relay_response():
    """
    Called by the Hermes agent after it processes a message.
    Stores the response so the widget can poll for it.
    
    Expected JSON body:
    {
      "session_id": "uuid",
      "response": "Here's what we offer..."
    }
    """
    try:
        body = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    session_id = body.get("session_id", "").strip()
    response = body.get("response", "").strip()

    if not session_id or not response:
        return jsonify({"error": "session_id and response are required"}), 400

    _store_message(session_id, "agent", response)
    log.info("[%s] Agent response stored (%d chars)", session_id[:8], len(response))

    return jsonify({"ok": True})


@app.route("/messages/<session_id>", methods=["GET"])
def get_messages(session_id: str):
    """
    Called by the widget to poll for new agent responses.
    Also called by the Hermes agent to read session context.
    """
    if not session_id or len(session_id) < 8:
        return jsonify({"error": "Invalid session_id"}), 400

    messages = _get_messages(session_id)
    session = _get_session(session_id)
    widget_page = session.get("widget_page", "/")

    return jsonify({
        "session_id": session_id,
        "messages": messages,
        "count": len(messages),
        "page": widget_page,
    })


@app.route("/reset_session", methods=["POST"])
def reset_session():
    """Clear a session's message history."""
    body = request.get_json(force=True) or {}
    session_id = body.get("session_id", "").strip()
    if session_id and session_id in _session_store:
        with _session_lock:
            _session_store[session_id]["messages"] = []
    return jsonify({"ok": True})


# ── CLI interface ─────────────────────────────────────────────────────────────

def print_startup_banner():
    print()
    print("  ╔══════════════════════════════════════════╗")
    print("  ║   Codematics Web Chat Relay Server       ║")
    print("  ╠══════════════════════════════════════════╣")
    print(f"  ║  Bot:    {TELEGRAM_BOT_TOKEN[:10]}...       ║")
    print(f"  ║  Listen: http://{HOST}:{PORT}               ║")
    print("  ║  Routes:                                   ║")
    print("  ║    POST /webhook       ← Widget sends     ║")
    print("  ║    POST /relay_response ← Agent replies   ║")
    print("  ║    GET  /messages/<id> ← Widget polls    ║")
    print("  ║    GET  /health        ← Health check     ║")
    print("  ╚══════════════════════════════════════════╝")
    print()


if __name__ == "__main__":
    print_startup_banner()
    # Auto-detect Telegram admin chat_id on startup
    _register_telegram_webhook()
    app.run(host=HOST, port=PORT, debug=False, threaded=True)
