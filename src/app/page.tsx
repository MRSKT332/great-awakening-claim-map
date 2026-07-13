"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NODES, LINKS, CATEGORIES, NODE_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";
import Graph3D from "@/components/gam/Graph3D";
import SidePanel from "@/components/gam/SidePanel";
import TopBar from "@/components/gam/TopBar";
import IntroModal from "@/components/gam/IntroModal";
import ChatPanel from "@/components/gam/ChatPanel";
import { ZoomIn, ZoomOut, Compass, MousePointerClick } from "lucide-react";

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

  // Sync selection to URL (no router push — just history.replaceState to avoid re-render)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selected) url.searchParams.set("node", selected.id);
    else url.searchParams.delete("node");
    window.history.replaceState({}, "", url.toString());
  }, [selected]);

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
            onSelect={setSelected}
          />
        </Suspense>
      </div>

      {/* Side panel */}
      <SidePanel
        node={selected}
        onClose={() => setSelected(null)}
        onSelect={(n) => setSelected(n)}
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

      {/* Bottom-left hint */}
      <div
        className="fixed bottom-4 left-4 z-10 px-3 py-2 rounded-lg border border-[#262838] bg-[#14151f]/85 backdrop-blur text-[11px] text-[#9a9bb3] flex items-center gap-2"
        style={{ maxWidth: "calc(100vw - 32px)" }}
      >
        <MousePointerClick size={13} className="shrink-0 text-[#ff6b4a]" />
        <span className="hidden sm:inline">Drag to rotate · Scroll to zoom · Click any bubble for details</span>
        <span className="sm:hidden">Tap a bubble for details</span>
      </div>

      {/* Bottom-right controls */}
      <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2">
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
