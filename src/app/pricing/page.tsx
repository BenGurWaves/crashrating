// ┌────────────────────────────────────────────────────────────┐
// │  CrashRating — Pricing page                                │
// │  Free tier vs. Pro tier with Stripe Checkout.              │
// │  Includes Product + FAQPage JSON-LD.                       │
// └────────────────────────────────────────────────────────────┘
import { Metadata } from "next";
import { PricingCard } from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "CrashRating Pricing — Free & Pro Plans",
  description:
    "Free: unlimited lookups, 3 saved. Pro: $4.99/mo or $39/yr, PDF export, 80+ crash-test metrics. Cancel anytime.",
  openGraph: {
    title: "CrashRating Pricing — Free & Pro Plans",
    description:
      "Free: unlimited lookups, 3 saved. Pro: $4.99/mo or $39/yr, PDF export, 80+ crash-test metrics.",
    url: "https://crashrating.calyvent.com/pricing",
    type: "website",
  },
};

// ─── JSON-LD ──────────────────────────────────────────────────
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "CrashRating Pro",
  description:
    "Unlimited saved comparisons, PDF export of comparison tables, and full 80+ field crash-test metric detail beyond the star summary.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "4.99",
    priceSpecification: [
      {
        "@type": "UnitPriceSpecification",
        price: "4.99",
        unitText: "month",
      },
      {
        "@type": "UnitPriceSpecification",
        price: "39",
        unitText: "year",
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need an account to look up ratings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All rating lookups and comparisons work without an account. Sign up only if you want to save comparisons or add vehicles to a watchlist.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The free plan includes unlimited single lookups and comparisons, plus 3 saved items. Pro ($4.99/month or $39/year) unlocks unlimited saves, PDF exports, and the full 80+ field detailed metrics.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel my subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can cancel anytime from your account. You keep Pro features until the end of the current billing period.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, faqSchema]),
        }}
      />

      <div className="space-y-12">
        {/* ── Headline ── */}
        <section>
          <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-text-muted">
            Look up ratings for free. Pay only if you need to save comparisons
            or export data for your dealership visit.
          </p>
        </section>

        {/* ── Pricing cards ── */}
        <section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Free tier */}
            <PricingCard
              tier="free"
              title="Free"
              subtitle="For casual car shoppers"
              price="$0"
              description="forever"
              features={[
                "Unlimited single lookups",
                "Unlimited comparisons",
                "3 saved comparisons",
                "3 vehicles on watchlist",
              ]}
            />

            {/* Pro tier */}
            <PricingCard
              tier="pro"
              title="Pro"
              subtitle="For serious car shoppers"
              price="$4.99 / $39 yr"
              description="Billed monthly or annually (save 34%)"
              features={[
                "Unlimited saved comparisons",
                "Unlimited watchlist items",
                "PDF export of any comparison",
                "Full 80+ field crash-test metrics",
                "Early access to new vehicles",
              ]}
              priceIdMonthly={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? ""}
              priceIdAnnual={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY ?? ""}
              featured
            />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="font-display text-2xl font-bold text-text">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            <details className="rounded border border-border bg-bg-card p-4">
              <summary className="cursor-pointer font-medium text-text">
                Do I need an account to look up ratings?
              </summary>
              <p className="mt-2 text-sm text-text-muted">
                No. All rating lookups and comparisons work without an account.
                Sign up only if you want to save comparisons or add vehicles to
                a watchlist.
              </p>
            </details>
            <details className="rounded border border-border bg-bg-card p-4">
              <summary className="cursor-pointer font-medium text-text">
                Can I cancel anytime?
              </summary>
              <p className="mt-2 text-sm text-text-muted">
                Yes. Cancel from your account at any time. You keep Pro
                features until the end of the current billing period.
              </p>
            </details>
          </div>
        </section>
      </div>
    </>
  );
}
