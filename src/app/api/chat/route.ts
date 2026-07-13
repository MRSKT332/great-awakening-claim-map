import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy to Pollinations text API.
 *
 * Pollinations requires a Cloudflare Turnstile token for browser-based
 * requests but allows anonymous server-side requests. This route simply
 * forwards the chat request to Pollinations from the server, avoiding
 * the Turnstile requirement.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 },
      );
    }

    const pollinationsRes = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages,
        temperature: 0.7,
        // Pollinations anonymous tier — no API key needed server-side
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
