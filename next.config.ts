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

  // ── Trailing slashes: strip (Next.js built-in, more reliable than
  //    redirects() on Cloudflare Pages — the redirects() function was
  //    being inverted by @cloudflare/next-on-pages, causing 308 redirects
  //    that ADD slashes to API routes instead of removing them) ──
  trailingSlash: false,

  reactStrictMode: true,
};

export default nextConfig;
