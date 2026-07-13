import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy to Pollinations text API with streaming support.
 *
 * Pollinations requires a Cloudflare Turnstile token for browser-based
 * requests but allows anonymous server-side requests. This route forwards
 * the chat request to Pollinations from the server.
 *
 * Supports streaming (SSE) for real-time response display.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, stream } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    // If the client requests streaming, use the streaming endpoint
    if (stream) {
      const pollinationsRes = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!pollinationsRes.ok) {
        const errText = await pollinationsRes.text();
        return NextResponse.json(
          { error: `Pollinations error: ${pollinationsRes.status}`, detail: errText },
          { status: pollinationsRes.status },
        );
      }

      // Stream the response back to the client
      const encoder = new TextEncoder();
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
          } catch (e) {
            // Client disconnected or error
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
        messages,
        temperature: 0.7,
      }),
    });

    if (!pollinationsRes.ok) {
      const errText = await pollinationsRes.text();
      return NextResponse.json(
        { error: `Pollinations error: ${pollinationsRes.status}`, detail: errText },
        { status: pollinationsRes.status },
      );
    }

    const data = await pollinationsRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", detail: err.message },
      { status: 500 },
    );
  }
}
