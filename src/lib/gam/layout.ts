// Radial ring layout — precomputes (x, y, z) positions for every node.
// Core nodes sit at center; each category forms a concentric ring.
// The layout is fully static (no physics simulation needed) so the graph
// reads like a flowchart and nodes never float.

import { NODES, CATEGORY_MAP } from "./index";
import type { GAMNode } from "./types";

// Ring assignment — categories grouped into rings by conceptual distance from core
const RING_ASSIGNMENT: Record<string, number> = {
  core:          0,   // center
  // Ring 1 — the main pillars
  ssp:           1,
  et:            1,
  cabal:         1,
  qanon:         1,
  spiritual:     1,
  // Ring 2 — supporting context
  ancient:       2,
  consciousness: 2,
  places:        2,
  ai:            2,
  // Ring 3 — peripheral / specialized
  tech:          3,
  healing:       3,
  earth:         3,
  nazi:          3,
};

const RING_RADIUS: Record<number, number> = {
  0: 0,      // core — at center
  1: 180,    // inner ring
  2: 340,    // middle ring
  3: 500,    // outer ring
};

// For each category, assign nodes evenly around the ring.
// We also add a small per-category angular offset so categories don't all
// start at the same angle (which would stack ring 1 nodes on top of each other).
const CATEGORY_ANGLE_OFFSET: Record<string, number> = {
  core:          0,
  ssp:           0,
  et:            Math.PI / 4,
  cabal:         Math.PI / 2,
  qanon:         (3 * Math.PI) / 4,
  spiritual:     Math.PI,
  ancient:       (5 * Math.PI) / 4,
  consciousness: (3 * Math.PI) / 2,
  places:        (7 * Math.PI) / 4,
  ai:            Math.PI / 6,
  tech:          Math.PI / 3,
  healing:       (2 * Math.PI) / 3,
  earth:         (5 * Math.PI) / 6,
  nazi:          Math.PI,
};

export interface PositionedNode extends GAMNode {
  x: number;
  y: number;
  z: number;
}

// Group nodes by category
const nodesByCategory: Record<string, GAMNode[]> = {};
NODES.forEach((n) => {
  if (!nodesByCategory[n.category]) nodesByCategory[n.category] = [];
  nodesByCategory[n.category].push(n);
});

// Compute positions
export const POSITIONED_NODES: PositionedNode[] = [];
Object.entries(nodesByCategory).forEach(([cat, nodes]) => {
  const ring = RING_ASSIGNMENT[cat] ?? 3;
  const radius = RING_RADIUS[ring] ?? 500;
  const offset = CATEGORY_ANGLE_OFFSET[cat] ?? 0;

  if (ring === 0) {
    // Core nodes — small cluster at center
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const r = nodes.length > 1 ? 30 : 0;
      POSITIONED_NODES.push({
        ...n,
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
        z: 0,
      });
    });
  } else {
    // Distribute around the ring
    nodes.forEach((n, i) => {
      const angle = offset + (i / nodes.length) * 2 * Math.PI;
      POSITIONED_NODES.push({
        ...n,
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        z: 0,
      });
    });
  }
});

// Build a quick lookup
export const POSITIONED_MAP: Record<string, PositionedNode> = Object.fromEntries(
  POSITIONED_NODES.map((n) => [n.id, n]),
);

// Get the bounding box of the layout (for mini-map)
export const LAYOUT_BOUNDS = (() => {
  let maxX = 0, maxY = 0;
  POSITIONED_NODES.forEach((n) => {
    const r = Math.sqrt(n.x * n.x + n.y * n.y);
    if (r > maxX) maxX = r;
  });
  return { radius: maxX + 40 };
})();
