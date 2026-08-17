// ─────────────────────────────────────────────────────────────
//  CrashRating — CompareTable
//  Side-by-side comparison of two vehicles' NHTSA ratings.
//  Responsive: table scrolls horizontally on small screens.
// ─────────────────────────────────────────────────────────────
"use client";

import { StarRating } from "./ui/Stars";
import { formatVehicleName } from "@/lib/utils";
import type { NHTSARatingResult } from "@/types/nhtsa";

interface VehicleSlot {
  year: number;
  make: string;
  model: string;
  rating: NHTSARatingResult | null;
}

interface CompareTableProps {
  vehicleA: VehicleSlot;
  vehicleB: VehicleSlot;
}

function star(val: string | number | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

function pct(val: string | null | undefined): string | undefined {
  return val ? `${val}%` : undefined;
}

function RatingCell({
  rating,
  detail,
}: {
  rating: number;
  detail?: string;
}) {
  if (rating === 0) {
    return <span className="text-sm text-text-dim">Not rated</span>;
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <StarRating rating={rating} size="md" showLabel={false} />
      <span className="text-xs text-text-muted">{rating.toFixed(1)}/5</span>
      {detail && <span className="text-xs text-text-dim">{detail}</span>}
    </div>
  );
}

export function CompareTable({ vehicleA, vehicleB }: CompareTableProps) {
  const a = vehicleA.rating;
  const b = vehicleB.rating;

  const aName = `${vehicleA.make} ${vehicleA.model}`;
  const bName = `${vehicleB.make} ${vehicleB.model}`;

  const rows = [
    {
      label: "Overall Rating",
      aRating: star(a?.OverallRatingAmount ?? a?.OverallRating),
      bRating: star(b?.OverallRatingAmount ?? b?.OverallRating),
    },
    {
      label: "Frontal Crash",
      aRating: star(a?.OverallFrontCrashRatingAmount ?? a?.OverallFrontCrashRating),
      bRating: star(b?.OverallFrontCrashRatingAmount ?? b?.OverallFrontCrashRating),
    },
    {
      label: "Side Crash",
      aRating: star(a?.OverallSideCrashRatingAmount ?? a?.OverallSideCrashRating),
      bRating: star(b?.OverallSideCrashRatingAmount ?? b?.OverallSideCrashRating),
    },
    {
      label: "Rollover",
      aRating: star(a?.OverallRolloverRatingAmount ?? a?.OverallRolloverRating),
      bRating: star(b?.OverallRolloverRatingAmount ?? b?.OverallRolloverRating),
      aDetail: a ? pct(a.RolloverPossibility) : undefined,
      bDetail: b ? pct(b.RolloverPossibility) : undefined,
    },
    {
      label: "Driver (Frontal)",
      aRating: star(a?.FrontalDriverFrontalRatingAmount),
      bRating: star(b?.FrontalDriverFrontalRatingAmount),
    },
    {
      label: "Passenger (Frontal)",
      aRating: star(a?.FrontalPassengerFrontalRatingAmount),
      bRating: star(b?.FrontalPassengerFrontalRatingAmount),
    },
    {
      label: "Front Seat (Side)",
      aRating: star(a?.OverallSideSlideFrontRatingAmount),
      bRating: star(b?.OverallSideSlideFrontRatingAmount),
    },
    {
      label: "Rear Seat (Side)",
      aRating: star(a?.OverallSideSlideRearRatingAmount),
      bRating: star(b?.OverallSideSlideRearRatingAmount),
    },
  ];

  return (
    <div className="overflow-x-auto">
      {/* ── Header: vehicle names ── */}
      <div className="mb-4 text-center">
        <h3 className="font-display text-xl font-bold text-text">
          Safety comparison
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          {formatVehicleName(vehicleA.make, vehicleA.model, vehicleA.year)}
          {"  vs  "}
          {formatVehicleName(vehicleB.make, vehicleB.model, vehicleB.year)}
        </p>
      </div>

      {/* ── Comparison table ── */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left font-display text-xs font-semibold text-text-muted uppercase">
              Rating
            </th>
            <th className="text-center font-display text-xs font-semibold text-text-muted uppercase">
              {aName || "Vehicle A"}
            </th>
            <th className="text-center font-display text-xs font-semibold text-text-muted uppercase">
              {bName || "Vehicle B"}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/50">
              <td className="py-3 text-sm font-medium text-text-muted">
                {row.label}
              </td>
              <td className="py-3">
                <RatingCell rating={row.aRating} detail={row.aDetail} />
              </td>
              <td className="py-3">
                <RatingCell rating={row.bRating} detail={row.bDetail} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
