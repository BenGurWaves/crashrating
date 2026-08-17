// ─────────────────────────────────────────────────────────────
//  CrashRating — API: NHTSA vPIC models
//  GET /api/vpic/models?make=HONDA&year=2024
//  Returns models for a given make + model year.
// ─────────────────────────────────────────────────────────────
import { fetchModels } from "@/lib/nhtsa";
import type { VPRCModelForMakeYear } from "@/types/nhtsa";

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");
  const year = searchParams.get("year");

  if (!make || !year) {
    return Response.json(
      { success: false, error: "Query params 'make' and 'year' are required." },
      { status: 400 }
    );
  }

  try {
    const models: VPRCModelForMakeYear[] = await fetchModels(make, year);
    return Response.json({ success: true, data: models });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { success: false, error: message, data: null },
      { status: 502 }
    );
  }
}
