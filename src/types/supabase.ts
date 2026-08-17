// ─────────────────────────────────────────────────────────────
//  CrashRating — Supabase database type definitions
//  Mirrors the actual Supabase schema. Used by the server client
//  for type-safe queries.
// ─────────────────────────────────────────────────────────────

export interface Database {
  // Row-level security: enabled on every table.
  // Policies restrict per-user data; rating_cache is public-read.

  rating_cache: {
    Row: {
      id: string; // UUID, primary key
      year: number;
      make: string;
      model: string;
      vehicle_id: number;
      rating_data: Record<string, unknown>; // the full NHTSA result object
      last_fetched: string; // ISO timestamp
    };
    Insert: {
      id?: string;
      year: number;
      make: string;
      model: string;
      vehicle_id: number;
      rating_data: Record<string, unknown>;
      last_fetched?: string;
    };
    Update: Partial<{
      year: number;
      make: string;
      model: string;
      vehicle_id: number;
      rating_data: Record<string, unknown>;
      last_fetched: string;
    }>;
  };

  saved_comparisons: {
    Row: {
      id: string;
      user_id: string; // FK → auth.users
      vehicle_a: Record<string, unknown>; // snapshot of Vehicle A
      vehicle_b: Record<string, unknown>; // snapshot of Vehicle B
      created_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      vehicle_a: Record<string, unknown>;
      vehicle_b: Record<string, unknown>;
      created_at?: string;
    };
  };

  watchlist: {
    Row: {
      id: string;
      user_id: string; // FK → auth.users
      year: number;
      make: string;
      model: string;
      added_at: string;
    };
    Insert: {
      id?: string;
      user_id: string;
      year: number;
      make: string;
      model: string;
      added_at?: string;
    };
  };
}

// ┌────────────────────────────────────────────────────────────┐
// │  Convenience types used across the app                      │
// └────────────────────────────────────────────────────────────┘
export type RatingCache = Database["rating_cache"]["Row"];
export type SavedComparison = Database["saved_comparisons"]["Row"];
export type WatchlistEntry = Database["watchlist"]["Row"];
