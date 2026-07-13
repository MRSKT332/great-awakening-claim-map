"use client";

import { X, Star, Bookmark } from "lucide-react";
import { NODE_MAP, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";

interface Props {
  open: boolean;
  onClose: () => void;
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
  onSelect: (node: GAMNode) => void;
}

export default function BookmarksDrawer({ open, onClose, bookmarks, onToggleBookmark, onSelect }: Props) {
  if (!open) return null;
  const bookmarkedNodes = Array.from(bookmarks)
    .map((id) => NODE_MAP[id])
    .filter(Boolean);

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
          <Bookmark size={16} className="text-[#ffea00]" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#ffea00] font-semibold">
            Bookmarks
          </span>
        </div>
        <h2 className="text-[18px] font-bold text-white">Saved topics</h2>
        <p className="text-[11.5px] text-[#8a8ba3] mt-1">
          {bookmarkedNodes.length} saved topic{bookmarkedNodes.length !== 1 ? "s" : ""}. Stored in your browser.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: "thin" }}>
        {bookmarkedNodes.length === 0 ? (
          <div className="text-center py-12">
            <Star size={32} className="text-[#262838] mx-auto mb-3" />
            <div className="text-[13px] text-[#cfcfe0] mb-1">No bookmarks yet</div>
            <div className="text-[11px] text-[#6a6b85]">
              Click the star icon on any topic to save it here for later.
            </div>
          </div>
        ) : (
          bookmarkedNodes.map((node) => {
            const cat = CATEGORY_MAP[node.category];
            return (
              <div
                key={node.id}
                className="flex items-center gap-2 rounded-lg border border-[#262838] bg-[#14151f] p-2.5 hover:bg-white/5 transition"
              >
                <button
                  onClick={() => { onSelect(node); onClose(); }}
                  className="flex items-center gap-2 flex-1 text-left min-w-0"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-[13px] text-white font-medium truncate">{node.label}</span>
                  <span className="text-[10px] text-[#6a6b85] shrink-0">{cat.label}</span>
                </button>
                <button
                  onClick={() => onToggleBookmark(node.id)}
                  className="w-7 h-7 rounded grid place-items-center text-[#ffea00] hover:bg-white/5 transition shrink-0"
                  title="Remove bookmark"
                >
                  <Star size={13} fill="currentColor" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
