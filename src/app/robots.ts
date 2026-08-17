// ─────────────────────────────────────────────────────────────
//  CrashRating — robots.txt
//  Explicitly allows search engines and AI crawlers.
// ─────────────────────────────────────────────────────────────
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── AI crawlers (explicitly allowed) ─────────────────
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // ── General crawlers ─────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/checkout"],
      },
    ],
    sitemap: "https://crashrating.calyvent.com/sitemap.xml",
  };
}
