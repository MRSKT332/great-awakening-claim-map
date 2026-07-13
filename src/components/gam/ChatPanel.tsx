"use client";

import { useEffect, useRef, useState } from "react";
import { NODES, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";
import { X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** When a node is selected, the chat is pre-seeded with that node's context. */
  currentNodeId?: string | null;
}

/**
 * Pollinations AI chat with full node-data context (RAG-style).
 *
 * The entire node dataset (id, label, category, description, links, sources)
 * is compiled into a compact system prompt that is sent with every chat
 * request. This gives the Pollinations model full knowledge of every node
 * on the map, so it can answer questions about any topic in depth.
 *
 * Pollinations text API:  https://text.pollinations.ai/
 */
export default function ChatPanel({ open, onClose, currentNodeId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build the system prompt once (compact representation of all 284 nodes)
  const systemPrompt = useRef<string>("");
  if (!systemPrompt.current) {
    const nodeContext = NODES.map((n) => {
      const cat = CATEGORY_MAP[n.category];
      const related = (n.links || [])
        .map((id) => NODES.find((x) => x.id === id)?.label || id)
        .slice(0, 8)
        .join(", ");
      const sources = (n.sources || []).map((s) => s.label).join("; ");
      return `### ${n.label} [${cat.label}]\n${n.desc}${related ? `\nRelated: ${related}` : ""}${sources ? `\nSources: ${sources}` : ""}`;
    }).join("\n\n");

    systemPrompt.current = `You are the AI guide for the "Great Awakening Claim Map" — an interactive 3D node graph mapping the claims of the "Great Awakening Map" conspiracy infographic (a 2018 poster by Tiff Fitzgibbon / Champ Parinya).

Your role: answer questions about ANY of the 284 topics on the map, in depth, drawing ONLY from the data provided below. Be helpful, neutral, and detailed.

FRAMING RULES (CRITICAL):
- Every answer is written from INSIDE the narrative — you describe what the conspiracy / claim / entity ALLEGES, who promotes it, where it sits in the larger map.
- Do NOT fact-check. Do NOT debunk. Do NOT add 'mainstream media says...' counterpoints.
- Do NOT endorse the claims either. Just describe what they assert, neutrally.
- When asked "is X true?" respond with "Within the narrative, X is described as..." and explain the claim — do not confirm or deny its real-world truth.
- When asked about connections between topics, explain how the narrative links them.
- When asked about a topic not in the data, say "That topic is not in the Great Awakening Map dataset" and suggest the closest related topic that IS in the data.

FORMAT:
- Be detailed but readable. Use short paragraphs. Use **bold** for node names. Use bullet lists for related topics.
- When you mention a topic that exists as a node, you can suggest the user click it by saying "See: [Node Name]".
- If the user asks about the map itself (how to use it, what categories exist), answer from the categories below.

CATEGORIES ON THE MAP:
${NODES.filter((n, i, arr) => arr.findIndex((x) => x.category === n.category) === i)
  .map((n) => `- ${CATEGORY_MAP[n.category].label} (${CATEGORY_MAP[n.category].color}) — ${CATEGORY_MAP[n.category].blurb}`)
  .join("\n")}

FULL NODE DATA (284 nodes — use this as your knowledge base):
${nodeContext}`;
  }

  // Seed initial greeting
  useEffect(() => {
    if (messages.length === 0 && open) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm the Great Awakening map guide. Ask me anything about any of the 284 topics on the map — QAnon, the Secret Space Program, Reptilians, Atlantis, the Great Solar Flash, Pineal Gland, anything. I have the full dataset as context and will explain what each conspiracy alleges in depth.",
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
        content: `I'm looking at the "${node.label}" node (${cat.label}). Tell me more about this — what's the conspiracy, who promotes it, and how does it connect to the rest of the map?`,
      },
    ]);
    // Auto-send
    setTimeout(() => send(node), 100);
  }, [currentNodeId, open]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = async (contextNode?: GAMNode) => {
    const userMsg = input.trim() || (contextNode ? `Tell me about "${contextNode.label}".` : "");
    if (!userMsg || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build the full message array with system prompt
      const apiMessages = [
        { role: "system", content: systemPrompt.current },
        ...newMessages.map((m) => ({ role: m.role, content: m.content })),
      ];

      // Pollinations text API — called via our server-side proxy to avoid
      // the Cloudflare Turnstile requirement on browser requests.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error(`Pollinations error: ${res.status}`);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't reach the AI service (${err.message}). The Pollinations API may be rate-limited or temporarily unavailable. Please try again in a moment.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

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
          AI guide powered by Pollinations. Has the full 284-node dataset as context. Describes what each conspiracy alleges — neutrally, no fact-checking.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className="w-7 h-7 rounded-lg grid place-items-center shrink-0 mt-0.5"
              style={{
                background: m.role === "user" ? "#ff6b4a" : "linear-gradient(135deg, #8f6bff, #4affa0)",
              }}
            >
              {m.role === "user" ? <User size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
            </div>
            <div
              className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-[13px] leading-[1.6] whitespace-pre-wrap`}
              style={{
                background: m.role === "user" ? "#ff6b4a15" : "#1a1c28",
                border: `1px solid ${m.role === "user" ? "#ff6b4a44" : "#262838"}`,
                color: "#e7e6f0",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div
              className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
              style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
            >
              <Bot size={13} className="text-white" />
            </div>
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2 text-[12px] text-[#8a8ba3]"
              style={{ background: "#1a1c28", border: "1px solid #262838" }}
            >
              <Loader2 size={13} className="animate-spin" /> Thinking...
            </div>
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
            placeholder="Ask about any topic on the map..."
            className="flex-1 bg-[#14151f] border border-[#262838] text-white text-[13px] px-3.5 py-2.5 rounded-lg outline-none focus:border-[#8f6bff]/60 transition"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-lg grid place-items-center text-white transition disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
            aria-label="Send"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
