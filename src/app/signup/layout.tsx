// ┌────────────────────────────────────────────────────────────┐
// │  Sign Up layout — holds page-level metadata (server        │
// │  component so `export const metadata` is valid).           │
// └────────────────────────────────────────────────────────────┘
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — CrashRating",
  description:
    "Create a CrashRating account instantly — no email verification needed. Start saving comparisons right away.",
  openGraph: {
    title: "Sign Up — CrashRating",
    description:
      "Create a CrashRating account instantly — no email verification needed. Start saving comparisons right away.",
    url: "https://crashrating.calyvent.com/signup",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up — CrashRating",
    description:
      "Create a CrashRating account instantly — no email verification needed. Start saving comparisons right away.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
