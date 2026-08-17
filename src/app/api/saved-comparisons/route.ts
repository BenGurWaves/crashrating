// ─────────────────────────────────────────────────────────────
//  CrashRating — API: Saved comparisons (auth-required)
//  GET  /api/saved-comparisons  → list user's saved comparisons
//  POST /api/saved-comparisons  → save a new comparison
// ─────────────────────────────────────────────────────────────
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("saved_comparisons")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  let body: {
    vehicleA?: Record<string, unknown>;
    vehicleB?: Record<string, unknown>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { vehicleA, vehicleB } = body;
  if (!vehicleA || !vehicleB) {
    return Response.json(
      { success: false, error: "vehicleA and vehicleB are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("saved_comparisons").insert({
    user_id: user.id,
    vehicle_a: vehicleA,
    vehicle_b: vehicleB,
  });

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data });
}
