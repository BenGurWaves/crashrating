// ─────────────────────────────────────────────────────────────
//  CrashRating — API: Delete a saved comparison
//  DELETE /api/saved-comparisons/{id}
//  Requires authentication — user can only delete their own.
// ─────────────────────────────────────────────────────────────
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const { error } = await supabase
    .from("saved_comparisons")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data: null });
}
