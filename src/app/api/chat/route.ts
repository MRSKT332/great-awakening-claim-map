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
    // Sanitize each user message (not system/assistant messages)
    const sanitizedMessages = messages.map((m: { role: string; content: string }) => {
      if (m.role === "user") {
        return { role: m.role, content: sanitizeUserMessage(m.content) };
      }
      return m;
    });

    // ── Layer 4: Harmful-content guard ──
    // Check the last user message
    const lastUserMsg = [...sanitizedMessages].reverse().find((m: { role: string }) => m.role === "user");
    if (lastUserMsg) {
      const refusal = checkHarmfulContent(lastUserMsg.content);
      if (refusal) {
        // Return the refusal as a normal assistant message (silent — user just sees the answer)
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
    if (stream) {
      const pollinationsRes = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: sanitizedMessages,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!pollinationsRes.ok) {
        return NextResponse.json(
          { error: "AI service unavailable. Please try again." },
          { status: 502 },
        );
      }

      // Stream the response back
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

    // Non-streaming fallback
    const pollinationsRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: sanitizedMessages,
        temperature: 0.7,
      }),
    });

    if (!pollinationsRes.ok) {
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 },
      );
    }

    const data = await pollinationsRes.json();
    return NextResponse.json(data);
  } catch (err) {
    // ── Layer 5: Error sanitization ──
    const safe = sanitizeError(err);
    return NextResponse.json(
      { error: safe.message },
      { status: safe.status },
    );
  }
}
