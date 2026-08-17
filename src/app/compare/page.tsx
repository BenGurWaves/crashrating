// ─────────────────────────────────────────────────────────────
//  CrashRating — Compare page
//  Server component wrapper. Provides metadata + Suspense
//  boundary for the client-side CompareContent component
//  (which uses useSearchParams and must not be prerendered).
// ─────────────────────────────────────────────────────────────
import { Suspense } from "react";
import type { Metadata } from "next";
import CompareContent from "@/components/CompareContent";

export const metadata: Metadata = {
  title: "Compare NHTSA Safety Ratings | CrashRating",
  description:
    "Compare NHTSA 5-star crash test ratings side-by-side. Select two vehicles and see official frontal, side, and rollover results.",
  openGraph: {
    title: "Compare NHTSA Safety Ratings | CrashRating",
    description:
      "Compare NHTSA 5-star crash test ratings side-by-side. Select two vehicles and see official frontal, side, and rollover results.",
    type: "website",
    url: "https://crashrating.calyvent.com/compare",
    siteName: "CrashRating",
    images: [
      {
        url: "https://crashrating.calyvent.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CrashRating — Compare safety ratings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare NHTSA Safety Ratings | CrashRating",
    description:
      "Compare NHTSA 5-star crash test ratings side-by-side.",
    images: ["https://crashrating.calyvent.com/og-image.png"],
  },
};

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="font-display text-center text-lg text-text-muted">
          Loading vehicle selectors…
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
