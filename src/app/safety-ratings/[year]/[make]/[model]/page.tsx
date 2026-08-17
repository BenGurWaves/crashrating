// ─────────────────────────────────────────────────────────────
//  CrashRating — Safety Rating detail page (SSG + ISR)
//  Route: /safety-ratings/[year]/[make]/[model]
//  Pre-generates 150+ static pages from TOP_VEHICLES data.
//  Rating data is always fetched live from the NHTSA API
//  (via /api/ratings/lookup) — never hand-typed.
// ─────────────────────────────────────────────────────────────
import Link from "next/link";
import type { Metadata } from "next";
import { StarRating } from "@/components/ui/Stars";
import { RatingDisplay } from "@/components/RatingDisplay";
import { WatchlistButton } from "@/components/WatchlistButton";
import { getVehicle } from "@/data/top-vehicles";
import { generateVehicleContent, type VehicleContent } from "@/lib/content";
import { slugify, slugToName, formatVehicleName } from "@/lib/utils";
import type { NHTSARatingResult } from "@/types/nhtsa";

// ── ISR: revalidate daily ────────────────────────────────────
export const revalidate = 86400;

// ── Shared fetch — module-level cache avoids duplicate
//    calls between generateMetadata and the page component.
// ─────────────────────────────────────────────────────────────
interface PageData {
  vehicle: { year: number; make: string; model: string; segment: string };
  rating: NHTSARatingResult | null;
  content: VehicleContent;
}

const _cache = new Map<string, PageData>();

async function fetchPageData(
  year: string,
  makeSlug: string,
  modelSlug: string
): Promise<PageData> {
  const key = `${year}-${makeSlug}-${modelSlug}`;
  const cached = _cache.get(key);
  if (cached) return cached;

  // Try to look up vehicle in our data file for exact NHTSA names
  const vehicle = getVehicle(year, makeSlug, modelSlug);
  const makeName = vehicle?.make ?? makeSlug.toUpperCase();
  const modelName = vehicle?.model ?? slugToName(modelSlug);
  const segment = vehicle?.segment ?? "unknown";
  const vehicleData = {
    year: Number(year),
    make: makeName,
    model: modelName,
    segment,
  };

  // Fetch live rating from NHTSA (via API route, 30-day cache)
  // 15s hard timeout prevents SSG page-prerender timeouts.
  let rating: NHTSARatingResult | null = null;
  try {
    const res = await fetch(
      `/api/ratings/lookup?year=${year}&make=${encodeURIComponent(
        makeName
      )}&model=${encodeURIComponent(modelName)}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(15000),
      }
    );
    const json = await res.json();
    if (json.success && json.data?.length > 0) {
      rating = json.data[0] as NHTSARatingResult;
    }
  } catch {
    rating = null;
  }

  const content = generateVehicleContent(
    { year: vehicleData.year, make: vehicleData.make, model: vehicleData.model, segment: vehicleData.segment },
    rating
  );

  const data: PageData = { vehicle: vehicleData, rating, content };
  _cache.set(key, data);
  return data;
}

// ── Static paths for top 150 vehicles ───────────────────────
export async function generateStaticParams() {
  const { TOP_VEHICLES } = await import("@/data/top-vehicles");
  return TOP_VEHICLES.map((v) => ({
    year: v.year.toString(),
    make: slugify(v.make),
    model: slugify(v.model),
  }));
}

// ── Dynamic metadata ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; make: string; model: string }>;
}): Promise<Metadata> {
  const { year, make, model } = await params;
  const data = await fetchPageData(year, make, model);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://crashrating.calyvent.com";
  const canonicalUrl = `${siteUrl}/safety-ratings/${year}/${make}/${model}`;

  return {
    title: data.content.title,
    description: data.content.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: data.content.title,
      description: data.content.description,
      type: data.rating ? "article" : "website",
      url: canonicalUrl,
      siteName: "CrashRating",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${data.vehicle.make} ${data.vehicle.model} safety rating`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.content.title,
      description: data.content.description,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ── Page component ──────────────────────────────────────────
export default async function SafetyRatingPage({
  params,
}: {
  params: Promise<{ year: string; make: string; model: string }>;
}) {
  const { year, make: makeSlug, model: modelSlug } = await params;
  const data = await fetchPageData(year, makeSlug, modelSlug);

  const { vehicle, rating, content } = data;
  const makeDisplay = vehicle.make;
  const modelDisplay = vehicle.model;
  const vehicleDisplayName = formatVehicleName(makeDisplay, modelDisplay, year);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://crashrating.calyvent.com";

  // ── JSON-LD: Article + FAQPage ─────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: vehicleDisplayName,
    description: content.description,
    author: { "@type": "Organization", name: "CrashRating" },
    publisher: {
      "@type": "Organization",
      name: "CrashRating",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-32x32.png`,
      },
    },
    datePublished: new Date().toISOString(),
    image: `${siteUrl}/og-image.png`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // ── Star helper ────────────────────────────────────────────
  function starNum(val: string | number | null | undefined): number {
    if (val == null) return 0;
    const n = typeof val === "number" ? val : Number(val);
    return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
  }

  return (
    <article className="mx-auto max-w-5xl space-y-12">
      {/* ── Hero ── */}
      <header className="text-center">
        <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
          {vehicleDisplayName}
        </h1>
        {rating ? (
          <>
            <div className="mt-4 flex justify-center">
              <StarRating
                rating={starNum(
                  rating.OverallRatingAmount ?? rating.OverallRating
                )}
                size="xl"
                showLabel={true}
                starClassName="text-gold"
              />
            </div>
            <p className="mt-2 text-sm text-text-muted">
              NHTSA Overall Rating — {(rating.VehicleType as string | undefined) || "Vehicle"}
            </p>
            <p className="mt-1 text-xs text-text-dim">
              {formatVehicleName(
                rating.Make,
                rating.Model,
                rating.VehicleModelDate
              )}
            </p>
          </>
        ) : (
          <p className="mt-4 text-lg text-text-muted">
            Rating data pending — check back for official NHTSA results.
          </p>
        )}
      </header>

      {/* ── Watchlist Button ── */}
      <div className="text-center">
        <WatchlistButton
          year={Number(year)}
          make={makeDisplay}
          model={modelDisplay}
        />
      </div>

      {/* ── Rating Breakdown ── */}
      {rating && (
        <section>
          <h2 className="font-display text-2xl font-bold text-text">
            Crash test results
          </h2>
          <div className="mt-4">
            <RatingDisplay
              rating={rating}
              showCompareButton={true}
              onCompareClick={() => {
                window.location.href = `/compare?a_year=${year}&a_make=${makeSlug}&a_model=${modelSlug}`;
              }}
            />
          </div>
        </section>
      )}

      {/* ── Generated Content ── */}
      <section
        className="prose prose-inset prose-sm max-w-none text-text prose-headings:font-display prose-headings:text-text prose-p:text-text-muted prose-strong:text-text"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />

      {/* ── FAQ Section ── */}
      {content.faqs.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-text">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-3">
            {content.faqs.map((faq, i) => (
              <div key={i} className="border-b border-border pb-3">
                <dt className="font-display text-lg font-semibold text-text">
                  {faq.question}
                </dt>
                <dd className="mt-1 text-sm text-text-muted">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Comparable Vehicles ── */}
      {content.comparableLinks.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-text">
            Vehicles in the same class
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            These vehicles compete in the {vehicle.segment.replace(/-/g, " ")}{" "}
            segment. Compare their ratings side-by-side.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {content.comparableLinks.map((c, i) => (
              <Link
                key={i}
                href={c.url}
                className="rounded border border-border bg-bg-card p-4 text-center text-sm font-medium text-text transition-colors hover:border-amber hover:text-amber"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </article>
  );
}
