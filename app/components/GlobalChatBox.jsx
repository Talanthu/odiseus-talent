"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./global-chat.css";

/* ─────────────────────────────────────────────────────────────
   Static Q&A. Swap `answerFor()` for an API/agent call later —
   the rest of the component does not need to change.
   ───────────────────────────────────────────────────────────── */
const QUICK_QUESTIONS = [
  {
    q: "What does Odiseus do?",
    a: "Odiseus is a boutique, senior, specialist technology partner. We design, modernise, automate, secure, and scale digital operations through Software, Cloud, DevOps, AI, and Business Analysis services.",
  },
  {
    q: "Do you provide cloud engineering?",
    a: "Yes — cloud migration & strategy, AWS and Azure infrastructure, Kubernetes, serverless and Well-Architected design are core specialisms.",
  },
  {
    q: "Can you help with DevOps?",
    a: "Absolutely. We build CI/CD pipelines, Infrastructure as Code, GitOps, DevSecOps and full platform engineering so your teams ship faster and safer.",
  },
  {
    q: "Do you build AI agents?",
    a: "We do — AI assistants & agents, MCP servers, RAG systems and workflow automation, taken from proof-of-concept through to production.",
  },
  {
    q: "Can I hire talent through Odiseus?",
    a: "Yes. Odiseus Talent is our specialist tech recruitment practice for DevOps, Cloud and AI roles. Visit the Talent page or tell us what you need.",
  },
  {
    q: "How do I start a project?",
    a: "Tell us a little about your goals and we'll connect you with a senior practitioner. You can also email hr@odiseussoftware.com to get started.",
  },
];

const WELCOME =
  "Hi, I'm the Odiseus assistant. Ask me about Cloud, DevOps, AI, Software, or Talent.";

const FALLBACK =
  "I can help with Cloud, DevOps, AI, Software, Talent, and project enquiries. Choose a question below or leave your message.";

/* Lightweight intent matcher over the same answers. */
const INTENTS = [
  { keys: ["what do", "what does", "about odiseus", "who are you", "what is odiseus"], a: QUICK_QUESTIONS[0].a },
  { keys: ["cloud", "aws", "azure", "kubernetes", "k8s", "migration", "infrastructure", "serverless"], a: QUICK_QUESTIONS[1].a },
  { keys: ["devops", "ci/cd", "cicd", "pipeline", "platform engineering", "gitops", "sre", "iac"], a: QUICK_QUESTIONS[2].a },
  { keys: ["ai", "agent", "ml", "machine learning", "genai", "llm", "rag", "mcp", "automation"], a: QUICK_QUESTIONS[3].a },
  { keys: ["talent", "hire", "hiring", "recruit", "candidate", "staff", "engineer for"], a: QUICK_QUESTIONS[4].a },
  { keys: ["start", "begin", "project", "get started", "engage", "contact", "quote", "kick off"], a: QUICK_QUESTIONS[5].a },
];

function answerFor(text) {
  const t = text.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some((k) => t.includes(k))) return intent.a;
  }
  return FALLBACK;
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function GlobalChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const cursorRef = useRef(null);
  const restoreFocus = useRef(null);
  const typingTimer = useRef(null);

  const openChat = useCallback(() => {
    restoreFocus.current =
      typeof document !== "undefined" ? document.activeElement : null;
    setMessages((m) => (m.length ? m : [{ role: "bot", text: WELCOME }]));
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => setOpen(false), []);

  /* Wire every "Start a conversation" CTA across the site (delegated). */
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest && e.target.closest("a, button, [data-chat-open]");
      if (!el) return;
      const text = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      const isTrigger =
        el.hasAttribute("data-chat-open") ||
        (text.length < 60 && text.includes("start a conversation"));
      if (!isTrigger) return;
      e.preventDefault();
      openChat();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openChat]);

  /* Escape to close, outside-click to close, focus management. */
  useEffect(() => {
    if (!open) {
      const prev = restoreFocus.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus();
        } catch (err) {
          /* element gone — ignore */
        }
      }
      return;
    }

    const onKey = (e) => {
      if (e.key === "Escape") closeChat();
    };
    const onDown = (e) => {
      const p = panelRef.current;
      const l = launcherRef.current;
      if (p && !p.contains(e.target) && (!l || !l.contains(e.target))) {
        closeChat();
      }
    };

    document.addEventListener("keydown", onKey);
    /* Bind outside-click on the next tick so the opening click doesn't close it. */
    const bindId = window.setTimeout(
      () => document.addEventListener("mousedown", onDown),
      0,
    );
    const focusId = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 140);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      window.clearTimeout(bindId);
      window.clearTimeout(focusId);
    };
  }, [open, closeChat]);

  /* Keep the conversation scrolled to the latest message. */
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  /* Custom Odiseus cursor inside the panel (fine-pointer devices only). */
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const panel = panelRef.current;
    const cur = cursorRef.current;
    if (!panel || !cur) return;

    const move = (e) => {
      cur.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const overInput = !!(e.target.closest && e.target.closest(".chat-input"));
      const interactive =
        !overInput &&
        !!(e.target.closest && e.target.closest("button, .chat-chip, a"));
      cur.classList.toggle("chat-cursor-hidden", overInput);
      cur.classList.toggle("chat-cursor-lg", interactive);
    };
    const enter = () => {
      panel.classList.add("chat-cursor-active");
      cur.classList.add("chat-cursor-show");
    };
    const leave = () => {
      panel.classList.remove("chat-cursor-active");
      cur.classList.remove("chat-cursor-show");
    };

    panel.addEventListener("mousemove", move);
    panel.addEventListener("mouseenter", enter);
    panel.addEventListener("mouseleave", leave);
    return () => {
      panel.removeEventListener("mousemove", move);
      panel.removeEventListener("mouseenter", enter);
      panel.removeEventListener("mouseleave", leave);
      panel.classList.remove("chat-cursor-active");
      cur.classList.remove("chat-cursor-show");
    };
  }, [open]);

  const respond = useCallback((userText, answer) => {
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setInput("");
    setTyping(true);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [...m, { role: "bot", text: answer }]);
      },
      reduceMotion() ? 200 : 760,
    );
  }, []);

  const askQuick = (qa) => respond(qa.q, qa.a);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    respond(text, answerFor(text));
  };

  return (
    <div className={`chat-root${open ? " chat-open" : ""}`}>
      {/* Mobile dimmer / outside-tap target (non-blocking on desktop) */}
      <div className="chat-backdrop" onClick={closeChat} aria-hidden="true" />

      <section
        className="chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Odiseus assistant"
        aria-hidden={!open}
        ref={panelRef}
      >
        <header className="chat-header">
          <span className="chat-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 16" width="22" height="15">
              <circle cx="7" cy="11" r="4" fill="#fff" opacity="0.92" />
              <circle cx="13" cy="8" r="5.5" fill="#fff" opacity="0.92" />
              <circle cx="18" cy="11" r="3.5" fill="#fff" opacity="0.92" />
              <rect x="3" y="11" width="19" height="5" rx="1.5" fill="#fff" opacity="0.92" />
            </svg>
          </span>
          <div className="chat-id">
            <span className="chat-name">Odiseus Assistant</span>
            <span className="chat-status">
              <i className="chat-dot" aria-hidden="true" />
              Online
            </span>
          </div>
          <button
            type="button"
            className="chat-close"
            onClick={closeChat}
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="chat-body" ref={bodyRef} aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-${m.role}`}>
              <p className="chat-bubble">{m.text}</p>
            </div>
          ))}
          {typing && (
            <div className="chat-msg chat-bot">
              <p className="chat-bubble chat-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </p>
            </div>
          )}
        </div>

        <div className="chat-quick" role="group" aria-label="Quick questions">
          {QUICK_QUESTIONS.map((qa) => (
            <button
              key={qa.q}
              type="button"
              className="chat-chip"
              onClick={() => askQuick(qa)}
            >
              {qa.q}
            </button>
          ))}
        </div>

        <form className="chat-input" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="chat-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Cloud, DevOps, AI, Talent…"
            aria-label="Type your message"
            autoComplete="off"
          />
          <button
            type="submit"
            className="chat-send"
            aria-label="Send message"
            disabled={!input.trim()}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M4 12l16-8-6 16-3-7-7-1z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </section>

      {/* Floating launcher — opens/closes the assistant anywhere on the site. */}
      <button
        type="button"
        ref={launcherRef}
        className="chat-launcher"
        onClick={open ? closeChat : openChat}
        aria-label={open ? "Close Odiseus assistant" : "Open Odiseus assistant"}
        aria-expanded={open}
      >
        <svg
          className="chat-launcher-icon chat-launcher-chat"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <path
            d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9A1.5 1.5 0 0118.5 16H9l-4 4v-4H5.5A1.5 1.5 0 014 14.5v-9z"
            fill="currentColor"
          />
          <circle cx="9" cy="10" r="1.1" fill="#fff" />
          <circle cx="12" cy="10" r="1.1" fill="#fff" />
          <circle cx="15" cy="10" r="1.1" fill="#fff" />
        </svg>
        <svg
          className="chat-launcher-icon chat-launcher-x"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Custom premium cursor (desktop / fine-pointer only, driven by JS) */}
      <div className="chat-cursor" ref={cursorRef} aria-hidden="true">
        <span className="chat-cursor-ring" />
      </div>
    </div>
  );
}
