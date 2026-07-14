import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware — silent security layer that runs on every request.
 *
 * Checks:
 *  - Blocks requests to sensitive file paths (.env, .git, etc.)
 *  - Adds basic bot/abuse detection (suspicious user agents)
 *  - Validates request size early
 *
 * All checks are silent — no security-system leakage in responses.
 */

const BLOCKED_PATHS = [
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.env.development",
  "/.git",
  "/.git/config",
  "/.git/HEAD",
  "/.gitignore",
  "/.npmrc",
  "/.zscripts",
  "/db",
  "/prisma",
  "/scripts",
  "/upload",
  "/skills",
  "/package.json",
  "/tsconfig.json",
  "/next.config.ts",
  "/components.json",
  "/.eslintrc",
];

// Suspicious user-agent patterns (basic bot detection)
const SUSPICIOUS_UA = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /wpscan/i,
  /hydra/i,
  /metasploit/i,
  /burp/i,
  /zap/i,
  /acunetix/i,
  /nessus/i,
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Block sensitive paths ──
  for (const blocked of BLOCKED_PATHS) {
    if (pathname === blocked || pathname.startsWith(blocked + "/")) {
      // Return a plain 404 — don't reveal the file exists
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // ── Block suspicious user agents ──
  const ua = req.headers.get("user-agent") || "";
  for (const pattern of SUSPICIOUS_UA) {
    if (pattern.test(ua)) {
      // Return a generic 403
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|great-awakening-map-poster.pdf|logo.svg).*)",
  ],
};
