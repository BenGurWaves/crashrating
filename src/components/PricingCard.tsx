// ─────────────────────────────────────────────────────────────
//  CrashRating — PricingCard component
//  Reusable card for each pricing tier.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useAuth } from "@/components/SupabaseProvider";

interface PricingCardProps {
  tier: "free" | "pro";
  title: string;
  subtitle: string;
  price: string;
  description: string;
  features: string[];
  priceId?: string;
  featured?: boolean;
}

export function PricingCard({
  tier,
  title,
  subtitle,
  price,
  description,
  features,
  priceId,
  featured = false,
}: PricingCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (tier !== "pro" || !priceId) return;

    if (!user) {
      window.location.href = "/login?redirect=/pricing";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      if (json.url) {
        window.location.href = json.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded border p-6 transition-all ${
        featured
          ? "border-amber bg-bg-card shadow-lg shadow-amber/10"
          : "border-border bg-bg-card"
      }`}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold text-text">{title}</h3>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>

        <div>
          <p className="font-display text-3xl font-bold text-text">{price}</p>
          <p className="text-sm text-text-muted">{description}</p>
        </div>

        <ul className="space-y-2 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-text-muted">
              <span className="text-amber">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {tier === "pro" && priceId && (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded bg-amber px-4 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-amber-hover disabled:opacity-50"
          >
            {loading ? "Loading…" : "Subscribe with Stripe"}
          </button>
        )}

        {tier === "free" && (
          <button className="w-full rounded border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-amber hover:text-amber">
            Get started (free)
          </button>
        )}
      </div>
    </div>
  );
}
