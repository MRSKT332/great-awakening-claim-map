"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { NODES, CATEGORY_MAP } from "@/lib/gam";
import { findRelevantNodes, buildSystemPrompt } from "@/lib/gam/rag";
import type { GAMNode } from "@/lib/gam/types";
import {
  X, Send, Sparkles, Bot, User, Loader2, AlertCircle, RefreshCw,
  Search, Brain, Zap, Clock,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentNodeId?: string | null;
}

type LoadingPhase = "idle" | "searching" | "sending" | "streaming" | "done" | "error";

const PHASE_LABELS: Record<LoadingPhase, { label: string; sublabel: string; icon: typeof Loader2 }> = {
  idle:      { label: "", sublabel: "", icon: Loader2 },
  searching: { label: "Searching knowledge base…", sublabel: "Finding relevant topics", icon: Search },
  sending:   { label: "Connecting to AI…", sublabel: "Usually takes 2-5 seconds", icon: Zap },
  streaming: { label: "AI is responding…", sublabel: "Streaming answer in real-time", icon: Brain },
  done:      { label: "", sublabel: "", icon: Loader2 },
  error:     { label: "Connection failed", sublabel: "Click retry or try again", icon: AlertCircle },
};

export default function ChatPanel({ open, onClose, currentNodeId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<LoadingPhase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed initial greeting
  useEffect(() => {
    if (messages.length === 0 && open) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm the Great Awakening map guide. Ask me about any of the 284 topics — QAnon, the Secret Space Program, Reptilians, Atlantis, the Great Solar Flash, the Pineal Gland, anything. I'll explain what each conspiracy alleges, neutrally.\n\n💡 **Tip:** I search the map's knowledge base for relevant topics before each answer, so responses are fast and focused.",
        },
      ]);
    }
  }, [open, messages.length]);

  // If a node is selected, seed a context message
  useEffect(() => {
    if (!open || !currentNodeId) return;
    const node = NODES.find((n) => n.id === currentNodeId);
    if (!node) return;
    const cat = CATEGORY_MAP[node.category];
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `I'm looking at the "${node.label}" node (${cat.label}). Tell me more — what's the conspiracy, who promotes it, and how does it connect to the rest of the map?`,
      },
    ]);
    setTimeout(() => send(undefined, node), 200);
  }, [currentNodeId, open]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, phase]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Timer for elapsed seconds
  useEffect(() => {
    if (phase === "searching" || phase === "sending" || phase === "streaming") {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const send = useCallback(async (contextNode?: GAMNode, isRetry = false) => {
    const userMsg = input.trim() || (contextNode ? `Tell me about "${contextNode.label}".` : "");
    if (!userMsg || phase === "searching" || phase === "sending" || phase === "streaming") return;

    setInput("");
    setRetryCount(0);
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);

    // Phase 1: Search knowledge base (RAG)
    setPhase("searching");
    // Small delay to show the searching phase (also gives the UI time to render)
    await new Promise((r) => setTimeout(r, 300));

    const relevantNodes = findRelevantNodes(userMsg, 15);
    const systemPrompt = buildSystemPrompt(relevantNodes);

    // Phase 2: Send to AI
    setPhase("sending");

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...newMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      // Use NON-streaming — Pollinations streaming is unreliable (returns
      // fragments out of order, often incomplete). Non-streaming gives us
      // the complete response reliably. We simulate a typing effect client-side
      // for good UX during the wait.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, stream: false }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          let retryAfter = "a moment";
          try {
            const data = await res.json();
            if (data.retryAfter) retryAfter = `${data.retryAfter} seconds`;
          } catch {}
          throw new Error(`You're asking questions too fast. Please wait ${retryAfter} and try again.`);
        }
        if (res.status === 413) {
          throw new Error("Your question is too long. Please shorten it and try again.");
        }
        throw new Error("The AI service is busy. Please try again.");
      }

      const data = await res.json();
      const fullContent = data.choices?.[0]?.message?.content || "";

      if (!fullContent) {
        throw new Error("The AI returned an empty response. Please try again.");
      }

      // Phase 3: Simulate streaming by revealing the response progressively
      setPhase("streaming");
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Reveal the content in chunks for a smooth typing effect
      const words = fullContent.split(" ");
      const chunkSize = Math.max(2, Math.ceil(words.length / 60)); // ~60 updates total
      let revealed = "";

      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize).join(" ");
        revealed += (i > 0 ? " " : "") + chunk;
        const currentRevealed = revealed;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: currentRevealed,
          };
          return updated;
        });
        // Small delay between chunks — ~25ms for smooth typing
        await new Promise((r) => setTimeout(r, 25));
      }

      // Ensure full content is shown
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: fullContent };
        return updated;
      });

      setPhase("done");
      setTimeout(() => setPhase("idle"), 300);
    } catch (err: any) {
      // Retry up to 2 times on failure
      if (retryCount < 2) {
        setRetryCount((c) => c + 1);
        setPhase("sending");
        // Wait a moment before retry
        await new Promise((r) => setTimeout(r, 1000));
        // Restore the input and messages, then retry
        setMessages(newMessages.slice(0, -1)); // remove the failed user msg (will be re-added)
        setInput(userMsg);
        setTimeout(() => send(undefined, undefined), 100);
        return;
      }

      setPhase("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't reach the AI service after ${retryCount + 1} attempts (${err.message}). The free AI service may be busy right now. Please try again in a moment — the service usually recovers within a few seconds.`,
          isError: true,
        },
      ]);
    }
  }, [input, messages, phase, retryCount]);

  const retry = () => {
    // Remove the last error message
    setMessages((prev) => {
      const filtered = prev.filter((m) => !m.isError);
      return filtered;
    });
    setPhase("idle");
    setRetryCount(0);
    // Resend the last user message
    const lastUser = [...messages].reverse().find((m) => m.role === "user" && !m.isError);
    if (lastUser) {
      setInput(lastUser.content);
      setTimeout(() => send(), 100);
    }
  };

  if (!open) return null;

  const PhaseIcon = PHASE_LABELS[phase].icon;
  const isLoading = phase === "searching" || phase === "sending" || phase === "streaming";

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0e0f17 0%, #11121c 100%)",
        borderLeft: "1px solid #262838",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 relative" style={{ borderBottom: "1px solid #262838" }}>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg grid place-items-center"
            style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-[15px] text-white">Ask the Map</span>
        </div>
        <p className="text-[11.5px] text-[#8a8ba3] pr-8 leading-relaxed">
          AI guide with RAG search across 284 topics. Describes what each conspiracy alleges — neutrally, no fact-checking.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className="w-7 h-7 rounded-lg grid place-items-center shrink-0 mt-0.5"
              style={{
                background: m.role === "user"
                  ? "#ff6b4a"
                  : m.isError ? "#ef4444" : "linear-gradient(135deg, #8f6bff, #4affa0)",
              }}
            >
              {m.role === "user"
                ? <User size={13} className="text-white" />
                : m.isError ? <AlertCircle size={13} className="text-white" /> : <Bot size={13} className="text-white" />
              }
            </div>
            <div
              className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-[13px] leading-[1.6] whitespace-pre-wrap break-words`}
              style={{
                background: m.role === "user"
                  ? "#ff6b4a15"
                  : m.isError ? "#ef444415" : "#1a1c28",
                border: `1px solid ${
                  m.role === "user"
                    ? "#ff6b4a44"
                    : m.isError ? "#ef444444" : "#262838"
                }`,
                color: "#e7e6f0",
              }}
            >
              {m.content}
              {/* Show typing cursor while streaming */}
              {phase === "streaming" && i === messages.length - 1 && m.role === "assistant" && (
                <span className="inline-block w-2 h-4 ml-0.5 bg-[#4affa0] animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div
              className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
              style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
            >
              <PhaseIcon size={13} className={`text-white ${phase !== "streaming" ? "animate-spin" : "animate-pulse"}`} />
            </div>
            <div
              className="rounded-xl px-4 py-3 space-y-1"
              style={{ background: "#1a1c28", border: "1px solid #262838" }}
            >
              <div className="flex items-center gap-2 text-[12.5px] text-white font-medium">
                {PHASE_LABELS[phase].label}
                {/* Animated dots */}
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#4affa0] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#4affa0] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#4affa0] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-[#8a8ba3]">
                <Clock size={10} />
                {PHASE_LABELS[phase].sublabel}
                {elapsed > 0 && <span className="ml-1 text-[#6a6b85]">· {elapsed}s elapsed</span>}
              </div>
            </div>
          </div>
        )}

        {/* Error retry button */}
        {phase === "error" && (
          <div className="flex justify-center">
            <button
              onClick={retry}
              className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-md border border-[#262838] text-[#cfcfe0] hover:bg-white/5 transition"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#262838] bg-black/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask about any topic on the map…"
            className="flex-1 bg-[#14151f] border border-[#262838] text-white text-[13px] px-3.5 py-2.5 rounded-lg outline-none focus:border-[#8f6bff]/60 transition"
            disabled={isLoading}
          />
          <button
            onClick={() => send()}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-lg grid place-items-center text-white transition disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
            aria-label="Send"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
        <div className="text-[10px] text-[#6a6b85] mt-2 text-center">
          Powered by Pollinations AI · Free, no signup · Responses typically take 3-10 seconds
        </div>
      </div>
    </div>
  );
}
