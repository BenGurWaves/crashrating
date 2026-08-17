// ─────────────────────────────────────────────────────────────
//  CrashRating — DeleteComparisonButton
//  Client component: removes a saved comparison, then refreshes.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteComparisonButtonProps {
  id: string;
}

export function DeleteComparisonButton({ id }: DeleteComparisonButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this comparison from your dashboard?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/saved-comparisons/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        router.refresh();
      } else {
        alert(json.error || "Failed to delete.");
      }
    } catch {
      alert("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-text-muted hover:text-error"
    >
      {loading ? "Removing…" : "Remove"}
    </button>
  );
}
