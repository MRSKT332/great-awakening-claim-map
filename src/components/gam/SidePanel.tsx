"use client";

import { useState } from "react";
import type { GAMNode } from "@/lib/gam/types";
import { CATEGORY_MAP } from "@/lib/gam/groups";
import { NODE_MAP } from "@/lib/gam";
import { X, Download, ExternalLink, Link2, Tag, Sparkles } from "lucide-react";

interface Props {
  node: GAMNode | null;
  onClose: () => void;
  onSelect: (node: GAMNode) => void;
  onAskAI?: (node: GAMNode) => void;
}

export default function SidePanel({ node, onClose, onSelect, onAskAI }: Props) {
  const [copied, setCopied] = useState(false);

  if (!node) return null;
  const cat = CATEGORY_MAP[node.category];
  const related = (node.links || [])
    .map((id) => NODE_MAP[id])
    .filter(Boolean)
    .slice(0, 18);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(node, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${node.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadMd = () => {
    const lines: string[] = [];
    lines.push(`# ${node.label}`);
    lines.push("");
    lines.push(`**Category:** ${cat.label}`);
    lines.push("");
    lines.push(`## What this conspiracy claims`);
    lines.push("");
    lines.push(node.desc);
    lines.push("");
    if (node.sources && node.sources.length) {
      lines.push(`## Sources & references`);
      lines.push("");
      node.sources.forEach((s) => lines.push(`- [${s.label}](${s.url})`));
      lines.push("");
    }
    if (related.length) {
      lines.push(`## Related nodes`);
      lines.push("");
      related.forEach((r) => lines.push(`- ${r.label} (${CATEGORY_MAP[r.category].label})`));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${node.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/?node=${node.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-30 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0e0f17 0%, #11121c 100%)",
        borderLeft: "1px solid #262838",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div className="p-5 pt-6 relative" style={{ borderBottom: "1px solid #262838" }}>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition"
        >
          <X size={16} />
        </button>
        <div
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-full mb-3"
          style={{
            color: cat.color,
            border: `1px solid ${cat.color}66`,
            background: `${cat.color}11`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
          {cat.label}
        </div>
        <h2 className="text-[22px] font-bold leading-tight text-white pr-8">{node.label}</h2>
      </div>

      {/* Scroll body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin" }}>
        {/* Description */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8a8ba3] font-semibold mb-2 flex items-center gap-1.5">
            <Tag size={11} /> What this conspiracy claims
          </h3>
          <p className="text-[13.5px] leading-[1.7] text-[#cfcfe0]">{node.desc}</p>
        </div>

        {/* Sources */}
        {node.sources && node.sources.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8a8ba3] font-semibold mb-2 flex items-center gap-1.5">
              <ExternalLink size={11} /> Sources & references
            </h3>
            <ul className="space-y-1.5">
              {node.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-[#59e0d0] hover:underline flex items-start gap-1.5"
                  >
                    <ExternalLink size={11} className="mt-0.5 shrink-0 opacity-60" />
                    <span>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related nodes */}
        {related.length > 0 && (
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8a8ba3] font-semibold mb-2 flex items-center gap-1.5">
              <Link2 size={11} /> Related nodes ({related.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {related.map((r) => {
                const c = CATEGORY_MAP[r.category];
                return (
                  <button
                    key={r.id}
                    onClick={() => onSelect(r)}
                    className="text-[11.5px] px-2.5 py-1.5 rounded-md border transition hover:scale-[1.03]"
                    style={{
                      background: `${c.color}11`,
                      borderColor: `${c.color}55`,
                      color: "#cfcfe0",
                    }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: c.color }} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer — download / share */}
      <div className="p-4 border-t border-[#262838] bg-black/30 space-y-2">
        {onAskAI && (
          <button
            onClick={() => onAskAI(node)}
            className="w-full flex items-center justify-center gap-1.5 text-[12px] font-medium py-2 px-3 rounded-md text-white transition hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
          >
            <Sparkles size={13} /> Ask AI about this topic
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={downloadJson}
            className="flex items-center justify-center gap-1.5 text-[12px] py-2 px-3 rounded-md border border-[#262838] text-[#cfcfe0] hover:bg-white/5 transition"
          >
            <Download size={12} /> JSON
          </button>
          <button
            onClick={downloadMd}
            className="flex items-center justify-center gap-1.5 text-[12px] py-2 px-3 rounded-md border border-[#262838] text-[#cfcfe0] hover:bg-white/5 transition"
          >
            <Download size={12} /> Markdown
          </button>
        </div>
        <button
          onClick={copyLink}
          className="w-full flex items-center justify-center gap-1.5 text-[12px] py-2 px-3 rounded-md text-[#0a0b12] font-medium transition"
          style={{ background: copied ? "#4affa0" : "#ff6b4a" }}
        >
          {copied ? "Link copied!" : "Copy shareable link"}
        </button>
      </div>
    </div>
  );
}
