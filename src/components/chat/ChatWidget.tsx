"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, Send, Bot, User, RefreshCw } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Codematics Chat Widget
   ─────────────────────────────────────────────────────────────────────────────
   Embed this component in your layout or page.

   Props:
     relayUrl  — base URL of the relay server (e.g. "https://api.codematics.ai")
                  Set NEXT_PUBLIC_RELAY_URL in .env.local
     agentName — display name of the bot (default: "Codematics AI")
     welcomeMsg — first message shown when widget opens (default: provided)
     themeColor — CSS color string (default: emerald-500)
     position   — "bottom-right" | "bottom-left" (default: "bottom-right")
   ─────────────────────────────────────────────────────────────────────────── */

interface Message {
  sender: "widget" | "agent";
  text: string;
  timestamp: string;
}

interface ChatWidgetProps {
  relayUrl?: string;
  agentName?: string;
  welcomeMsg?: string;
  themeColor?: string;
  position?: "bottom-right" | "bottom-left";
}

function generateSessionId() {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 9)
  );
}

function getVisitorId() {
  if (typeof window === "undefined") return "";
  let vid = localStorage.getItem("codematics_visitor_id");
  if (!vid) {
    vid = "v-" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("codematics_visitor_id", vid);
  }
  return vid;
}

export default function ChatWidget({
  relayUrl,
  agentName = "Codematics AI",
  welcomeMsg = "👋 Hi there! I'm the Codematics AI assistant. I can help you learn about our AI agent workforce services, pricing, and how we can help grow your business. What would you like to know?",
  themeColor = "#10b981",
  position = "bottom-right",
}: ChatWidgetProps) {
  const baseUrl = relayUrl || process.env.NEXT_PUBLIC_RELAY_URL || "http://localhost:8080";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() =>
    typeof window !== "undefined"
      ? (sessionStorage.getItem("codematics_session_id") ||
          (() => {
            const id = generateSessionId();
            sessionStorage.setItem("codematics_session_id", id);
            return id;
          })())
      : generateSessionId()
  );
  const [lastTimestamp, setLastTimestamp] = useState("");
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isBottom = position === "bottom-right" || position === "bottom-left";
  const horizontalPos = position.includes("right") ? "right-5" : "left-5";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for agent responses
  useEffect(() => {
    if (!isOpen) return;

    const poll = async () => {
      try {
        const resp = await fetch(
          `${baseUrl}/messages/${sessionId}${lastTimestamp ? `?after=${encodeURIComponent(lastTimestamp)}` : ""}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.messages && data.messages.length > 0) {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.timestamp + m.text.slice(0, 20)));
              const newMsgs = data.messages.filter(
                (m: Message) => !existingIds.has(m.timestamp + m.text.slice(0, 20))
              );
              return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
            });
            setLastTimestamp(data.messages[data.messages.length - 1]?.timestamp || lastTimestamp);
          }
        }
      } catch {
        // Silently ignore polling errors — widget should not crash
      }
    };

    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [isOpen, baseUrl, sessionId, lastTimestamp]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setMessages([
        {
          sender: "agent",
          text: welcomeMsg,
          timestamp: new Date().toISOString(),
        },
      ]);
      setLastTimestamp(new Date().toISOString());
    }
  }, [isOpen, hasOpened, welcomeMsg]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        sender: "widget",
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLastTimestamp(userMsg.timestamp);
      setInput("");
      setIsLoading(true);

      try {
        // Send to relay → Telegram → Hermes Agent
        const resp = await fetch(`${baseUrl}/webhook`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            message: text.trim(),
            page: typeof window !== "undefined" ? window.location.pathname : "/",
            visitor_id: getVisitorId(),
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${resp.status}`);
        }

        // Agent response comes asynchronously via polling
      } catch (err) {
        console.error("[ChatWidget] Failed to send message:", err);
        const errorMsg: Message = {
          sender: "agent",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach us directly at **hello@codematics.ai**.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setLastTimestamp(errorMsg.timestamp);
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl, sessionId, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input);
    }
  };

  return (
    <>
      {/* Chat bubble button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Open chat"
          style={{ backgroundColor: themeColor }}
          className="fixed bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-5 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl shadow-2xl sm:w-[400px] md:w-[440px]`}
          style={{
            [position.includes("right") ? "right" : "left"]: "1.25rem",
            bottom: "1.25rem",
            maxHeight: "600px",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: themeColor }}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white" />
              <span className="font-semibold text-white">{agentName}</span>
              <span className="flex h-2 w-2 rounded-full bg-white opacity-80">
                <span
                  className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-white opacity-75"
                  style={{ animationDuration: "2s" }}
                />
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Messages ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{
              backgroundColor: "#0a0a0a",
              maxHeight: "420px",
              minHeight: "280px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex items-end gap-2 ${
                  msg.sender === "widget" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: msg.sender === "widget" ? themeColor : "#1a1a1a",
                  }}
                >
                  {msg.sender === "widget" ? (
                    <User className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className="max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={{
                    backgroundColor: msg.sender === "widget" ? themeColor : "#1a1a1a",
                    color: "#fafafa",
                    borderBottomRightRadius: msg.sender === "widget" ? "4px" : "12px",
                    borderBottomLeftRadius: msg.sender === "widget" ? "12px" : "4px",
                  }}
                >
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="mb-3 flex items-end gap-2">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div
                  className="flex items-center gap-1 rounded-2xl rounded-bl-md px-3 py-2"
                  style={{ backgroundColor: "#1a1a1a" }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        backgroundColor: "#9ca3af",
                        animationDelay: `${d * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-white/10 px-3 py-3"
            style={{ backgroundColor: "#111111" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-all"
              style={{ backgroundColor: "#1a1a1a", minHeight: "40px", maxHeight: "100px" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all"
              style={{
                backgroundColor: input.trim() ? themeColor : "#1a1a1a",
                cursor: input.trim() ? "pointer" : "not-allowed",
                opacity: input.trim() ? 1 : 0.5,
              }}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
