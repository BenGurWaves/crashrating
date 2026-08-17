// ─────────────────────────────────────────────────────────────
//  CrashRating — API: Rating lookup with 30-day Supabase cache
//  GET /api/ratings/lookup?year=2024&make=HONDA&model=CR-V
//
//  Flow:
//  1. Check Supabase rating_cache for (year, make, model)
//  2. If cached & fresh (< 30 days), return cached data
//  3. Otherwise, call NHTSA SafetyRatings API → cache → return
// ─────────────────────────────────────────────────────────────
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { fetchVehicleIds, fetchRatingByVehicleId } from "@/lib/nhtsa";
import type { NHTSARatingResult, VehicleVariant } from "@/types/nhtsa";

export const runtime = 'edge';

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function buildCacheId(year: string, make: string, model: string): string {
  return `${year}-${make.toUpperCase()}-${model.toUpperCase()}`;
}

/** Build a human-readable description that distinguishes variants. */
function buildVariantDescription(rating: NHTSARatingResult): string {
  const parts: string[] = [];
  if (rating.BodyCabType) parts.push(rating.BodyCabType);

  const entry = rating as Record<string, unknown>;
  // Some variants include Series / sub-model info
  if (typeof entry.Series === "string" && entry.Series) {
    parts.push(entry.Series);
  }

  return parts.length ? parts.join(" — ") : "Standard configuration";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const make = searchParams.get("make");
  const model = searchParams.get("model");

  if (!year || !make || !model) {
    return Response.json(
      { success: false, error: "Query params 'year', 'make', and 'model' are required." },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabaseClient();
  const cacheId = buildCacheId(year, make, model);

  // ── 1. Check cache ──────────────────────────────────────
  const { data: cached, error: cacheError } = await supabase
    .from("rating_cache")
    .select("rating_data, last_fetched")
    .eq("id", cacheId)
    .maybeSingle();

  if (cached && !cacheError) {
    const lastFetched = new Date(cached.last_fetched).getTime();
    if (Date.now() - lastFetched < CACHE_TTL_MS) {
      const ratingData = cached.rating_data as NHTSARatingResult[];
      return Response.json({
        success: true,
        data: ratingData,
        fromCache: true,
      });
    }
  }

  // ── 2. Fetch from NHTSA ───────────────────────────────────
  try {
    const listResp = await fetchVehicleIds(year, make, model);

    if (listResp.Count === 0 || !listResp.Results?.length) {
      // Cache the empty result to avoid repeated lookups
      await supabase.from("rating_cache").upsert({
        id: cacheId,
        year: Number(year),
        make: make.toUpperCase(),
        model: model.toUpperCase(),
        vehicle_id: 0,
        rating_data: [],
        last_fetched: new Date().toISOString(),
      });

      return Response.json({
        success: true,
        data: [],
        fromCache: false,
        message: `No NHTSA safety rating found for ${year} ${make} ${model}. This specific configuration may not have been tested.`,
      });
    }

    // For each VehicleId, fetch the full rating
    const ratings: NHTSARatingResult[] = [];
    for (const item of listResp.Results) {
      const entry = item as Record<string, unknown>;
      const vid = entry.VehicleId;
      if (!vid) continue;

      const detail = await fetchRatingByVehicleId(Number(vid));
      if (detail.Results?.length) {
        ratings.push(detail.Results[0] as unknown as NHTSARatingResult);
      }
    }

    // ── 3. Cache the results ────────────────────────────────
    const primaryVehicleId = Number(
      (listResp.Results[0] as Record<string, unknown>).VehicleId
    );

    await supabase.from("rating_cache").upsert({
      id: cacheId,
      year: Number(year),
      make: make.toUpperCase(),
      model: model.toUpperCase(),
      vehicle_id: primaryVehicleId,
      rating_data: ratings,
      last_fetched: new Date().toISOString(),
    });

    // Build variant list for the response
    const variants: VehicleVariant[] = ratings.map((r) => ({
      VehicleId: r.VehicleId,
      Make: r.Make ?? make,
      Model: r.Model ?? model,
      VehicleModelDate: r.VehicleModelDate ?? Number(year),
      BodyCabType: r.BodyCabType ?? "",
      description: buildVariantDescription(r),
    }));

    return Response.json({
      success: true,
      data: ratings,
      variants,
      fromCache: false,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch NHTSA ratings";
    return Response.json(
      { success: false, error: message, data: null },
      { status: 502 }
    );
  }
}
