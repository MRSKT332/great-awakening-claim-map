"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { NODES, NODE_MAP, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  onSelect: (node: GAMNode) => void;
}

interface Match {
  node: GAMNode;
  matchedOn: "label" | "description" | "related";
  snippet?: string;
}

export default function SearchBar({ search, onSearch, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search logic — matches label, description, and related node names
  useEffect(() => {
    if (!search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches([]);
      setOpen(false);
      return;
    }
    const q = search.toLowerCase();
    const results: Match[] = [];
    for (const node of NODES) {
      if (node.label.toLowerCase().includes(q)) {
        results.push({ node, matchedOn: "label" });
        continue;
      }
      if (node.desc.toLowerCase().includes(q)) {
        const idx = node.desc.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const end = Math.min(node.desc.length, idx + q.length + 60);
        const snippet = (start > 0 ? "…" : "") + node.desc.substring(start, end) + (end < node.desc.length ? "…" : "");
        results.push({ node, matchedOn: "description", snippet });
        continue;
      }
      const relatedMatch = (node.links || []).find((id) =>
        NODE_MAP[id]?.label.toLowerCase().includes(q),
      );
      if (relatedMatch) {
        results.push({
          node,
          matchedOn: "related",
          snippet: `Related to: ${NODE_MAP[relatedMatch]?.label}`,
        });
      }
    }
    setMatches(results.slice(0, 12));
    setOpen(true);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = (node: GAMNode) => {
    onSelect(node);
    setOpen(false);
    onSearch("");
  };

  return (
    <div ref={containerRef} className="flex-1 max-w-md relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6b85] z-10" />
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => matches.length > 0 && setOpen(true)}
        placeholder="Search 284 topics — label, description, or related…"
        className="w-full bg-[#14151f] border border-[#262838] text-white text-[12.5px] pl-9 pr-8 py-2 rounded-md outline-none focus:border-[#ff6b4a]/60 transition relative z-10"
      />
      {search && (
        <button
          onClick={() => { onSearch(""); setOpen(false); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6a6b85] hover:text-white z-10"
        >
          <X size={13} />
        </button>
      )}

      {/* Dropdown */}
      {open && matches.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-md border border-[#262838] bg-[#0e0f17] shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#6a6b85] border-b border-[#262838]">
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </div>
          {matches.map((m, i) => {
            const cat = CATEGORY_MAP[m.node.category];
            return (
              <button
                key={i}
                onClick={() => handleSelect(m.node)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 transition border-b border-[#262838] last:border-0 flex items-start gap-2.5"
              >
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: cat.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-white truncate">{m.node.label}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#6a6b85] shrink-0">{cat.label}</span>
                  </div>
                  {m.snippet && (
                    <div className="text-[11px] text-[#8a8ba3] mt-0.5 line-clamp-2">
                      {m.snippet}
                    </div>
                  )}
                  {!m.snippet && (
                    <div className="text-[10px] text-[#6a6b85] mt-0.5">
                      Matched in {m.matchedOn}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
