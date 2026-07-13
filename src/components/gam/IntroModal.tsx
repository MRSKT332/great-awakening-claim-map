"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function IntroModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-[#262838] overflow-hidden"
        style={{ background: "linear-gradient(180deg, #11121c, #0a0b12)" }}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-4 relative border-b border-[#262838]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "#ff6b4a", boxShadow: "0 0 12px #ff6b4a" }}
            />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#ff6b4a] font-semibold">
              The Great Awakening Map
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-white leading-tight">
            An interactive map of the conspiracy
          </h1>
          <p className="text-[13.5px] text-[#8a8ba3] mt-1.5">
            284 nodes · 1,381 connections · 14 categories — a 3D, Arkham-intelligence-style
            exploration of every claim, entity, and concept on the poster.
          </p>
        </div>

        {/* Body */}
        <div className="px-7 py-5 space-y-4 text-[13.5px] text-[#cfcfe0] leading-[1.65] max-h-[55vh] overflow-y-auto">
          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-[#59e0d0] font-semibold mb-1.5">
              What this site is
            </h3>
            <p>
              An interactive 3D graph of every topic, person, place, and concept on the
              &quot;Great Awakening Map&quot; poster — a 2018 conspiracy infographic by Tiff
              Fitzgibbon (Champ Parinya) that fuses UFO/secret-space-program lore, New Age
              ascension teachings, ancient-astronaut theory, and QAnon-style political
              conspiracy into a single unified worldview.
            </p>
          </div>

          <div className="rounded-lg border border-[#ff6b4a]/30 bg-[#ff6b4a]/5 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-[#ff6b4a] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-[12px] uppercase tracking-wider text-[#ff6b4a] font-semibold mb-1.5">
                  How to read each node
                </h3>
                <p className="text-[13px]">
                  Every description is written from <b>inside the narrative</b> — it states
                  what the conspiracy or claim alleges, who promotes it, and where it sits
                  in the larger map. <b>Descriptions do not endorse the claims</b>, and they
                  <b> do not debunk them either</b> — they just describe the theory as its
                  promoters present it, neutrally. Use the links to verify, research, and
                  draw your own conclusions.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-[#4affa0] font-semibold mb-1.5">
              How to navigate
            </h3>
            <ul className="space-y-1.5 ml-1">
              <li>• <b>Drag</b> to rotate · <b>scroll</b> to zoom · <b>right-drag</b> to pan</li>
              <li>• <b>Click any bubble</b> to open the side panel with the full description, sources, and related nodes</li>
              <li>• Use the <b>legend chips</b> at the top to filter by category</li>
              <li>• Use the <b>search bar</b> to find any topic by name</li>
              <li>• <b>Download</b> any node as JSON or Markdown, or the whole map as JSON</li>
              <li>• <b>Drag a node</b> to pin it in place · <b>click empty space</b> to release</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-wider text-[#8f6bff] font-semibold mb-1.5">
              Categories
            </h3>
            <p>
              The 14 categories span the full spectrum of the poster: from the central
              umbrella concepts (Great Awakening, Solar Flash, Ascension) through Secret
              Space Program factions (Solar Warden, Dark Fleet, ICC), extraterrestrial races
              (Pleiadians, Blue Avians, Reptilians, Draco), ancient civilizations (Atlantis,
              Annunaki, Ancient Builder Race), spirituality / ascension practices, celestial
              locations (Moon, Mars, Saturn, Antarctica), suppressed tech, the Cabal / Deep
              State, and QAnon.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-[#262838] flex items-center justify-between bg-black/30">
          <span className="text-[11px] text-[#6a6b85]">
            Source: <a href="https://www.greatawakeningmap.co/" target="_blank" rel="noopener noreferrer" className="text-[#59e0d0] hover:underline">greatawakeningmap.co</a>
          </span>
          <button
            onClick={onClose}
            className="text-[12px] font-medium px-4 py-2 rounded-md text-[#0a0b12]"
            style={{ background: "#ff6b4a" }}
          >
            Enter the map
          </button>
        </div>
      </div>
    </div>
  );
}
