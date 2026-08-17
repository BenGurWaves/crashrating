// ┌────────────────────────────────────────────────────────────┐
// │  CrashRating — Login page                                 │
// │  Email + password sign-in. No social login.               │
// │  Email confirmation is disabled — accounts are usable     │
// │  immediately after signup.                                │
// └────────────────────────────────────────────────────────────┘
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/SupabaseProvider";

export default function LoginPage() {
  const router = useRouter();
  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard"
      : "/dashboard";
  const { supabase } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push(redirect);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* ── Headline ── */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-text">
            Log in to CrashRating
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Enter your email and password to access saved comparisons and
            Pro features.
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-border bg-bg-card px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-amber focus:outline-none"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded border border-border bg-bg-card px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-amber focus:outline-none"
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-amber px-4 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-amber-hover disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>

        {/* ── Link to signup ── */}
        <p className="text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-amber hover:text-amber-hover"
          >
            Sign up
          </Link>
          {"  ·  "}
          <Link
            href="/"
            className="text-text-muted hover:text-amber"
          >
            Back to search
          </Link>
        </p>
      </div>
    </div>
  );
}
