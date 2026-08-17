// ┌────────────────────────────────────────────────────────────┐
// │  Login layout — holds page-level metadata (server        │
// │  component so `export const metadata` is valid).           │
// └────────────────────────────────────────────────────────────┘
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — CrashRating",
  description:
    "Sign in to your CrashRating account to save comparisons and access Pro features.",
  openGraph: {
    title: "Log In — CrashRating",
    description:
      "Sign in to your CrashRating account to save comparisons and access Pro features.",
    url: "https://crashrating.calyvent.com/login",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Log In — CrashRating",
    description:
      "Sign in to your CrashRating account to save comparisons and access Pro features.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
