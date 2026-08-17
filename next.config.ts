/**
 * ┌────────────────────────────────────────────────────────────────┐
 * │  CrashRating — Next.js config for Cloudflare Pages            │
 * │  Standard Next.js build; Cloudflare Pages native integration  │
 * │  handles edge compilation and deployment.                    │
 * └────────────────────────────────────────────────────────────────┘
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Images ─────────────────────────────────────────────────────
  // NHTSA's NCAP pages occasionally reference image hosts.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.nhtsa.dot.gov" },
      { protocol: "https", hostname: "*.cloudflareinsights.com" },
    ],
  },

  // ── Security & CORS headers ────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ── Redirects: strip trailing slashes ───────────────────────────
  async redirects() {
    return [
      {
        source: "/:path(.*)/",
        destination: "/:path",
        permanent: true,
      },
    ];
  },

  reactStrictMode: true,
};

export default nextConfig;
