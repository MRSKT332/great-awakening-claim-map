import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  CHAT_RATE_LIMIT,
  isPayloadTooLarge,
  sanitizeUserMessage,
  checkHarmfulContent,
  sanitizeError,
  getClientIP,
} from "@/lib/security";

/**
 * Server-side proxy to Pollinations text API with full security hardening.
 *
 * Security layers (all silent — no UX interruption):
 *  1. Rate limiting (20 req/min per IP)
 *  2. Payload size limit (50 KB)
 *  3. Input sanitization (prompt-injection defense, length limit)
 *  4. Harmful-content guard (silent refusal)
 *  5. Error sanitization (no stack traces leaked)
 *  6. Streaming support for real-time response display
 *
 * Uses the "openai-fast" model which doesn't burn tokens on reasoning,
 * giving us the full token budget for the actual answer.
 */
export async function POST(req: NextRequest) {
  try {
    // ── Layer 1: Rate limiting ──
    const clientIP = getClientIP(req);
    const rateCheck = checkRateLimit(`chat:${clientIP}`, CHAT_RATE_LIMIT);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down.",
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfter) },
        },
      );
    }

    // ── Layer 2: Payload size limit ──
    const rawBody = await req.text();
    if (isPayloadTooLarge(rawBody)) {
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    }

    const body = JSON.parse(rawBody);
    const { messages, stream } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 },
      );
    }

    // ── Layer 3: Input sanitization ──
    const sanitizedMessages = messages.map((m: { role: string; content: string }) => {
      if (m.role === "user") {
        return { role: m.role, content: sanitizeUserMessage(m.content) };
      }
      return m;
    });

    // ── Layer 4: Harmful-content guard ──
    const lastUserMsg = [...sanitizedMessages].reverse().find((m: { role: string }) => m.role === "user");
    if (lastUserMsg) {
      const refusal = checkHarmfulContent(lastUserMsg.content);
      if (refusal) {
        if (stream) {
          const encoder = new TextEncoder();
          const sse = `data: ${JSON.stringify({
            choices: [{ delta: { content: refusal }, index: 0 }],
          })}\n\ndata: [DONE]\n\n`;
          return new Response(encoder.encode(sse), {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
            },
          });
        }
        return NextResponse.json({
          choices: [{ message: { content: refusal } }],
        });
      }
    }

    // ── Forward to Pollinations ──
    // Pollinations free tier now only returns gpt-oss-20b regardless of model
    // parameter. This model spends tokens on internal "reasoning" so we give
    // it a generous max_tokens to ensure the actual answer completes.
    const pollinationsBody: Record<string, unknown> = {
      model: "openai",
      messages: sanitizedMessages,
      temperature: 0.7,
      max_tokens: 4000,
    };

    if (stream) {
      pollinationsBody.stream = true;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000); // 60s hard timeout

    try {
      const pollinationsRes = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pollinationsBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!pollinationsRes.ok) {
        // If openai-fast fails, try plain "openai" as fallback
        const fallbackBody: Record<string, unknown> = {
          model: "openai",
          messages: sanitizedMessages,
          temperature: 0.7,
        };
        if (stream) fallbackBody.stream = true;

        const fallbackRes = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fallbackBody),
        });

        if (!fallbackRes.ok) {
          return NextResponse.json(
            { error: "AI service unavailable. Please try again." },
            { status: 502 },
          );
        }

        return stream
          ? streamResponse(fallbackRes)
          : NextResponse.json(await fallbackRes.json());
      }

      return stream
        ? streamResponse(pollinationsRes)
        : NextResponse.json(await pollinationsRes.json());
    } catch (fetchErr) {
      clearTimeout(timeout);
      // Handle timeout / abort
      if (fetchErr instanceof Error && fetchErr.name === "AbortError") {
        return NextResponse.json(
          { error: "The AI service took too long to respond. Please try again." },
          { status: 504 },
        );
      }
      throw fetchErr;
    }
  } catch (err) {
    const safe = sanitizeError(err);
    return NextResponse.json(
      { error: safe.message },
      { status: safe.status },
    );
  }
}

/** Helper: stream a Pollinations response back to the client. */
function streamResponse(pollinationsRes: Response): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const reader = pollinationsRes.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch {
        // Client disconnected — silent
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
