// ─────────────────────────────────────────────────────────────
//  CrashRating — AuthButton
//  Shows Login/Sign Up when logged out, a user menu when logged in.
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { useAuth } from "./SupabaseProvider";
import { useState, useRef, useEffect } from "react";

export function AuthButton() {
  const { user, loading, supabase } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded bg-bg-card" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-amber hover:text-amber"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded bg-amber px-4 py-2 text-sm font-bold text-bg transition-colors hover:bg-amber-hover"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:border-amber hover:text-amber"
        aria-label="User menu"
      >
        {user.email?.charAt(0).toUpperCase()}
        <span className="hidden sm:inline">
          {user.email?.split("@")[0] ?? "Account"}
        </span>
        <ChevronDownIcon />
      </button>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 rounded-md border border-border bg-bg-card shadow-lg">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-text hover:bg-bg-hover"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setMenuOpen(false);
              window.location.href = "/";
            }}
            className="block w-full px-4 py-2 text-left text-sm text-text hover:bg-bg-hover"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
