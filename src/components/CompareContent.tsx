// ─────────────────────────────────────────────────────────────
//  CrashRating — CompareContent
//  Client component for the /compare page. Uses useSearchParams
//  to pre-fill vehicle A/B from URL params, then renders the
//  side-by-side comparison table. Wrapped in <Suspense> by
//  the parent page so useSearchParams works during SSG.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleSelector } from "@/components/VehicleSelector";
import { CompareTable } from "@/components/CompareTable";
import { SaveComparisonButton } from "@/components/SaveComparisonButton";
import type {
  NHTSARatingResult,
  VehicleSpec,
  VehicleVariant,
} from "@/types/nhtsa";

interface VehicleState {
  spec: VehicleSpec | null;
  result: NHTSARatingResult | null;
  variants: VehicleVariant[];
  loading: boolean;
  error: string | null;
}

const initialVehicleState: VehicleState = {
  spec: null,
  result: null,
  variants: [],
  loading: false,
  error: null,
};

export default function CompareContent() {
  const searchParams = useSearchParams();
  const [vehicleA, setVehicleA] = useState<VehicleState>(initialVehicleState);
  const [vehicleB, setVehicleB] = useState<VehicleState>(initialVehicleState);
  const autoSubmitDone = useRef(false);

  // ── Auto-submit from URL params (once) ─────────────────────
  useEffect(() => {
    if (autoSubmitDone.current) return;
    autoSubmitDone.current = true;

    const aYear = searchParams?.get("a_year") ?? "";
    const aMake = searchParams?.get("a_make") ?? "";
    const aModel = searchParams?.get("a_model") ?? "";
    const bYear = searchParams?.get("b_year") ?? "";
    const bMake = searchParams?.get("b_make") ?? "";
    const bModel = searchParams?.get("b_model") ?? "";

    if (aYear && aMake && aModel) {
      handleSearchA({ year: aYear, make: aMake, model: aModel });
    }
    if (bYear && bMake && bModel) {
      handleSearchB({ year: bYear, make: bMake, model: bModel });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Shared fetch logic ─────────────────────────────────────
  async function fetchRatings(
    spec: VehicleSpec
  ): Promise<NHTSARatingResult[]> {
    const res = await fetch(
      `/api/ratings/lookup?year=${spec.year}&make=${encodeURIComponent(
        spec.make
      )}&model=${encodeURIComponent(spec.model)}`
    );
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Failed to fetch ratings");
    }
    if (json.data.length === 0) {
      throw new Error(json.message || "No ratings found for this vehicle.");
    }
    return json.data;
  }

  // ── Vehicle A search ───────────────────────────────────────
  const handleSearchA = async (spec: VehicleSpec) => {
    setVehicleA({ spec, result: null, variants: [], loading: true, error: null });
    try {
      const data = await fetchRatings(spec);
      setVehicleA((prev) => ({ ...prev, result: data[0], variants: [], loading: false }));
    } catch (err) {
      setVehicleA((prev) => ({
        ...prev,
        result: null,
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred.",
      }));
    }
  };

  // ── Vehicle B search ───────────────────────────────────────
  const handleSearchB = async (spec: VehicleSpec) => {
    setVehicleB({ spec, result: null, variants: [], loading: true, error: null });
    try {
      const data = await fetchRatings(spec);
      setVehicleB((prev) => ({ ...prev, result: data[0], variants: [], loading: false }));
    } catch (err) {
      setVehicleB((prev) => ({
        ...prev,
        result: null,
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred.",
      }));
    }
  };

  const bothReady = vehicleA.result && vehicleB.result;

  return (
    <div className="space-y-12">
      {/* ── Headline ── */}
      <section>
        <h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
          Compare safety ratings
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-text-muted">
          Select two vehicles and see their NHTSA 5-star ratings side by side.
          The most common car-buying safety decision, answered with official
          data.
        </p>
      </section>

      {/* ── Two selectors ── */}
      <section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="font-display text-xl font-bold text-text mb-3">
              Vehicle A
            </h2>
            <VehicleSelector
              onSubmit={handleSearchA}
              label="First vehicle"
              loading={vehicleA.loading}
              buttonText="Check Rating A"
            />
            {vehicleA.error && (
              <p className="mt-2 text-sm text-error">{vehicleA.error}</p>
            )}
            {vehicleA.result && (
              <p className="mt-2 text-sm text-text-muted">
                ✓ {vehicleA.result.Make} {vehicleA.result.Model}{" "}
                {vehicleA.result.VehicleModelDate}
              </p>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-text mb-3">
              Vehicle B
            </h2>
            <VehicleSelector
              onSubmit={handleSearchB}
              label="Second vehicle"
              loading={vehicleB.loading}
              buttonText="Check Rating B"
            />
            {vehicleB.error && (
              <p className="mt-2 text-sm text-error">{vehicleB.error}</p>
            )}
            {vehicleB.result && (
              <p className="mt-2 text-sm text-text-muted">
                ✓ {vehicleB.result.Make} {vehicleB.result.Model}{" "}
                {vehicleB.result.VehicleModelDate}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      {bothReady && (
        <section className="space-y-6">
          <div>
            <SaveComparisonButton
              vehicleA={vehicleA.result!}
              vehicleB={vehicleB.result!}
            />
          </div>

          <CompareTable
            vehicleA={{
              year: vehicleA.result!.VehicleModelDate,
              make: vehicleA.result!.Make,
              model: vehicleA.result!.Model,
              rating: vehicleA.result!,
            }}
            vehicleB={{
              year: vehicleB.result!.VehicleModelDate,
              make: vehicleB.result!.Make,
              model: vehicleB.result!.Model,
              rating: vehicleB.result!,
            }}
          />
        </section>
      )}
    </div>
  );
}
