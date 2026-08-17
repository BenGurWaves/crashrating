// ─────────────────────────────────────────────────────────────
//  CrashRating — Footer
//  Reproduces the navigation, contact trigger, and disclaimer.
// ─────────────────────────────────────────────────────────────
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/compare", label: "Compare" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <footer className="border-t border-border bg-bg-card mt-16">
      <div className="page-container py-10">
        <div className="space-y-6">
          {/* ── Top row: site name + primary nav ── */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <Link href="/" className="font-display text-xl font-bold text-text">
              Crash<span className="text-amber">Rating</span>
            </Link>

            <nav className="flex flex-wrap gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-muted hover:text-amber"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="mailto:contact@calyvent.com?subject=CrashRating%20Inquiry"
                className="text-sm font-medium text-text-muted hover:text-amber"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* ── Contact trigger ── */}
          <div>
            <a
              href="mailto:contact@calyvent.com?subject=CrashRating%20Inquiry"
              className="text-sm text-text-muted hover:text-amber"
            >
              Questions? Email contact@calyvent.com
            </a>
          </div>

          {/* ── Disclaimer ── */}
          <p className="max-w-3xl text-xs text-text-dim">
            Star ratings reflect NHTSA test data for the specific tested
            configuration. Not all trims or configurations of every vehicle have
            been tested. This is not a substitute for a full test drive and
            inspection. CrashRating sources its data directly from the NHTSA
            New Car Assessment Program (NCAP). © {year} Calyvent. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
