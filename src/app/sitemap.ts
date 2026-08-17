// ─────────────────────────────────────────────────────────────
//  CrashRating — sitemap.xml
//  Includes all static routes + 150+ vehicle safety-rating pages.
// ─────────────────────────────────────────────────────────────
import type { MetadataRoute } from "next";
import { TOP_VEHICLES } from "@/data/top-vehicles";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://crashrating.calyvent.com";
  const now = new Date();

  // ── Static routes ────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // ── Vehicle safety-rating pages (150+) ──────────────────
  const vehicleRoutes: MetadataRoute.Sitemap = TOP_VEHICLES.map((v) => ({
    url: `${baseUrl}/safety-ratings/${v.year}/${slugify(v.make)}/${slugify(v.model)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
