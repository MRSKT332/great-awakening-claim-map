"use client";

import { useState } from "react";
import { Search, X, Info, Download, Github } from "lucide-react";
import { CATEGORIES, NODES, LINKS } from "@/lib/gam";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  active: Set<string>;
  onToggleCategory: (id: string) => void;
  onShowIntro: () => void;
}

export default function TopBar({
  search,
  onSearch,
  active,
  onToggleCategory,
  onShowIntro,
}: Props) {
  const [showLegend, setShowLegend] = useState(true);

  const downloadWholeMap = () => {
    const data = {
      generated: new Date().toISOString(),
      source: "Great Awakening Map — interactive node graph",
      nodes: NODES,
      links: LINKS,
      categories: CATEGORIES,
      note: "All descriptions are written neutrally and explain what each conspiracy / claim / entity alleges — they do not endorse or debunk the claims.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "great-awakening-map.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md"
      style={{
        background: "linear-gradient(180deg, rgba(6,7,13,0.96), rgba(6,7,13,0.78))",
        borderBottom: "1px solid #262838",
      }}
    >
      <div className="flex items-center gap-3 px-4 sm:px-5 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#ff6b4a", boxShadow: "0 0 12px #ff6b4a" }}
          />
          <span className="font-bold text-[13px] sm:text-[14px] tracking-wide whitespace-nowrap">
            GREAT AWAKENING — claim map
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6b85]" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search 284 nodes — QAnon, Mars, Blue Avians, Reptilians…"
            className="w-full bg-[#14151f] border border-[#262838] text-white text-[12.5px] pl-9 pr-8 py-2 rounded-md outline-none focus:border-[#ff6b4a]/60 transition"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6a6b85] hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Stats badge */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-[#8a8ba3] px-2.5 py-1 rounded-md border border-[#262838] bg-[#14151f]/50">
          <span className="text-white font-semibold">{NODES.length}</span> nodes
          <span className="opacity-40">·</span>
          <span className="text-white font-semibold">{LINKS.length}</span> links
        </div>

        {/* Actions */}
        <button
          onClick={onShowIntro}
          className="w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition"
          aria-label="About this map"
          title="About this map"
        >
          <Info size={15} />
        </button>
        <button
          onClick={downloadWholeMap}
          className="hidden sm:grid w-8 h-8 rounded-md place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition"
          aria-label="Download entire map as JSON"
          title="Download entire map as JSON"
        >
          <Download size={14} />
        </button>
        <button
          onClick={() => setShowLegend((s) => !s)}
          className="text-[11px] uppercase tracking-wider text-[#8a8ba3] hover:text-white px-2.5 py-1.5 rounded-md border border-[#262838] hover:border-[#4a4d65] transition"
        >
          {showLegend ? "Hide" : "Show"} legend
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="px-4 sm:px-5 pb-2.5 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const count = NODES.filter((n) => n.category === c.id).length;
            const on = active.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => onToggleCategory(c.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] transition hover:scale-[1.03]"
                style={{
                  borderColor: on ? `${c.color}77` : "#262838",
                  background: on ? `${c.color}15` : "transparent",
                  color: on ? "#e7e6f0" : "#6a6b85",
                  opacity: on ? 1 : 0.55,
                }}
                title={c.blurb}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: c.color, opacity: on ? 1 : 0.5 }}
                />
                <span>{c.label}</span>
                <span className="text-[10px] opacity-50">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
