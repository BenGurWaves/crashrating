// ─�────────────────────────────────────────────────────────────┐
// │  CrashRating — Root layout                                  │
// │  High-contrast editorial layout, dark theme with amber      │
// │  accent. Space Grotesk (display) + Inter (body) via        │
// │  CSS @import in globals.css.                               │
// └────────────────────────────────────────────────────────────┘
import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SITE_URL = "https://crashrating.calyvent.com";
const title = "CrashRating — See any car's real NHTSA crash test rating";
const description =
  "Look up official NHTSA 5-star safety ratings by year, make, and model. Compare two vehicles side-by-side before you buy.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: SITE_URL,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "CrashRating",
    locale: "en-US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@calyvent",
    creator: "@calyvent",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <SupabaseProvider>
          <Header />
          <main className="page-container pt-6 pb-20">{children}</main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
