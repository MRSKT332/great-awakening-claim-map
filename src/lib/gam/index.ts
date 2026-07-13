import type { GAMNode, GAMLink } from "./types";
import { CATEGORIES } from "./groups";
import { CORE_NODES } from "./core";
import { AI_NODES } from "./ai";
import { SSP_NODES } from "./ssp";
import { ET_NODES } from "./et";
import { ANCIENT_NODES } from "./ancient";
import { SPIRITUAL_NODES } from "./spiritual";
import { PLACES_NODES, EARTH_NODES } from "./places";
import { TECH_NODES } from "./tech";
import { CABAL_NODES } from "./cabal";
import { QANON_NODES } from "./qanon";
import { NAZI_NODES } from "./nazi";
import { applyMedia } from "./media";

// Combine all node arrays
export const ALL_NODES: GAMNode[] = [
  ...CORE_NODES,
  ...AI_NODES,
  ...SSP_NODES,
  ...ET_NODES,
  ...ANCIENT_NODES,
  ...SPIRITUAL_NODES,
  ...PLACES_NODES,
  ...EARTH_NODES,
  ...TECH_NODES,
  ...CABAL_NODES,
  ...QANON_NODES,
  ...NAZI_NODES,
];

// Deduplicate by id (in case any two files share an id)
const seen = new Set<string>();
const deduped = ALL_NODES.filter((n) => {
  if (seen.has(n.id)) return false;
  seen.add(n.id);
  return true;
});

// Apply media (images + YouTube) overrides
export const NODES: GAMNode[] = applyMedia(deduped);

export const NODE_MAP: Record<string, GAMNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);

// Build the link list — both directions
const idSet = new Set(NODES.map((n) => n.id));
export const LINKS: GAMLink[] = [];
NODES.forEach((n) => {
  (n.links || []).forEach((t) => {
    if (idSet.has(t)) {
      LINKS.push({ source: n.id, target: t });
    }
  });
});

// Stats for display
export const STATS = {
  totalNodes: NODES.length,
  totalLinks: LINKS.length,
  totalCategories: CATEGORIES.length,
  nodesPerCategory: CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    count: NODES.filter((n) => n.category === c.id).length,
  })),
};

// Re-export categories
export { CATEGORIES, CATEGORY_MAP } from "./groups";
export type { GAMNode, GAMLink, Category, CategoryId } from "./types";
