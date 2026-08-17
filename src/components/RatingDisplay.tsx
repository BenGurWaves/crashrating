// ─────────────────────────────────────────────────────────────
//  CrashRating — RatingDisplay
//  Renders a single vehicle's full NHTSA safety rating:
//  overall stars, frontal/side/rollover breakdown,
//  driver vs passenger sub-scores, and action links.
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { StarRating } from "./ui/Stars";
import { formatVehicleName } from "@/lib/utils";
import type { NHTSARatingResult, VehicleVariant } from "@/types/nhtsa";

interface RatingDisplayProps {
  rating: NHTSARatingResult;
  variantDescription?: string;
  variants?: VehicleVariant[];
  selectedVehicleId?: number;
  onVariantChange?: (variant: VehicleVariant) => void;
  onCompareClick?: () => void;
  showCompareButton?: boolean;
  compact?: boolean;
}

// Safely extract a numeric star rating from an NHTSA field.
function star(val: string | number | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

function pct(val: string | null | undefined): string {
  return val ? `${val}%` : "—";
}

/** Construct a deep-link to the NHTSA vehicle safety page. */
function nhtsaUrl(r: NHTSARatingResult): string {
  const make = encodeURIComponent(r.Make ?? "");
  const model = encodeURIComponent(r.Model ?? "");
  return `https://www.nhtsa.gov/vehicle/${r.VehicleModelDate}/${make}/${model}`;
}

function RatingBadge({
  label,
  rating,
  detail,
}: {
  label: string;
  rating: number;
  detail?: string;
}) {
  return (
    <div className="text-center">
      <StarRating rating={rating} size="lg" showLabel={false} />
      <p className="mt-1 text-xs font-medium text-text-muted">{label}</p>
      {detail && (
        <p className="text-xs text-text-dim">{detail}</p>
      )}
    </div>
  );
}

export function RatingDisplay({
  rating,
  variantDescription,
  variants,
  selectedVehicleId,
  onVariantChange,
  onCompareClick,
  showCompareButton = true,
  compact = false,
}: RatingDisplayProps) {
  const vehicleName = formatVehicleName(
    rating.Make ?? "Unknown",
    rating.Model ?? "Unknown",
    rating.VehicleModelDate ?? 0
  );

  const overall = star(rating.OverallRatingAmount ?? rating.OverallRating);
  const frontal = star(
    rating.OverallFrontCrashRatingAmount ?? rating.OverallFrontCrashRating
  );
  const side = star(
    rating.OverallSideCrashRatingAmount ?? rating.OverallSideCrashRating
  );
  const rollover = star(
    rating.OverallRolloverRatingAmount ?? rating.OverallRolloverRating
  );
  const rolloverRisk = pct(rating.RolloverPossibility);

  const driverFrontal = star(rating.FrontalDriverFrontalRatingAmount);
  const passengerFrontal = star(rating.FrontalPassengerFrontalRatingAmount);
  const frontSeatSide = star(rating.OverallSideSlideFrontRatingAmount);
  const rearSeatSide = star(rating.OverallSideSlideRearRatingAmount);

  const showVariantSelector = variants && variants.length > 1;

  return (
    <div
      className={`animate-fade-in space-y-6 ${compact ? "text-sm" : ""}`}
    >
      {/* ── Header: vehicle name + variant selector ── */}
      <div className="flex flex-col items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-text">
            {vehicleName}
          </h3>
          {variantDescription && (
            <p className="mt-1 text-sm text-text-muted">
              {variantDescription}
            </p>
          )}
        </div>

        {showVariantSelector && onVariantChange && (
          <select
            value={selectedVehicleId ?? ""}
            onChange={(e) => {
              const v = variants.find(
                (v) => v.VehicleId === Number(e.target.value)
              );
              if (v) onVariantChange(v);
            }}
            className="rounded border border-border bg-bg-card px-3 py-1.5 text-sm text-text focus:border-amber focus:outline-none"
          >
            {variants.map((v) => (
              <option key={v.VehicleId} value={v.VehicleId}>
                {v.description} (ID: {v.VehicleId})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Overall rating (large, prominent) ── */}
      <div className="text-center">
        <div className="flex justify-center">
          <StarRating
            rating={overall}
            size="xl"
            showLabel={false}
            starClassName="text-gold"
          />
        </div>
        <p className="mt-2 font-display text-4xl font-bold text-text">
          {overall.toFixed(1)}/{5}
        </p>
        <p className="text-sm text-text-muted">NHTSA Overall Rating</p>
      </div>

      {/* ── Three-category breakdown ── */}
      <div className="grid grid-cols-1 gap-6 border-y border-border py-4 sm:grid-cols-3 sm:divide-x sm:divide-border">
        <RatingBadge
          label="Frontal Crash"
          rating={frontal}
          detail={rating.FrontalCrashOverlapRating}
        />
        <RatingBadge
          label="Side Crash"
          rating={side}
          detail={rating.BodyCabType}
        />
        <RatingBadge
          label="Rollover"
          rating={rollover}
          detail={`Risk: ${rolloverRisk}`}
        />
      </div>

      {/* ── Driver vs Passenger ── */}
      <div>
        <h4 className="font-display text-sm font-semibold text-text-muted uppercase">
          Frontal crash — driver vs. passenger
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="text-center">
            <StarRating
              rating={driverFrontal}
              size="md"
              showLabel={false}
            />
            <p className="mt-1 text-xs text-text-muted">Driver</p>
            <p className="text-xs text-text-dim">
              {rating.FrontCrashRatedFrontSeat}
            </p>
          </div>
          <div className="text-center">
            <StarRating
              rating={passengerFrontal}
              size="md"
              showLabel={false}
            />
            <p className="mt-1 text-xs text-text-muted">Front passenger</p>
            <p className="text-xs text-text-dim">
              {rating.FrontCrashRatedOtherOccupant}
            </p>
          </div>
        </div>
      </div>

      {/* ── Side impact sub-ratings ── */}
      <div>
        <h4 className="font-display text-sm font-semibold text-text-muted uppercase">
          Side impact — front vs. rear seat
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="text-center">
            <StarRating
              rating={frontSeatSide}
              size="md"
              showLabel={false}
            />
            <p className="mt-1 text-xs text-text-muted">Front seat</p>
          </div>
          <div className="text-center">
            <StarRating
              rating={rearSeatSide}
              size="md"
              showLabel={false}
            />
            <p className="mt-1 text-xs text-text-muted">Rear seat</p>
          </div>
        </div>
      </div>

      {/* ── Restraint info ── */}
      {(rating.SideAirbags || rating.OtherRestraintSystemsInfo) && (
        <div className="rounded border border-border bg-bg-card p-4">
          <h4 className="font-display text-sm font-semibold text-text-muted uppercase">
            Safety equipment
          </h4>
          {rating.SideAirbags && (
            <p className="mt-1 text-sm text-text">
              <span className="text-text-muted">Airbags: </span>
              {rating.SideAirbags}
            </p>
          )}
          {rating.OtherRestraintSystemsInfo && (
            <p className="mt-1 text-sm text-text">
              <span className="text-text-muted">Restraints: </span>
              {rating.OtherRestraintSystemsInfo}
            </p>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
        <Link
          href={nhtsaUrl(rating)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-amber hover:text-amber-hover"
        >
          View official NHTSA record →
        </Link>

        {showCompareButton && onCompareClick && (
          <button
            onClick={onCompareClick}
            className="rounded border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-amber hover:text-amber"
          >
            Compare to another vehicle
          </button>
        )}
      </div>
    </div>
  );
}
