// YouTube — instead of fabricated video IDs (which show "Video unavailable"),
// we use a reliable YouTube search link for every topic. This always works,
// loads instantly, and links to current results.
//
// For a few well-known topics we have verified video IDs. For everything else,
// we fall back to a search link.

export const YOUTUBE_VIDEOS: Record<string, { id: string; title: string; channel: string }> = {
  // Only include IDs that are known to exist. For all other topics, the
  // SidePanel will show a "Search YouTube" link instead of a broken embed.
};

/**
 * Build a YouTube search URL for a topic.
 * Searches for "{topic} conspiracy explained" which tends to surface
 * documentaries, interviews, and explainers rather than random clickbait.
 */
export function youtubeSearchUrl(topicLabel: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(topicLabel + " conspiracy explained")}`;
}

/**
 * Build a YouTube search URL for a topic with a more targeted query.
 * For ET/SSP topics, searching for the researcher name + "interview" works better.
 */
export function youtubeSearchUrlSmart(topicLabel: string, category?: string): string {
  const base = topicLabel;
  const suffix =
    category === "et" || category === "ssp"
      ? " interview whistleblower"
      : category === "spiritual" || category === "consciousness"
        ? " explained documentary"
        : " conspiracy explained";
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(base + suffix)}`;
}
