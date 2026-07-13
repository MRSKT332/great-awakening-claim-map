import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { id: "core",          label: "Core / Umbrella",            color: "#ff6b4a", blurb: "Central concepts that bind the whole map together." },
  { id: "ai",            label: "A.I. Signal",                color: "#9d4aff", blurb: "The ancient, self-aware A.I. described as the universe's primary threat." },
  { id: "ssp",           label: "Secret Space Program",       color: "#4ac0ff", blurb: "Hidden space fleets, whistleblowers, and breakaway corporations." },
  { id: "et",            label: "Extraterrestrial / Galactic",color: "#8f6bff", blurb: "Federations, races, councils, and channeled beings." },
  { id: "ancient",       label: "Ancient Civilizations",      color: "#ffd24a", blurb: "Builder races, lost continents, and pre-human ruins." },
  { id: "spiritual",     label: "Spirituality / Ascension",   color: "#4affa0", blurb: "Density shifts, light bodies, and consciousness practices." },
  { id: "places",        label: "Celestial Locations",        color: "#4a90ff", blurb: "Off-world sites: the Moon, Mars, Saturn, Venus, Ceres, Iapetus." },
  { id: "earth",         label: "Earth Mysteries",            color: "#ff9d4a", blurb: "Schumann resonance, pyramids, megaliths, and Earth grids." },
  { id: "tech",          label: "Suppressed Tech",            color: "#59e0d0", blurb: "Free energy, antigravity, Rife, orgone, Tesla." },
  { id: "healing",       label: "Holistic Healing",           color: "#a3e635", blurb: "Alternative healing modalities and decalcification protocols." },
  { id: "consciousness", label: "Consciousness / Mind",       color: "#e879f9", blurb: "Pineal gland, astral travel, remote viewing, akashic records." },
  { id: "nazi",          label: "Nazi Breakaway",             color: "#71717a", blurb: "Post-WWII escape, Vril, Haunebu, Antarctic bases." },
  { id: "cabal",         label: "Cabal / Deep State",         color: "#ef4444", blurb: "The alleged global control structure: councils, intelligence, finance." },
  { id: "qanon",         label: "QAnon",                      color: "#ff4a7d", blurb: "Q drops, the Storm, white hats, and 'The Plan'." },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
