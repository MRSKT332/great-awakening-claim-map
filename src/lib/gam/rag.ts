// RAG — Retrieval-Augmented Generation helper.
// Instead of stuffing all 284 node descriptions into the system prompt
// (which makes it ~80k chars and very slow), we extract keywords from the
// user's question and include only the top ~15 most relevant nodes.

import { NODES, NODE_MAP, CATEGORY_MAP } from "./index";
import type { GAMNode } from "./types";

// Common words to ignore when extracting keywords
const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "can", "shall", "to", "of", "in",
  "for", "on", "with", "at", "by", "from", "as", "into", "through",
  "during", "before", "after", "above", "below", "up", "down", "out",
  "off", "over", "under", "again", "further", "then", "once", "here",
  "there", "when", "where", "why", "how", "all", "each", "every", "both",
  "few", "more", "most", "other", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "just", "also",
  "and", "or", "but", "if", "because", "while", "about", "what", "which",
  "who", "whom", "this", "that", "these", "those", "i", "me", "my",
  "we", "us", "our", "you", "your", "he", "him", "his", "she", "her",
  "it", "its", "they", "them", "their", "tell", "explain", "describe",
  "know", "think", "mean", "whats", "what's", "ive", "i've",
]);

interface ScoredNode {
  node: GAMNode;
  score: number;
}

/**
 * Extract meaningful keywords from a user question.
 */
function extractKeywords(question: string): string[] {
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return [...new Set(words)]; // dedupe
}

/**
 * Find the most relevant nodes for a given question.
 * Scoring:
 *  - Label match: 10 points per keyword match
 *  - Description match: 2 points per keyword match
 *  - Related-node-name match: 5 points per keyword match
 *  - If a node's label appears as a substring in the question: 15 bonus points
 */
export function findRelevantNodes(question: string, maxNodes = 8): GAMNode[] {
  const keywords = extractKeywords(question);
  if (keywords.length === 0) {
    // If no keywords, return the most central nodes
    return NODES.filter((n) => n.weight >= 4).slice(0, maxNodes);
  }

  const scored: ScoredNode[] = NODES.map((node) => {
    let score = 0;
    const labelLower = node.label.toLowerCase();
    const descLower = node.desc.toLowerCase();
    const relatedNames = (node.links || [])
      .map((id) => NODE_MAP[id]?.label || "")
      .join(" ")
      .toLowerCase();

    // Check if the full label appears in the question
    if (question.toLowerCase().includes(labelLower)) {
      score += 15;
    }

    for (const kw of keywords) {
      // Label match (highest weight)
      if (labelLower.includes(kw)) score += 10;
      // Description match
      if (descLower.includes(kw)) score += 2;
      // Related-node-name match
      if (relatedNames.includes(kw)) score += 5;
    }

    // Boost by node weight (more central = more likely relevant)
    score += node.weight * 0.5;

    return { node, score };
  });

  return scored
    .filter((s) => s.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxNodes)
    .map((s) => s.node);
}

/**
 * Build a compact system prompt with only the relevant nodes.
 * This is ~5-10k chars instead of ~80k, making responses 5-10x faster.
 */
export function buildSystemPrompt(relevantNodes: GAMNode[]): string {
  // Truncate each node description to ~300 chars to keep the prompt compact.
  // The gpt-oss-20b model burns tokens on reasoning, so a shorter prompt
  // leaves more tokens for the actual answer.
  const nodeContext = relevantNodes
    .map((n) => {
      const cat = CATEGORY_MAP[n.category];
      const desc = n.desc.length > 300 ? n.desc.substring(0, 300) + "…" : n.desc;
      return `### ${n.label} [${cat.label}]\n${desc}`;
    })
    .join("\n\n");

  return `You are the AI guide for the "Great Awakening Claim Map" — a 3D graph of conspiracy theories from a 2018 poster. Answer questions about the topics below.

RULES:
- Describe what each conspiracy ALLEGES, neutrally. No fact-checking, no debunking, no endorsements.
- When asked "is X true?" say "Within the narrative, X is described as..." and explain.
- Be concise: 100-250 words unless asked for depth.
- Use **bold** for node names.

TOPIC DATA (${relevantNodes.length} relevant nodes):
${nodeContext}

NOTE: The full map has 284 nodes. If asked about a topic not above, answer from general knowledge and note it may not be in the current context.`;
}
