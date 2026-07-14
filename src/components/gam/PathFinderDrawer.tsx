"use client";

import { useState, useMemo } from "react";
import { X, Route, ArrowRight } from "lucide-react";
import { NODES, NODE_MAP, LINKS, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (node: GAMNode) => void;
  onHighlightPath: (nodeIds: Set<string> | null) => void;
}

// BFS shortest-path between two nodes using the link graph
function findPath(startId: string, endId: string): string[] | null {
  if (startId === endId) return [startId];
  const visited = new Set<string>([startId]);
  const queue: { id: string; path: string[] }[] = [{ id: startId, path: [startId] }];
  while (queue.length) {
    const { id, path } = queue.shift()!;
    const node = NODE_MAP[id];
    if (!node) continue;
    for (const neighborId of node.links || []) {
      if (visited.has(neighborId)) continue;
      visited.add(neighborId);
      const newPath = [...path, neighborId];
      if (neighborId === endId) return newPath;
      queue.push({ id: neighborId, path: newPath });
    }
  }
  // Also check reverse links (links are directional in data but conceptually bidirectional)
  for (const [fromId, node] of Object.entries(NODE_MAP)) {
    if (!(node.links || []).includes(endId)) continue;
    if (visited.has(fromId)) {
      // found a node that links to endId
      const pathToFrom = findPath(startId, fromId);
      if (pathToFrom) return [...pathToFrom, endId];
    }
  }
  return null;
}

export default function PathFinderDrawer({ open, onClose, onSelect, onHighlightPath }: Props) {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [path, setPath] = useState<string[] | null>(null);
  const [searched, setSearched] = useState(false);

  const result = useMemo(() => {
    if (!fromId || !toId) return null;
    return findPath(fromId, toId);
  }, [fromId, toId]);

  const handleFind = () => {
    setSearched(true);
    setPath(result);
    if (result) {
      onHighlightPath(new Set(result));
    } else {
      onHighlightPath(null);
    }
  };

  const handleClear = () => {
    setFromId("");
    setToId("");
    setPath(null);
    setSearched(false);
    onHighlightPath(null);
  };

  if (!open) return null;

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
          onClick={() => { onClose(); handleClear(); }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-1">
          <Route size={16} className="text-[#ffea00]" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#ffea00] font-semibold">
            Path Finder
          </span>
        </div>
        <h2 className="text-[18px] font-bold text-white">How are these connected?</h2>
        <p className="text-[11.5px] text-[#8a8ba3] mt-1">
          Pick two topics. The shortest connection path is highlighted on the graph.
        </p>
      </div>

      <div className="p-5 space-y-3 border-b border-[#262838]">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#6a6b85] block mb-1">From</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full bg-[#14151f] border border-[#262838] text-white text-[12.5px] px-3 py-2 rounded-md outline-none focus:border-[#ffea00]/60"
          >
            <option value="">Select a topic…</option>
            {NODES.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-[#6a6b85] block mb-1">To</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full bg-[#14151f] border border-[#262838] text-white text-[12.5px] px-3 py-2 rounded-md outline-none focus:border-[#ffea00]/60"
          >
            <option value="">Select a topic…</option>
            {NODES.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFind}
            disabled={!fromId || !toId}
            className="flex-1 text-[12px] font-medium py-2 rounded-md text-[#0a0b12] disabled:opacity-30"
            style={{ background: "#ffea00" }}
          >
            Find path
          </button>
          <button
            onClick={handleClear}
            className="text-[12px] py-2 px-3 rounded-md border border-[#262838] text-[#cfcfe0] hover:bg-white/5"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Result */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "thin" }}>
        {searched && path && (
          <>
            <div className="text-[10px] uppercase tracking-wider text-[#6a6b85] mb-2">
              {path.length - 1} hop{path.length - 1 !== 1 ? "s" : ""}
            </div>
            <div className="space-y-1">
              {path.map((id, i) => {
                const node = NODE_MAP[id];
                if (!node) return null;
                const cat = CATEGORY_MAP[node.category];
                return (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      onClick={() => onSelect(node)}
                      className="flex items-center gap-2 text-[12.5px] px-2.5 py-1.5 rounded-md hover:bg-white/5 transition flex-1 text-left"
                      style={{ border: `1px solid ${cat.color}44`, background: `${cat.color}08` }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-white">{node.label}</span>
                    </button>
                    {i < path.length - 1 && <ArrowRight size={12} className="text-[#6a6b85] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {searched && !path && (
          <div className="text-center py-8">
            <div className="text-[13px] text-[#cfcfe0] mb-1">No connection found</div>
            <div className="text-[11px] text-[#6a6b85]">These two topics don't share a path through the graph.</div>
          </div>
        )}
        {!searched && (
          <div className="text-center py-8 text-[11.5px] text-[#6a6b85]">
            Select two topics above and click "Find path" to see how they connect.
          </div>
        )}
      </div>
    </div>
  );
}
