import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HSTS only in production (would break http://localhost in dev)
  ...(isDev ? [] : [{
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  }]),
  {
    key: "Content-Security-Policy",
    value: isDev
      ? // Dev: permissive (Turbopack HMR, cross-origin preview, eval needed)
        [
          "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
          "connect-src * ws: wss:",
          "frame-src *",
        ].join("; ")
      : // Production: strict
        [
          "default-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob:",
          "frame-src 'self' https://www.youtube-nocookie.com",
          "connect-src 'self'",
          "font-src 'self' data:",
          "worker-src 'self' blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/**" },
      { protocol: "https", hostname: "www.nasa.gov" },
      { protocol: "https", hostname: "images-assets.nasa.gov" },
      { protocol: "https", hostname: "stsci-opo.org" },
      { protocol: "https", hostname: "photojournal.jpl.nasa.gov" },
      { protocol: "https", hostname: "www.jpl.nasa.gov" },
      { protocol: "https", hostname: "solarsystem.nasa.gov" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

