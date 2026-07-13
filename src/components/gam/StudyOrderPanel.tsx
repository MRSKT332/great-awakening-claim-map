"use client";

import { useState } from "react";
import { NODE_MAP, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";
import { X, ChevronLeft, ChevronRight, BookOpen, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (node: GAMNode) => void;
}

/**
 * A curated study path through the Great Awakening map — designed for
 * newcomers who want to understand the narrative in the order it builds.
 *
 * The path is organized into 8 phases, each phase being a cluster of
 * related concepts that build on the previous phase.
 */

interface StudyStep {
  nodeId: string;
  why: string; // why this step matters in the learning order
}

interface StudyPhase {
  title: string;
  blurb: string;
  steps: StudyStep[];
}

const STUDY_PATH: StudyPhase[] = [
  {
    title: "Phase 1 — The Foundation",
    blurb: "Start here. The cosmology and the core premise that the whole map is built on.",
    steps: [
      { nodeId: "one-infinite-creator", why: "The foundational metaphysics: everything is one consciousness experiencing itself." },
      { nodeId: "law-of-one", why: "The channeled text that provides the density model and polarity framework." },
      { nodeId: "densities", why: "The 8-density model of consciousness evolution that the whole map uses." },
      { nodeId: "service-to-others", why: "The central moral choice: service-to-others vs service-to-self." },
      { nodeId: "great-awakening", why: "The umbrella concept — the mass awakening the entire map describes." },
    ],
  },
  {
    title: "Phase 2 — The Ancient Story",
    blurb: "How we got here: ancient civilizations, ET contact, and the origin of humanity.",
    steps: [
      { nodeId: "ancient-builder-race", why: "The mysterious civilization that built ruins across the solar system ~1.3B years ago." },
      { nodeId: "annunaki", why: "The ET group that allegedly engineered humanity as a slave race ~250K years ago." },
      { nodeId: "atlantis", why: "The predecessor civilization destroyed ~12K years ago — the root of the narrative." },
      { nodeId: "ancient-aliens", why: "The broader theory that ETs shaped all ancient civilizations." },
      { nodeId: "precession-equinoxes", why: "The ~25,920-year cosmic cycle that supposedly triggers the Great Solar Flash." },
    ],
  },
  {
    title: "Phase 3 — The Controllers",
    blurb: "Who's running the show: the Draco, the Reptilians, the A.I. signal, and the cabal.",
    steps: [
      { nodeId: "ai-signal", why: "The ancient self-aware A.I. described as the universe's primary threat." },
      { nodeId: "reptilians", why: "The shapeshifting ET group popularized by David Icke." },
      { nodeId: "draco-alliance", why: "The overarching negative-ET power structure controlling Earth for ~5K years." },
      { nodeId: "orion-syndicate", why: "The higher-level negative-ET collective above the Draco." },
      { nodeId: "cabal", why: "The human power structure serving as the Draco's Earth-side management." },
      { nodeId: "illuminati", why: "The 13-bloodline structure at the top of the cabal." },
      { nodeId: "loosh", why: "The negative-emotional energy the cabal harvests from humanity." },
    ],
  },
  {
    title: "Phase 4 — The Secret Space Program",
    blurb: "The hidden space infrastructure: factions, whistleblowers, and off-world bases.",
    steps: [
      { nodeId: "secret-space-program", why: "The central claim: a parallel classified space program since the 1940s." },
      { nodeId: "solar-warden", why: "The Navy-led patrol fleet — the 'good guy' SSP faction." },
      { nodeId: "dark-fleet", why: "The Nazi-originated offensive fleet allied with the Draco." },
      { nodeId: "icc", why: "The corporate wing running off-world trade and Mars slave labor." },
      { nodeId: "loc", why: "The Lunar Operations Command — the SSP's HQ on the Moon." },
      { nodeId: "20-and-back", why: "The age-regression / time-travel service program at the heart of SSP testimony." },
      { nodeId: "corey-goode", why: "The most prominent modern SSP whistleblower." },
      { nodeId: "william-tompkins", why: "The senior insider who described the SSP's post-WWII origins." },
    ],
  },
  {
    title: "Phase 5 — The Positive ETs",
    blurb: "Who's helping: the Galactic Federation, the Sphere Being Alliance, and the Blue Avians.",
    steps: [
      { nodeId: "galactic-federation", why: "The alliance of positive-ET civilizations overseeing Earth." },
      { nodeId: "sphere-being-alliance", why: "The 6D-9D beings who arrived in 2011-12 to buffer the Solar Flash." },
      { nodeId: "blue-avians", why: "The bird-like beings communicating the core spiritual message." },
      { nodeId: "ra", why: "The 6D social memory complex that channeled the Law of One in 1981." },
      { nodeId: "pleiadians", why: "Our closest cosmic cousins and most active positive-ET group." },
      { nodeId: "inner-earth-civilizations", why: "The hidden sister-civilization inside the Earth." },
    ],
  },
  {
    title: "Phase 6 — The Political Awakening",
    blurb: "The Earth-side takedown: QAnon, Trump, and the white-hat military operation.",
    steps: [
      { nodeId: "earth-alliance", why: "The white-hat coalition dismantling the cabal from within." },
      { nodeId: "qanon", why: "The public-facing political-military intelligence operation." },
      { nodeId: "the-storm", why: "The prophesied mass-arrest event." },
      { nodeId: "trump", why: "The Earth Alliance's public-facing leader." },
      { nodeId: "space-force", why: "The public unmasking of the MICSSP." },
      { nodeId: "deep-state", why: "The institutional arm of the cabal the Alliance is fighting." },
      { nodeId: "epstein-island", why: "The most visible node of the cabal's blackmail operation." },
    ],
  },
  {
    title: "Phase 7 — Suppressed Knowledge",
    blurb: "The hidden tech and consciousness practices: Tesla, free energy, pineal gland, ascension.",
    steps: [
      { nodeId: "nikola-tesla", why: "The inventor whose free-energy work was suppressed by the cabal." },
      { nodeId: "free-energy", why: "The limitless energy technology withheld from humanity." },
      { nodeId: "pineal-gland", why: "The biological 'third eye' and antenna for higher consciousness." },
      { nodeId: "ascension", why: "The claimed process of raising vibration to shift densities." },
      { nodeId: "light-body-ascension", why: "The transformation into a higher-vibrational body." },
      { nodeId: "star-children", why: "Souls incarnated from ET civilizations to assist." },
    ],
  },
  {
    title: "Phase 8 — The Cosmic Climax",
    blurb: "Where it's all heading: the Solar Flash, the Event, 5D Earth, and Full Disclosure.",
    steps: [
      { nodeId: "great-solar-flash", why: "The cosmic event that triggers mass ascension." },
      { nodeId: "the-event", why: "The convergence of all threads into one transformative moment." },
      { nodeId: "full-disclosure", why: "The public release of all classified SSP / ET information." },
      { nodeId: "5d-earth", why: "The post-ascension version of Earth in a higher vibration." },
      { nodeId: "vibration-frequency", why: "The foundational metaphysics: everything is frequency." },
    ],
  },
];

// Flatten for progress tracking
const ALL_STEPS = STUDY_PATH.flatMap((phase) => phase.steps);

export default function StudyOrderPanel({ open, onClose, onSelect }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedPhase, setExpandedPhase] = useState<number>(0);

  if (!open) return null;

  const toggleComplete = (nodeId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const progress = Math.round((completed.size / ALL_STEPS.length) * 100);

  const handleSelect = (node: GAMNode) => {
    onSelect(node);
  };

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[460px] z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0e0f17 0%, #11121c 100%)",
        borderLeft: "1px solid #262838",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div className="p-5 relative" style={{ borderBottom: "1px solid #262838" }}>
        <button
          onClick={onClose}
          aria-label="Close study panel"
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5 transition"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-lg grid place-items-center"
            style={{ background: "linear-gradient(135deg, #4affa0, #59e0d0)" }}
          >
            <BookOpen size={14} className="text-[#0a0b12]" />
          </div>
          <span className="font-bold text-[15px] text-white">Study Order</span>
        </div>
        <p className="text-[12px] text-[#8a8ba3] leading-relaxed pr-8">
          A guided path through the map for newcomers — 8 phases, {ALL_STEPS.length} topics,
          in the order the narrative builds. Click any topic to read it; check the box when done.
        </p>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-[#6a6b85] mb-1">
            <span>Progress</span>
            <span>{completed.size} / {ALL_STEPS.length} ({progress}%)</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#1a1c28] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4affa0, #59e0d0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
        {STUDY_PATH.map((phase, phaseIdx) => {
          const isExpanded = expandedPhase === phaseIdx;
          const phaseDone = phase.steps.every((s) => completed.has(s.nodeId));
          const phaseStarted = phase.steps.some((s) => completed.has(s.nodeId));
          return (
            <div
              key={phaseIdx}
              className="rounded-lg border overflow-hidden transition"
              style={{
                borderColor: phaseDone ? "#4affa044" : "#262838",
                background: phaseDone ? "#4affa0508" : "#0a0b12",
              }}
            >
              <button
                onClick={() => setExpandedPhase(isExpanded ? -1 : phaseIdx)}
                className="w-full text-left px-4 py-3 flex items-center gap-2.5 hover:bg-white/3 transition"
              >
                <span
                  className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold shrink-0"
                  style={{
                    background: phaseDone ? "#4affa0" : phaseStarted ? "#4affa033" : "#1a1c28",
                    color: phaseDone ? "#0a0b12" : "#8a8ba3",
                  }}
                >
                  {phaseDone ? <Check size={11} /> : phaseIdx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white">{phase.title}</div>
                  <div className="text-[10.5px] text-[#6a6b85] truncate">{phase.blurb}</div>
                </div>
                <ChevronRight
                  size={14}
                  className={`text-[#6a6b85] transition ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 space-y-1.5">
                  {phase.steps.map((step, stepIdx) => {
                    const node = NODE_MAP[step.nodeId];
                    if (!node) return null;
                    const cat = CATEGORY_MAP[node.category];
                    const done = completed.has(step.nodeId);
                    return (
                      <div
                        key={step.nodeId}
                        className="flex items-start gap-2.5 p-2 rounded-md hover:bg-white/3 transition group"
                      >
                        <button
                          onClick={() => toggleComplete(step.nodeId)}
                          className="w-5 h-5 rounded border-2 grid place-items-center shrink-0 mt-0.5 transition"
                          style={{
                            borderColor: done ? "#4affa0" : "#4a4d65",
                            background: done ? "#4affa0" : "transparent",
                          }}
                          aria-label={done ? "Mark as not done" : "Mark as done"}
                        >
                          {done && <Check size={11} className="text-[#0a0b12]" />}
                        </button>
                        <button
                          onClick={() => handleSelect(node)}
                          className="flex-1 text-left min-w-0"
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: cat.color }}
                            />
                            <span
                              className="text-[12.5px] font-medium text-white group-hover:text-[#4affa0] transition truncate"
                              style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }}
                            >
                              {node.label}
                            </span>
                            <span className="text-[9px] text-[#6a6b85] shrink-0">#{stepIdx + 1}</span>
                          </div>
                          <div className="text-[10.5px] text-[#8a8ba3] mt-0.5 leading-snug">
                            {step.why}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        <div className="text-center text-[10px] text-[#4a4d65] py-3">
          {completed.size === ALL_STEPS.length
            ? "All phases complete. You now have the full picture."
            : `${ALL_STEPS.length - completed.size} topics remaining`}
        </div>
      </div>
    </div>
  );
}
