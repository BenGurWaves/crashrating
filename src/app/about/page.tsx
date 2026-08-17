// ─────────────────────────────────────────────────────────────
//  CrashRating — About page
//  What this is, data source, disclaimer — three short blocks.
// ─────────────────────────────────────────────────────────────
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CrashRating — NHTSA Safety Rating Lookup",
  description:
    "CrashRating shows official NHTSA 5-star safety ratings for any vehicle. Data comes directly from NHTSA NCAP.",
  openGraph: {
    title: "About CrashRating — NHTSA Safety Rating Lookup",
    description:
      "CrashRating shows official NHTSA 5-star safety ratings for any vehicle. Data comes directly from NHTSA NCAP.",
    url: "https://crashrating.calyvent.com/about",
    type: "article",
  },
};

// ─── JSON-LD: Organization + AboutPage ──────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CrashRating",
  url: "https://crashrating.calyvent.com",
  logo: "https://crashrating.calyvent.com/favicon-32x32.png",
  sameAs: [],
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About CrashRating",
  description:
    "CrashRating provides instant access to official NHTSA 5-star crash test safety ratings for any vehicle.",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, aboutPageSchema]),
        }}
      />

      <article className="prose prose-invert max-w-none">
        <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
          About CrashRating
        </h1>

        <p className="mt-4 max-w-2xl text-base text-text-muted">
          CrashRating lets you look up any car&rsquo;s official NHTSA 5-star
          safety rating in seconds. Enter a year, make, and model — or compare
          two vehicles head-to-head — and get the real government crash-test
          results, not marketing claims.
        </p>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-text-muted">
            <strong className="text-text">Data source:</strong> Every rating
            comes from the U.S. National Highway Traffic Safety Administration
            (NHTSA) New Car Assessment Program (NCAP). We query the official
            SafetyRatings API in real time and cache results for 30 days to
            reduce load on the public service. No ratings are hand-entered or
            estimated.
          </p>

          <p className="text-sm text-text-muted">
            <strong className="text-text">Accuracy:</strong> NHTSA tests
            specific configurations — not every trim, engine, or drivetrain
            variant of every vehicle. If no match exists for your exact search,
            we tell you that plainly instead of showing a related but
            different variant&rsquo;s rating without clear labeling.
          </p>

          <p className="text-sm text-text-muted">
            <strong className="text-text">Disclaimer:</strong> Star ratings
            reflect NHTSA test data for the specific tested configuration. Not
            all trims or configurations of every vehicle have been tested. This
            is not a substitute for a full test drive and inspection.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-text-muted">
            Have a question or a vehicle you can&rsquo;t find? Email{" "}
            <a
              href="mailto:contact@calyvent.com?subject=CrashRating%20Inquiry"
              className="text-amber hover:text-amber-hover"
            >
              contact@calyvent.com
            </a>
            .
          </p>
        </div>
      </article>
    </>
  );
}
