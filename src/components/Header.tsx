// ─────────────────────────────────────────────────────────────
//  CrashRating — Header
//  Left-aligned site name, centered navigation, right auth menu.
//  High-contrast dark theme — amber accent hover states.
// ─────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import { useAuth } from "./SupabaseProvider";
import { AuthButton } from "./AuthButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between">
        {/* ── Site name ── */}
        <Link href="/" className="font-display text-xl font-bold text-text">
          Crash<span className="text-amber">Rating</span>
        </Link>

        {/* ── Navigation ── */}
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-text-muted transition-colors hover:text-amber"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Auth ── */}
        <AuthButton />
      </div>
    </header>
  );
}
