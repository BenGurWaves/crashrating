// ─────────────────────────────────────────────────────────────
//  CrashRating — API: Watchlist management (auth-required)
//  GET    /api/watchlist                         → list items
//  POST   /api/watchlist  { year, make, model }  → add item
//  DELETE /api/watchlist?year=..&make=..&model=.. → remove item
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
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

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

  let body: { year?: string; make?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { year, make, model } = body;
  if (!year || !make || !model) {
    return Response.json(
      { success: false, error: "year, make, and model are required" },
      { status: 400 }
    );
  }

  // Prevent duplicates — check if already in watchlist
  const { data: existing } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("year", Number(year))
    .eq("make", make.toUpperCase())
    .eq("model", model.toUpperCase())
    .maybeSingle();

  if (existing) {
    return Response.json({
      success: true,
      data: existing,
      message: "Vehicle is already in your watchlist.",
    });
  }

  const { data, error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    year: Number(year),
    make: make.toUpperCase(),
    model: model.toUpperCase(),
  });

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data });
}

export async function DELETE(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const make = searchParams.get("make");
  const model = searchParams.get("model");

  if (!year || !make || !model) {
    return Response.json(
      { success: false, error: "Query params year, make, model required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("year", Number(year))
    .eq("make", make.toUpperCase())
    .eq("model", model.toUpperCase());

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data: null });
}
