// ─────────────────────────────────────────────────────────────
//  CrashRating — API: NHTSA vPIC makes
//  GET /api/vpic/makes?vehicleType=Car
//  Returns a list of vehicle makes from NHTSA's vPIC API.
// ─────────────────────────────────────────────────────────────
import { fetchMakes } from "@/lib/nhtsa";
import type { VPRCVehicleMake } from "@/types/nhtsa";

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleType = searchParams.get("vehicleType") ?? "Car";

  try {
    const makes: VPRCVehicleMake[] = await fetchMakes(vehicleType);
    return Response.json({ success: true, data: makes });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { success: false, error: message, data: null },
      { status: 502 }
    );
  }
}
