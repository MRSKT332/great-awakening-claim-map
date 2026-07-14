"use client";

import { useState } from "react";
import { X, Info, FileDown, Sparkles, ChevronDown, BookOpen, GraduationCap, Route, Bookmark as BookmarkIcon } from "lucide-react";
import { CATEGORIES, NODES } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";
import SearchBar from "./SearchBar";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  active: Set<string>;
  onToggleCategory: (id: string) => void;
  onShowIntro: () => void;
  onOpenChat: () => void;
  onOpenStudy: () => void;
  onOpenGlossary: () => void;
  onOpenPathFinder: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  onSelect: (node: GAMNode) => void;
}

export default function TopBar({
  search,
  onSearch,
  active,
  onToggleCategory,
  onShowIntro,
  onOpenChat,
  onOpenStudy,
  onOpenGlossary,
  onOpenPathFinder,
  onOpenBookmarks,
  bookmarkCount,
  onSelect,
}: Props) {
  const [showLegend, setShowLegend] = useState(true);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md"
      style={{
        background: "linear-gradient(180deg, rgba(6,7,13,0.96), rgba(6,7,13,0.78))",
        borderBottom: "1px solid #262838",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#ff6b4a", boxShadow: "0 0 12px #ff6b4a" }}
          />
          <span className="font-bold text-[12px] sm:text-[14px] tracking-wide whitespace-nowrap hidden sm:inline">
            GREAT AWAKENING — claim map
          </span>
        </div>

        {/* Search (new component with dropdown) */}
        <SearchBar search={search} onSearch={onSearch} onSelect={onSelect} />

        {/* Stats badge */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#8a8ba3] px-2.5 py-1 rounded-md border border-[#262838] bg-[#14151f]/50 shrink-0">
          <span className="text-white font-semibold">{NODES.length}</span> topics
        </div>

        {/* Tool buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenStudy}
            className="w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-[#4affa0] hover:bg-white/5 transition"
            aria-label="Study Order"
            title="Study Order — guided path for new members"
          >
            <GraduationCap size={16} />
          </button>
          <button
            onClick={onOpenGlossary}
            className="w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-[#59e0d0] hover:bg-white/5 transition"
            aria-label="Glossary"
            title="Glossary — jargon & key terms"
          >
            <BookOpen size={16} />
          </button>
          <button
            onClick={onOpenPathFinder}
            className="w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-[#ffea00] hover:bg-white/5 transition"
            aria-label="Path Finder"
            title="Path Finder — how two topics connect"
          >
            <Route size={16} />
          </button>
          <button
            onClick={onOpenBookmarks}
            className="relative w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-[#ffea00] hover:bg-white/5 transition"
            aria-label="Bookmarks"
            title="Bookmarks — saved topics"
          >
            <BookmarkIcon size={16} />
            {bookmarkCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[8px] font-bold grid place-items-center text-[#0a0b12]"
                style={{ background: "#ffea00" }}
              >
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>

        {/* Ask AI */}
        <button
          onClick={onOpenChat}
          className="flex items-center gap-1.5 text-[12px] font-medium px-2.5 sm:px-3 py-1.5 rounded-md text-white transition hover:scale-[1.03] shrink-0"
          style={{ background: "linear-gradient(135deg, #8f6bff, #4affa0)" }}
          title="Ask the AI guide about any topic"
        >
          <Sparkles size={13} />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* PDF download — prominent labeled button */}
        <a
          href="/great-awakening-map-poster.pdf"
          download
          className="flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 sm:px-3 py-1.5 rounded-md border border-[#ff6b4a]/40 text-[#ff6b4a] hover:bg-[#ff6b4a]/10 transition shrink-0"
          aria-label="Download the original Great Awakening Map poster (PDF)"
          title="Download the original poster (PDF, 7.5 MB)"
        >
          <FileDown size={14} />
          <span className="hidden md:inline">Download Map</span>
        </a>

        <button
          onClick={onShowIntro}
          className="w-8 h-8 rounded-md grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition shrink-0"
          aria-label="About this map"
          title="About this map"
        >
          <Info size={15} />
        </button>

        <button
          onClick={() => setShowLegend((s) => !s)}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#8a8ba3] hover:text-white px-2.5 py-1.5 rounded-md border border-[#262838] hover:border-[#4a4d65] transition shrink-0"
          title="Toggle category legend"
        >
          <span className="hidden sm:inline">{showLegend ? "Hide" : "Show"} legend</span>
          <ChevronDown size={11} className={showLegend ? "rotate-180 transition" : "transition"} />
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="px-3 sm:px-5 pb-2.5 flex flex-wrap gap-1.5">
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
