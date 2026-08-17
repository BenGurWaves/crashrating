// ┌────────────────────────────────────────────────────────────┐
// │  CrashRating — Home page                                   │
// │  Editorial-style single-column layout: bold headline,      │
// │  search widget, live results, compare slot, trust +        │
// │  pricing teaser.                                           │
// └────────────────────────────────────────────────────────────┘
"use client";

import { useState } from "react";
import Link from "next/link";
import { VehicleSelector } from "@/components/VehicleSelector";
import { RatingDisplay } from "@/components/RatingDisplay";
import { CompareTable } from "@/components/CompareTable";
import { SaveComparisonButton } from "@/components/SaveComparisonButton";
import type {
  NHTSARatingResult,
  VehicleSpec,
  VehicleVariant,
} from "@/types/nhtsa";

export default function HomePage() {
  // ── Primary vehicle ──────────────────────────────────────────
  const [primaryResults, setPrimaryResults] =
    useState<NHTSARatingResult[] | null>(null);
  const [variants, setVariants] = useState<VehicleVariant[]>([]);
  const [selectedVariant, setSelectedVariant] =
    useState<NHTSARatingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Compare vehicle ─────────────────────────────────────────
  const [showCompare, setShowCompare] = useState(false);
  const [compareResults, setCompareResults] =
    useState<NHTSARatingResult[] | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  // ── Fetch ratings for a vehicle ─────────────────────────────
  async function fetchRatings(
    spec: VehicleSpec
  ): Promise<{
    data: NHTSARatingResult[];
    variants: VehicleVariant[];
    message?: string;
  }> {
    const res = await fetch(
      `/api/ratings/lookup?year=${spec.year}&make=${encodeURIComponent(
        spec.make
      )}&model=${encodeURIComponent(spec.model)}`
    );
    const json = await res.json();

    if (!json.success) throw new Error(json.error || "Failed to fetch ratings");
    if (json.data.length === 0)
      throw new Error(json.message || "No ratings found for this vehicle.");

    return {
      data: json.data,
      variants: json.variants || [],
      message: json.message,
    };
  }

  // ── Primary search ──────────────────────────────────────────
  const handleSearchSubmit = async (spec: VehicleSpec) => {
    setLoading(true);
    setError(null);
    setPrimaryResults(null);
    setVariants([]);
    setSelectedVariant(null);
    setCompareResults(null);
    setShowCompare(false);

    try {
      const { data, variants: vs } = await fetchRatings(spec);
      setPrimaryResults(data);
      setVariants(vs);
      setSelectedVariant(data[0]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Compare search ──────────────────────────────────────────
  const handleCompareSubmit = async (spec: VehicleSpec) => {
    setCompareLoading(true);
    setCompareError(null);
    setCompareResults(null);

    try {
      const { data } = await fetchRatings(spec);
      setCompareResults(data);
    } catch (err) {
      setCompareError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setCompareLoading(false);
    }
  };

  // ── Variant selection ───────────────────────────────────────
  const handleVariantChange = (variant: VehicleVariant) => {
    const result = primaryResults?.find(
      (r) => r.VehicleId === variant.VehicleId
    );
    if (result) setSelectedVariant(result);
  };

  return (
    <div className="space-y-12">
      {/* ── Hero ── */}
      <section>
        <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
          See any car's real crash test rating.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Official NHTSA 5-star safety ratings, pulled directly from the New
          Car Assessment Program.
        </p>

        <div className="mt-8">
          <VehicleSelector
            onSubmit={handleSearchSubmit}
            loading={loading}
            buttonText="Check Rating"
          />
        </div>
      </section>

      {/* ── Error message ── */}
      {error && (
        <div className="rounded border border-error/30 bg-error/10 px-4 py-3">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── Results ── */}
      {primaryResults && selectedVariant && (
        <section>
          <RatingDisplay
            rating={selectedVariant}
            variants={variants}
            selectedVehicleId={selectedVariant.VehicleId}
            onVariantChange={handleVariantChange}
            onCompareClick={() => setShowCompare(true)}
          />
        </section>
      )}

      {/* ── Compare slot (opens inline) ── */}
      {showCompare && (
        <section>
          <h2 className="font-display text-2xl font-bold text-text">
            Compare to another vehicle
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Select a second vehicle to see a side-by-side safety comparison.
          </p>

          <div className="mt-4">
            <VehicleSelector
              onSubmit={handleCompareSubmit}
              loading={compareLoading}
              buttonText="Check Comparison"
              label="Vehicle B"
            />
          </div>

          {compareError && (
            <div className="mt-3 rounded border border-error/30 bg-error/10 px-4 py-2">
              <p className="text-sm text-error">{compareError}</p>
            </div>
          )}

          {compareResults && selectedVariant && (
            <div className="mt-8">
              <SaveComparisonButton
                vehicleA={selectedVariant}
                vehicleB={compareResults[0]}
              />
              <CompareTable
                vehicleA={{
                  year: selectedVariant.VehicleModelDate,
                  make: selectedVariant.Make,
                  model: selectedVariant.Model,
                  rating: selectedVariant,
                }}
                vehicleB={{
                  year: compareResults[0].VehicleModelDate,
                  make: compareResults[0].Make,
                  model: compareResults[0].Model,
                  rating: compareResults[0],
                }}
              />
            </div>
          )}

          <button
            onClick={() => {
              setShowCompare(false);
              setCompareResults(null);
              setCompareError(null);
            }}
            className="mt-4 text-sm text-text-muted hover:text-amber"
          >
            ← Close comparison
          </button>
        </section>
      )}

      {/* ── Trust section ── */}
      <section>
        <div className="rounded border border-border bg-bg-card px-6 py-5">
          <p className="text-sm text-text-muted">
            <span className="text-amber">●</span>{" "}
            <strong>Live data</strong> pulled directly from NHTSA's New Car
            Assessment Program. Ratings update as NHTSA publishes new test
            results.
          </p>
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section>
        <div className="rounded border border-border bg-bg-card px-6 py-5">
          <h3 className="font-display text-xl font-bold text-text">
            Need deeper insights?
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Save your comparisons, export PDFs for your dealership visit, and
            access 80+ detailed crash-test metrics with CrashRating Pro —
            $4.99/month or $39/year.
          </p>
          <Link
            href="/pricing"
            className="mt-3 inline-block text-sm font-medium text-amber hover:text-amber-hover"
          >
            See pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
