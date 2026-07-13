// Type definitions for the Great Awakening Map

export type CategoryId =
  | "core"
  | "ai"
  | "ssp"
  | "et"
  | "ancient"
  | "spiritual"
  | "places"
  | "earth"
  | "tech"
  | "healing"
  | "consciousness"
  | "nazi"
  | "cabal"
  | "qanon";

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  blurb: string;
}

export interface GAMNode {
  id: string;
  label: string;
  category: CategoryId;
  /** Visual size — reflects how central the concept is in the source poster (1-5). */
  weight: number;
  /** Conspiracy-narrative description: what this theory / entity / claim alleges. */
  desc: string;
  /** Curated public reference links (Wikipedia, primary sources, archives). */
  sources?: { label: string; url: string }[];
  /** Related node ids. */
  links?: string[];
  /** Optional public-domain image URL (Wikimedia / NASA). */
  image?: string;
  /** Image credit/attribution. */
  imageCredit?: string;
}

export interface GAMLink {
  source: string;
  target: string;
}
