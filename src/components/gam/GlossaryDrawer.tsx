"use client";

import { useState } from "react";
import { X, BookOpen, Search as SearchIcon } from "lucide-react";
import { GLOSSARY } from "@/lib/gam/glossary";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlossaryDrawer({ open, onClose }: Props) {
  const [filter, setFilter] = useState("");
  if (!open) return null;

  const filtered = GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(filter.toLowerCase()) ||
      g.definition.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0e0f17, #11121c)",
        borderLeft: "1px solid #262838",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
      }}
    >
      <div className="p-5 relative border-b border-[#262838]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={16} className="text-[#59e0d0]" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#59e0d0] font-semibold">
            Glossary
          </span>
        </div>
        <h2 className="text-[18px] font-bold text-white">Jargon & key terms</h2>
        <p className="text-[11.5px] text-[#8a8ba3] mt-1">
          Definitions of {GLOSSARY.length} terms used across the map.
        </p>
        <div className="relative mt-3">
          <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6b85]" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter terms…"
            className="w-full bg-[#14151f] border border-[#262838] text-white text-[12.5px] pl-9 pr-3 py-1.5 rounded-md outline-none focus:border-[#59e0d0]/60"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
        {filtered.map((g, i) => (
          <div key={i} className="rounded-lg border border-[#262838] bg-[#14151f] p-3">
            <div className="text-[13px] font-semibold text-[#59e0d0] mb-1">{g.term}</div>
            <div className="text-[12.5px] text-[#cfcfe0] leading-relaxed">{g.definition}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-[#6a6b85] text-[12px] py-8">No terms match your filter.</div>
        )}
      </div>
    </div>
  );
}
