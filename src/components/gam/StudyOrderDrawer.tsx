"use client";

import { useState } from "react";
import { X, GraduationCap, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { STUDY_ORDER } from "@/lib/gam/studyOrder";
import { NODE_MAP, CATEGORY_MAP } from "@/lib/gam";
import type { GAMNode } from "@/lib/gam/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (node: GAMNode) => void;
}

export default function StudyOrderDrawer({ open, onClose, onSelect }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!open) return null;

  const step = STUDY_ORDER[currentIdx];
  const node = NODE_MAP[step.nodeId];
  const cat = node ? CATEGORY_MAP[node.category] : null;
  const phase = step.phase;
  const phaseStart = STUDY_ORDER.findIndex((s) => s.phase === phase);
  const phaseEnd = STUDY_ORDER.length - 1 - [...STUDY_ORDER].reverse().findIndex((s) => s.phase === phase);

  const goNext = () => {
    if (currentIdx < STUDY_ORDER.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextNode = NODE_MAP[STUDY_ORDER[nextIdx].nodeId];
      if (nextNode) onSelect(nextNode);
    }
  };
  const goPrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      const prevNode = NODE_MAP[STUDY_ORDER[prevIdx].nodeId];
      if (prevNode) onSelect(prevNode);
    }
  };

  const goTo = (idx: number) => {
    setCurrentIdx(idx);
    const targetNode = NODE_MAP[STUDY_ORDER[idx].nodeId];
    if (targetNode) onSelect(targetNode);
  };

  return (
    <div
      className="fixed top-0 left-0 h-full w-full sm:w-[420px] z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0e0f17, #11121c)",
        borderRight: "1px solid #262838",
        boxShadow: "20px 0 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div className="p-5 relative border-b border-[#262838]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center text-[#8a8ba3] hover:text-white hover:bg-white/5"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={18} className="text-[#4affa0]" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#4affa0] font-semibold">
            Study Order
          </span>
        </div>
        <h2 className="text-[18px] font-bold text-white">Foundations → Cosmos → Earth</h2>
        <p className="text-[11.5px] text-[#8a8ba3] mt-1">
          A 30-topic path for new members. Step {currentIdx + 1} of {STUDY_ORDER.length}.
        </p>
      </div>

      {/* Current topic */}
      {node && cat && (
        <div className="p-5 border-b border-[#262838]">
          <div
            className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
            style={{ color: cat.color, border: `1px solid ${cat.color}55`, background: `${cat.color}11` }}
          >
            {step.phase}
          </div>
          <button
            onClick={() => onSelect(node)}
            className="text-[17px] font-bold text-white block text-left hover:underline"
          >
            {node.label}
          </button>
          <p className="text-[12.5px] text-[#cfcfe0] mt-1.5 leading-relaxed">{step.note}</p>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex gap-2 p-4 border-b border-[#262838]">
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          className="flex-1 flex items-center justify-center gap-1 text-[12px] py-2 rounded-md border border-[#262838] text-[#cfcfe0] hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          onClick={goNext}
          disabled={currentIdx === STUDY_ORDER.length - 1}
          className="flex-1 flex items-center justify-center gap-1 text-[12px] py-2 rounded-md text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #4affa0, #59e0d0)" }}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      {/* Full path */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
        <div className="text-[10px] uppercase tracking-wider text-[#6a6b85] mb-2">Full path</div>
        {STUDY_ORDER.map((s, i) => {
          const n = NODE_MAP[s.nodeId];
          if (!n) return null;
          const c = CATEGORY_MAP[n.category];
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-full text-left flex items-start gap-2.5 py-2 px-2 rounded-md transition hover:bg-white/5"
              style={active ? { background: `${c.color}15` } : {}}
            >
              <div
                className="w-5 h-5 rounded-full grid place-items-center shrink-0 text-[10px] font-bold mt-0.5"
                style={{
                  background: done ? "#4affa0" : active ? c.color : "transparent",
                  border: `1px solid ${done ? "#4affa0" : active ? c.color : "#262838"}`,
                  color: done || active ? "#0a0b12" : "#6a6b85",
                }}
              >
                {done ? <Check size={10} /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] text-white font-medium truncate">{n.label}</div>
                <div className="text-[10px] text-[#6a6b85]">{s.phase}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
