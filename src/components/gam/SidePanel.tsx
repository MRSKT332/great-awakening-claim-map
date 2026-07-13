"use client";

import { useState, useEffect } from "react";
import type { GAMNode } from "@/lib/gam/types";
import { CATEGORY_MAP } from "@/lib/gam/groups";
import { NODE_MAP } from "@/lib/gam";
import { NODE_IMAGES } from "@/lib/gam/images";
import { youtubeSearchUrlSmart } from "@/lib/gam/youtube";
import { X, Download, ExternalLink, Link2, Tag, Play, Image as ImageIcon, Sparkles, Star, Youtube } from "lucide-react";

interface Props {
  node: GAMNode | null;
  onClose: () => void;
  onSelect: (node: GAMNode) => void;
  onAskAI?: (node: GAMNode) => void;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export default function SidePanel({ node, onClose, onSelect, onAskAI, bookmarks, onToggleBookmark }: Props) {
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
        <h2 className="text-[22px] font-bold leading-tight text-white pr-16">{node.label}</h2>
        <button
          onClick={() => onToggleBookmark(node.id)}
          className="absolute top-4 right-14 w-8 h-8 rounded-full grid place-items-center transition"
          style={{
            background: bookmarks.has(node.id) ? "#ffea0022" : "transparent",
            border: `1px solid ${bookmarks.has(node.id) ? "#ffea0066" : "#262838"}`,
          }}
          aria-label={bookmarks.has(node.id) ? "Remove bookmark" : "Bookmark this topic"}
          title={bookmarks.has(node.id) ? "Bookmarked" : "Bookmark this topic"}
        >
          <Star
            size={14}
            className={bookmarks.has(node.id) ? "text-[#ffea00]" : "text-[#8a8ba3]"}
            fill={bookmarks.has(node.id) ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Scroll body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin" }}>
        {/* Image */}
        {(() => {
          const img = node.image ? { url: node.image, credit: node.imageCredit || "" } : NODE_IMAGES[node.id];
          if (!img) return null;
          return (
            <div className="rounded-lg overflow-hidden border border-[#262838] bg-black/30">
              <img
                src={img.url}
                alt={node.label}
                className="w-full max-h-[220px] object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {img.credit && (
                <div className="px-3 py-2 text-[10px] text-[#6a6b85] border-t border-[#262838] flex items-center gap-1.5">
                  <ImageIcon size={10} /> {img.credit}
                </div>
              )}
            </div>
          );
        })()}

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

        {/* YouTube — reliable search link card */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#8a8ba3] font-semibold mb-2 flex items-center gap-1.5">
            <Youtube size={11} className="text-[#ff4a4a]" /> Watch on YouTube
          </h3>
          <a
            href={youtubeSearchUrlSmart(node.label, node.category)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden border border-[#262838] hover:border-[#ff4a4a]/50 transition group"
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#1a1c28] to-[#0e0f17] grid place-items-center">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, #ff000022, transparent)" }} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full grid place-items-center" style={{ background: "#ff0000" }}>
                  <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                </div>
                <span className="text-[10px] text-[#8a8ba3] uppercase tracking-wider">Search YouTube</span>
              </div>
            </div>
            <div className="px-3 py-2.5 bg-[#14151f]">
              <div className="text-[12px] text-[#cfcfe0] font-medium">{node.label}</div>
              <div className="text-[10px] text-[#6a6b85] mt-0.5">Click to search — opens in a new tab</div>
            </div>
          </a>
        </div>
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
