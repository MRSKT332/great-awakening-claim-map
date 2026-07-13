import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
};

export default nextConfig;
