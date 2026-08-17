// ┌────────────────────────────────────────────────────────────┐
// │  CrashRating — Dashboard                                  │
// │  Server component. Auth-required. Shows saved             │
// │  comparisons and watchlist.                               │
// └────────────────────────────────────────────────────────────┘
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StarRating } from "@/components/ui/Stars";
import { formatVehicleName } from "@/lib/utils";
import { DeleteComparisonButton } from "@/components/DeleteComparisonButton";
import { RemoveWatchlistButton } from "@/components/RemoveWatchlistButton";
import type { NHTSARatingResult } from "@/types/nhtsa";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Dashboard — CrashRating",
  description:
    "View your saved comparisons and watchlist. Manage your crash rating data.",
  openGraph: {
    title: "Dashboard — CrashRating",
    description:
      "View your saved comparisons and watchlist. Manage your crash rating data.",
    url: "https://crashrating.calyvent.com/dashboard",
    type: "website",
  },
};

interface VehicleSnapshot {
  year: number;
  make: string;
  model: string;
  vehicleId: number;
  overallRating: number;
  rating: NHTSARatingResult;
}

function safeParseSnapshot(data: unknown): VehicleSnapshot | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;
  return {
    year: Number(obj.year) || 0,
    make: String(obj.make ?? ""),
    model: String(obj.model ?? ""),
    vehicleId: Number(obj.vehicleId) || 0,
    overallRating: Number(obj.overallRating) || 0,
    rating: (obj.rating ?? {}) as NHTSARatingResult,
  };
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/dashboard");
  }

  // ── Saved comparisons ─────────────────────────────────────
  const { data: comparisons } = await supabase
    .from("saved_comparisons")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // ── Watchlist ─────────────────────────────────────────────
  const { data: watchlist } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-text">
          My Dashboard
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-text-muted hover:text-amber"
        >
          Signed in as {user.email}
        </Link>
      </div>

      {/* ── Saved Comparisons ── */}
      <section>
        <h2 className="font-display text-xl font-bold text-text">
          Saved Comparisons
        </h2>

        {comparisons && comparisons.length === 0 ? (
          <div className="mt-4 rounded border border-border bg-bg-card p-6 text-center">
            <p className="text-sm text-text-muted">
              You haven't saved any comparisons yet. Run a comparison on the
              home page or the compare page, then save it here.
            </p>
            <Link
              href="/"
              className="mt-2 inline-block text-sm font-medium text-amber hover:text-amber-hover"
            >
              Start a comparison →
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {comparisons?.map((c) => {
              const va = safeParseSnapshot(c.vehicle_a);
              const vb = safeParseSnapshot(c.vehicle_b);

              return (
                <div
                  key={c.id}
                  className="rounded border border-border bg-bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-text">
                        {va && formatVehicleName(va.make, va.model, va.year)}
                        {"  vs  "}
                        {vb && formatVehicleName(vb.make, vb.model, vb.year)}
                      </p>
                      <div className="flex items-center gap-4">
                        {va && (
                          <StarRating
                            rating={va.overallRating}
                            size="sm"
                            showLabel={false}
                          />
                        )}
                        {vb && (
                          <StarRating
                            rating={vb.overallRating}
                            size="sm"
                            showLabel={false}
                          />
                        )}
                      </div>
                      <p className="text-xs text-text-dim">
                        Saved {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/compare"
                        className="text-xs font-medium text-amber hover:text-amber-hover"
                      >
                        Revisit
                      </Link>
                      <DeleteComparisonButton id={c.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Watchlist ── */}
      <section>
        <h2 className="font-display text-xl font-bold text-text">
          My Watchlist
        </h2>

        {watchlist && watchlist.length === 0 ? (
          <div className="mt-4 rounded border border-border bg-bg-card p-6 text-center">
            <p className="text-sm text-text-muted">
              Your watchlist is empty. Add vehicles from the home page or any
              rating view to track them while shopping.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {watchlist?.map((w) => (
              <div
                key={w.id}
                className="rounded border border-border bg-bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">
                      {w.year} {w.make} {w.model}
                    </p>
                    <p className="text-xs text-text-dim">
                      Added {new Date(w.added_at).toLocaleDateString()}
                    </p>
                  </div>
                  <RemoveWatchlistButton
                    year={w.year}
                    make={w.make}
                    model={w.model}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Upgrade prompt ── */}
      <section>
        <div className="rounded border border-amber/30 bg-amber/5 p-6">
          <h3 className="font-display text-lg font-bold text-text">
            Need more saves?
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            The free plan lets you save 3 comparisons. Pro gives you unlimited
            saves, PDF exports, and 80+ detailed metrics.
          </p>
          <Link
            href="/pricing"
            className="mt-2 inline-block text-sm font-medium text-amber hover:text-amber-hover"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </section>
    </div>
  );
}
