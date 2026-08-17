// ─────────────────────────────────────────────────────────────
//  CrashRating — WatchlistButton
//  Adds or removes a vehicle from the user's watchlist.
//  Requires authentication — prompts login if not signed in.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./SupabaseProvider";

interface WatchlistButtonProps {
  year: number;
  make: string;
  model: string;
  variantId?: number;
}

export function WatchlistButton({ year, make, model }: WatchlistButtonProps) {
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // ── Check watchlist status on mount ───────────────────────
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    fetch("/api/watchlist")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const found = json.data?.some(
          (item: { year: number; make: string; model: string }) =>
            item.year === year &&
            item.make.toUpperCase() === make.toUpperCase() &&
            item.model.toUpperCase() === model.toUpperCase()
        );
        setInWatchlist(found ?? false);
        setChecked(true);
      })
      .catch(() => {
        if (!cancelled) {
          setChecked(true);
          setInWatchlist(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, year, make, model]);

  const handleToggle = async () => {
    if (!user) {
      window.location.href = "/login?redirect=/";
      return;
    }

    setLoading(true);
    try {
      if (inWatchlist) {
        const res = await fetch(
          `/api/watchlist?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
          { method: "DELETE" }
        );
        const json = await res.json();
        if (json.success) setInWatchlist(false);
      } else {
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, make, model }),
        });
        const json = await res.json();
        if (json.success) setInWatchlist(true);
      }
    } catch {
      // Silently fail — the watchlist is a non-critical feature
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleToggle}
        className="text-xs font-medium text-text-muted underline decoration-amber underline-offset-2 hover:text-amber"
      >
        Sign in to save to watchlist
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !checked}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        inWatchlist
          ? "text-amber hover:text-amber-hover"
          : "text-text-muted hover:text-amber"
      }`}
      aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      <span>{inWatchlist ? "★" : "☆"}</span>
      {loading ? "Saving…" : inWatchlist ? "In watchlist" : "Add to watchlist"}
    </button>
  );
}
