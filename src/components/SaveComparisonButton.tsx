// ─────────────────────────────────────────────────────────────
//  CrashRating — SaveComparisonButton
//  Saves the current A-vs-B comparison to the user's account.
//  Redirects to login if not authenticated.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useAuth } from "@/components/SupabaseProvider";
import type { NHTSARatingResult } from "@/types/nhtsa";

interface SaveComparisonButtonProps {
  vehicleA: NHTSARatingResult;
  vehicleB: NHTSARatingResult;
}

function star(val: string | number | null | undefined): number {
  if (val == null) return 0;
  const n = typeof val === "number" ? val : Number(val);
  return isNaN(n) ? 0 : n;
}

export function SaveComparisonButton({
  vehicleA,
  vehicleB,
}: SaveComparisonButtonProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const snapshot = (r: NHTSARatingResult) => ({
    year: r.VehicleModelDate,
    make: r.Make,
    model: r.Model,
    vehicleId: r.VehicleId,
    overallRating: star(r.OverallRatingAmount ?? r.OverallRating),
    rating: r,
  });

  const handleSave = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/dashboard";
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleA: snapshot(vehicleA),
          vehicleB: snapshot(vehicleB),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(json.error || "Failed to save comparison.");
      }
    } catch {
      alert("Failed to save comparison.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="inline-flex items-center gap-1 rounded border border-border bg-bg-card px-4 py-2 text-sm font-medium text-text transition-colors hover:border-amber hover:text-amber disabled:opacity-50"
    >
      {saving ? "Saving…" : saved ? "✓ Saved" : "💾 Save comparison"}
    </button>
  );
}
