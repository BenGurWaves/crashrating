// ─────────────────────────────────────────────────────────────
//  CrashRating — Supabase admin client (server-only)
//  Uses the PRIVATE service-role key. Can bypass RLS.
//  MUST ONLY be imported in server-side contexts (API routes,
//  server actions, server components). Never in client code.
// ─────────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let _adminClient: SupabaseClient | null = null;

export function createAdminSupabaseClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. " +
        "These must be set as server-side environment variables."
    );
  }

  _adminClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return _adminClient;
}
