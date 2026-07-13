"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NODES, LINKS, CATEGORIES, NODE_MAP, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";
import Graph3D, { type GraphAPI } from "@/components/gam/Graph3D";
import SidePanel from "@/components/gam/SidePanel";
import TopBar from "@/components/gam/TopBar";
import IntroModal from "@/components/gam/IntroModal";
import ChatPanel from "@/components/gam/ChatPanel";
import { Compass, MousePointerClick, RotateCcw, Sparkles, X } from "lucide-react";

// Featured topics for first-time users — quick-access chips
const FEATURED_IDS = [
  "great-awakening",
  "qanon",
  "secret-space-program",
  "reptilians",
  "blue-avians",
  "great-solar-flash",
  "cabal",
  "atlantis",
];

function HomeInner() {
  const searchParams = useSearchParams();
  const initialNode = searchParams.get("node");

  const [selected, setSelected] = useState<GAMNode | null>(
    initialNode ? NODE_MAP[initialNode] || null : null,
  );
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id)),
  );
  const [showIntro, setShowIntro] = useState(!initialNode);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatNodeId, setChatNodeId] = useState<string | null>(null);
  const [graphReady, setGraphReady] = useState(false);

  const graphApiRef = useRef<GraphAPI | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered nodes/links based on active categories
  const filteredNodes = useMemo(
    () => NODES.filter((n) => active.has(n.category)),
    [active],
  );
  const filteredLinks = useMemo(
    () =>
      LINKS.filter(
        (l) =>
          active.has(NODE_MAP[l.source]?.category) &&
          active.has(NODE_MAP[l.target]?.category),
      ),
    [active],
  );

  const toggleCategory = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Sync selection to URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selected) url.searchParams.set("node", selected.id);
    else url.searchParams.delete("node");
    window.history.replaceState({}, "", url.toString());
  }, [selected]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA";
      if (isInput && e.key !== "Escape") return;

      if (e.key === "Escape") {
        if (chatOpen) { setChatOpen(false); return; }
        if (selected) { setSelected(null); return; }
        if (showIntro) { setShowIntro(false); return; }
      }
      if (e.key === "/" && !isInput) {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[placeholder^="Search"]');
        input?.focus();
      }
      if (e.key === "c" && !isInput && !e.metaKey && !e.ctrlKey) {
        setChatOpen((v) => !v);
      }
      if (e.key === "r" && !isInput && !e.metaKey && !e.ctrlKey) {
        graphApiRef.current?.resetView();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, selected, showIntro]);

  const selectNode = (n: GAMNode | null) => {
    setSelected(n);
    if (n) graphApiRef.current?.focusNode(n.id);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#06070d] text-white">
      <TopBar
        search={search}
        onSearch={setSearch}
        active={active}
        onToggleCategory={toggleCategory}
        onShowIntro={() => setShowIntro(true)}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Disclaimer strip */}
      <div
        className="fixed left-0 right-0 z-10 text-center text-[10.5px] py-1.5 px-3"
        style={{
          top: "84px",
          background: "rgba(255,107,74,0.06)",
          borderBottom: "1px solid #262838",
          color: "#9a9bb3",
        }}
      >
        For reference &amp; media-literacy. Each node describes what the conspiracy <b>alleges</b> — not what is or isn&apos;t true.
      </div>

      {/* 3D graph */}
      <div className="absolute inset-0 pt-[112px]">
        <Suspense fallback={<div className="grid place-items-center h-full text-[#8a8ba3] text-sm">Loading 3D graph…</div>}>
          <Graph3D
            nodes={filteredNodes}
            links={filteredLinks}
            selectedId={selected?.id || null}
            activeCategories={active}
            searchQuery={search}
            onSelect={selectNode}
            onReady={(api) => {
              graphApiRef.current = api;
              setGraphReady(true);
            }}
          />
        </Suspense>
      </div>

      {/* Featured topics — quick access row (only when nothing selected and no search) */}
      {!selected && !search && graphReady && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-1.5 px-3 max-w-[90vw]"
          style={{ bottom: "72px" }}
        >
          <span className="text-[10px] uppercase tracking-wider text-[#6a6b85] mr-1 hidden sm:inline">Start here:</span>
          {FEATURED_IDS.map((id) => {
            const node = NODE_MAP[id];
            if (!node) return null;
            const cat = CATEGORY_MAP[node.category];
            return (
              <button
                key={id}
                onClick={() => selectNode(node)}
                className="text-[11.5px] px-2.5 py-1.5 rounded-full border backdrop-blur transition hover:scale-[1.05]"
                style={{
                  background: `${cat.color}18`,
                  borderColor: `${cat.color}55`,
                  color: "#e7e6f0",
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                  style={{ background: cat.color }}
                />
                {node.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Side panel */}
      <SidePanel
        node={selected}
        onClose={() => setSelected(null)}
        onSelect={selectNode}
        onAskAI={(n) => {
          setChatNodeId(n.id);
          setChatOpen(true);
        }}
      />

      {/* AI Chat panel */}
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        currentNodeId={chatNodeId}
      />

      {/* Bottom-left hint — collapsible */}
      <div
        className="fixed bottom-4 left-4 z-10 px-3 py-2 rounded-lg border border-[#262838] bg-[#14151f]/85 backdrop-blur text-[11px] text-[#9a9bb3] flex items-center gap-2"
      >
        <MousePointerClick size={13} className="shrink-0 text-[#ff6b4a]" />
        <span className="hidden sm:inline">Drag to rotate · Scroll to zoom · <kbd className="px-1 py-0.5 rounded bg-[#262838] text-[9px]">/</kbd> search · <kbd className="px-1 py-0.5 rounded bg-[#262838] text-[9px]">C</kbd> chat · <kbd className="px-1 py-0.5 rounded bg-[#262838] text-[9px]">Esc</kbd> close</span>
        <span className="sm:hidden">Tap a bubble · Pinch to zoom</span>
      </div>

      {/* Bottom-right controls */}
      <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => graphApiRef.current?.resetView()}
          className="w-10 h-10 rounded-lg grid place-items-center border border-[#262838] bg-[#14151f]/85 backdrop-blur text-[#9a9bb3] hover:text-white hover:border-[#4a4d65] transition"
          title="Reset view (R)"
          aria-label="Reset view"
        >
          <RotateCcw size={16} />
        </button>
        <a
          href="https://www.greatawakeningmap.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-lg grid place-items-center border border-[#262838] bg-[#14151f]/85 backdrop-blur text-[#9a9bb3] hover:text-white hover:border-[#4a4d65] transition"
          title="View original poster"
        >
          <Compass size={16} />
        </a>
      </div>

      {/* Intro modal */}
      <IntroModal open={showIntro} onClose={() => setShowIntro(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
