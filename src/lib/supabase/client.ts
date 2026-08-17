// ─────────────────────────────────────────────────────────────
//  CrashRating — Supabase browser client (runs in the browser only)
//  Uses ONLY the public anon key. Safe to bundle.
// ─────────────────────────────────────────────────────────────
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
