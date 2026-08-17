// ─────────────────────────────────────────────────────────────
//  CrashRating — NHTSA API client (server-side only)
//  Wraps the public vPIC and SafetyRatings endpoints.
//  All calls happen from API routes / server components — never
//  from the browser, to avoid CORS and keep secrets (if any) safe.
// ─────────────────────────────────────────────────────────────
import type {
  NHTSARatingResult,
  NHTSAListResponse,
  VPRCListResult,
  VPRCVehicleMake,
  VPRCModelForMakeYear,
  VehicleVariant,
} from "@/types/nhtsa";

// ── Endpoint constants ─────────────────────────────────────────
const VPIC_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles";
const SAFETY_BASE = "https://queryservices.nhtsa.dot.gov/svc/api/safetyratings";

// ─────────────────────────────────────────────────────────────
//  Fetch JSON from NHTSA with a short timeout + error handling.
//  Each call auto-aborts after 8s to prevent SSG page timeouts.
// ─────────────────────────────────────────────────────────────
async function nhtsaFetch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const timeoutSignal = AbortSignal.timeout(8000);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  const res = await fetch(url, {
    signal: combinedSignal,
    next: { revalidate: 0 }, // never auto-cache on the fetch level; we cache in DB
  });

  if (!res.ok) {
    throw new Error(`NHTSA API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────
//  1. vPIC: Get makes for a vehicle type (default: "Car")
//     Returns unique makes sorted alphabetically.
// ─────────────────────────────────────────────────────────────
export async function fetchMakes(vehicleType = "Car"): Promise<VPRCVehicleMake[]> {
  const url = `${VPIC_BASE}/GetMakesForVehicleType/${encodeURIComponent(vehicleType)}?format=json`;
  const data = await nhtsaFetch<VPRCListResult<VPRCVehicleMake>>(url);
  return (data.Results ?? []).sort((a, b) => a.MakeName.localeCompare(b.MakeName));
}

// ─────────────────────────────────────────────────────────────
//  2. vPIC: Get models for a make + year
//     Returns unique model names sorted alphabetically.
// ─────────────────────────────────────────────────────────────
export async function fetchModels(
  make: string,
  year: string
): Promise<VPRCModelForMakeYear[]> {
  const url = `${VPIC_BASE}/GetModelsForMakeYear/make/${encodeURIComponent(make)}/year/${encodeURIComponent(year)}?format=json`;
  const data = await nhtsaFetch<VPRCListResult<VPRCModelForMakeYear>>(url);
  return (data.Results ?? []).sort((a, b) =>
    (a.ModelName ?? "").localeCompare(b.ModelName ?? "")
  );
}

// ─────────────────────────────────────────────────────────────
//  3. SafetyRatings: Search by modelyear/make/model
//     Returns matching VehicleIds (a model may have variants).
// ─────────────────────────────────────────────────────────────
export async function fetchVehicleIds(
  year: string,
  make: string,
  model: string
): Promise<NHTSAListResponse> {
  const url = `${SAFETY_BASE}/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`;
  return nhtsaFetch<NHTSAListResponse>(url);
}

// ─────────────────────────────────────────────────────────────
//  4. SafetyRatings: Full rating detail by VehicleId
// ─────────────────────────────────────────────────────────────
export async function fetchRatingByVehicleId(
  vehicleId: number
): Promise<NHTSAListResponse> {
  const url = `${SAFETY_BASE}/VehicleId/${vehicleId}?format=json`;
  return nhtsaFetch<NHTSAListResponse>(url);
}

// ─────────────────────────────────────────────────────────────
//  Convenience: resolve year/make/model → full rating objects
//  Handles the multi-variant case.
// ─────────────────────────────────────────────────────────────
export async function resolveVehicleVariants(
  year: string,
  make: string,
  model: string
): Promise<VehicleVariant[]> {
  // Step 1: get VehicleIds matching year/make/model
  const listResp = await fetchVehicleIds(year, make, model);

  if (listResp.Count === 0 || !listResp.Results?.length) {
    return [];
  }

  // Step 2: for each VehicleId, fetch the full rating
  const variants: VehicleVariant[] = [];
  for (const item of listResp.Results) {
    const vid = (item as Record<string, unknown>).VehicleId;
    if (!vid) continue;

    const detail = await fetchRatingByVehicleId(Number(vid));
    if (!detail.Results?.length) continue;

    const rating = detail.Results[0] as unknown as NHTSARatingResult;
    variants.push({
      VehicleId: rating.VehicleId,
      Make: rating.Make ?? make,
      Model: rating.Model ?? model,
      VehicleModelDate: rating.VehicleModelDate ?? Number(year),
      BodyCabType: rating.BodyCabType ?? "",
      description: buildVariantDescription(rating),
    });
  }

  return variants;
}

// ─────────────────────────────────────────────────────────────
//  Build a human-readable description that distinguishes
//  variants of the same model (e.g. "4-door SUV" vs "2-door
//  Coupe", or "FWD" vs "AWD").
// ─────────────────────────────────────────────────────────────
function buildVariantDescription(rating: NHTSARatingResult): string {
  const parts: string[] = [];

  if (rating.BodyCabType) parts.push(rating.BodyCabType);

  // The API sometimes includes trim/series info in OtherRestraintSystemsInfo
  // or in fields like "Series". Try to extract distinguishing info.
  const entry = rating as Record<string, unknown>;

  // Check for common variant-indicator fields
  if (typeof entry.Series === "string" && entry.Series) {
    parts.push(entry.Series);
  }

  // Use the DayOfWeek as a fallback discriminator (it's the
  // date the rating was published, which is unique per variant)
  if (rating.DayOfWeek && !parts.length) {
    parts.push(rating.DayOfWeek);
  }

  return parts.length ? parts.join(" — ") : "Standard configuration";
}

// ─────────────────────────────────────────────────────────────
//  Get the most recent model year for a given make/model.
//  Used by static page generation to fill gaps.
// ─────────────────────────────────────────────────────────────
export async function fetchLatestVehicleId(
  make: string,
  model: string
): Promise<number | null> {
  const url = `${SAFETY_BASE}/modelyear/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json&year=latest`;
  const data = await nhtsaFetch<NHTSAListResponse>(url);
  if (data.Results?.length) {
    return Number((data.Results[0] as Record<string, unknown>).VehicleId) || null;
  }
  return null;
}
