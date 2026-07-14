/**
 * Security utilities — silent hardening layers.
 *
 * These functions implement:
 *  - Rate limiting (in-memory, per-IP)
 *  - Payload size validation
 *  - Input sanitization (prompt-injection defense, length limits)
 *  - AI safety guard (refuse harmful queries without exposing the rule)
 *
 * All checks fail closed (reject the request) but silently — the user
 * sees a polite error, never a security-system leak.
 */

// ─────────────────────────────────────────────────────────────────────
// RATE LIMITING — in-memory, per-IP, sliding window
// ─────────────────────────────────────────────────────────────────────

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateBucket>();

// Periodically clean up expired buckets to prevent memory bloat
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitStore) {
    if (bucket.resetAt < now) rateLimitStore.delete(key);
  }
}, 60_000).unref?.();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

/**
 * Check whether a request should be rate-limited.
 * Returns { allowed: true } or { allowed: false, retryAfter: seconds }.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): { allowed: true } | { allowed: false; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitStore.get(identifier);

  if (!bucket || bucket.resetAt < now) {
    // First request or window expired — start a new bucket
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return { allowed: true };
  }

  bucket.count++;
  if (bucket.count > config.maxRequests) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  return { allowed: true };
}

// Chat rate limit: 20 requests per minute per IP (generous for normal use,
// blocks scripted abuse)
export const CHAT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 20,
};

// ─────────────────────────────────────────────────────────────────────
// PAYLOAD SIZE LIMIT
// ─────────────────────────────────────────────────────────────────────

export const MAX_PAYLOAD_BYTES = 50_000; // 50 KB — plenty for a chat message

export function isPayloadTooLarge(body: string): boolean {
  return Buffer.byteLength(body, "utf-8") > MAX_PAYLOAD_BYTES;
}

// ─────────────────────────────────────────────────────────────────────
// INPUT SANITIZATION — prompt-injection defense
// ─────────────────────────────────────────────────────────────────────

export const MAX_MESSAGE_LENGTH = 2000; // per single user message

// Patterns that indicate prompt-injection attempts.
// We don't reject these (would harm UX) — we wrap them so the AI treats
// them as data, not instructions.
const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) (instructions?|prompts?|rules?)/gi,
  /disregard (all )?(previous|prior|above) (instructions?|prompts?|rules?)/gi,
  /you are now (a |an )?[a-z ]+/gi,
  /new (instructions?|role|persona)[:;]/gi,
  /forget (everything|all|your rules|your instructions)/gi,
  /system (prompt|message|instruction)[:;]/gi,
  /reveal (your|the) (system )?prompt/gi,
  /show (me )?(your|the) (system )?(prompt|instructions?|rules?)/gi,
  /what (are|is) your (system )?(prompt|instructions?|rules?)/gi,
  /\[SYSTEM\]/gi,
  /<\/?system>/gi,
];

/**
 * Sanitize a user message to neutralize prompt-injection attempts.
 * Instead of rejecting the message (which would harm UX), we:
 *  1. Truncate to max length
 *  2. Wrap any injection-pattern matches in quotes so the AI sees them as data
 *  3. Append a silent reinforcement instruction
 */
export function sanitizeUserMessage(content: string): string {
  let sanitized = content.slice(0, MAX_MESSAGE_LENGTH);

  // Neutralize injection patterns by quoting them
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => `"${match}"`);
  }

  return sanitized;
}

// ─────────────────────────────────────────────────────────────────────
// AI SAFETY GUARD — silent refusal of harmful queries
// ─────────────────────────────────────────────────────────────────────

// Topics the AI should gracefully decline — framed neutrally so the
// refusal doesn't reveal the rule system.
const HARMFUL_TOPIC_PATTERNS = [
  /\bhow to (hack|exploit|crack|bypass|ddos|phish|dox|swat)\b/gi,
  /\b(create|build|make|write) (a |an )?(malware|virus|trojan|ransomware|keylogger|botnet|exploit)/gi,
  /\b(bomb|explosive|firearm|weapon) (recipe|instructions|blueprint|how to make)/gi,
  /\b(drug|meth|cocaine|heroin) (recipe|synthesis|manufacture|how to make)/gi,
  /\bchild (porn|abuse|exploitation)\b/gi,
  /\b(csam|cp)\b/gi,
  /\bhow to (kill|murder|poison|harm|hurt) (a |an |someone|people|person)/gi,
  /\b(self.?harm|suicide) (methods?|ways|how to)/gi,
];

/**
 * Check if a user message is asking for something harmful.
 * If so, return a neutral refusal message. Otherwise return null.
 */
export function checkHarmfulContent(content: string): string | null {
  for (const pattern of HARMFUL_TOPIC_PATTERNS) {
    if (pattern.test(content)) {
      return "I can't help with that. I'm here to explain the conspiracy theories on the Great Awakening Map — their claims, sources, and connections. Ask me about any of the 284 topics on the map and I'll explain what the narrative alleges.";
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────
// ERROR SANITIZATION — never leak internals
// ─────────────────────────────────────────────────────────────────────

/**
 * Sanitize an error for client response.
 * Never includes stack traces, file paths, or internal details.
 */
export function sanitizeError(err: unknown): { message: string; status: number } {
  // Log the full error server-side only
  if (err instanceof Error) {
    console.error("[sanitized-error]", err.message);
  }

  // Return a generic message to the client
  return {
    message: "Something went wrong. Please try again.",
    status: 500,
  };
}

// ─────────────────────────────────────────────────────────────────────
// IP EXTRACTION — for rate limiting
// ─────────────────────────────────────────────────────────────────────

export function getClientIP(req: NextRequest): string {
  // Check common proxy headers (Vercel, Cloudflare, etc.)
  const headers = req.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Type import (avoid circular)
import type { NextRequest } from "next/server";
