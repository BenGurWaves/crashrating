// ─────────────────────────────────────────────────────────────
//  CrashRating — RemoveWatchlistButton
//  Client component: removes a watchlist entry, then refreshes.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RemoveWatchlistButtonProps {
  year: number;
  make: string;
  model: string;
}

export function RemoveWatchlistButton({
  year,
  make,
  model,
}: RemoveWatchlistButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (!confirm("Remove this vehicle from your watchlist?")) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/watchlist?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (json.success) {
        router.refresh();
      } else {
        alert(json.error || "Failed to remove.");
      }
    } catch {
      alert("Failed to remove.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="text-xs text-text-muted hover:text-error"
    >
      {loading ? "Removing…" : "Remove"}
    </button>
  );
}
