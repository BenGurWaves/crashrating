// ─────────────────────────────────────────────────────────────
//  CrashRating — Middleware: refreshes Supabase session on
//  every request so auth state stays in sync with cookies.
//  Runs on the Cloudflare Pages edge.
//  MUST be kept in sync with src/lib/supabase/server.ts
// ─────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          request.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value })),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refreshing the session — needed for per-user data access.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// ── Apply to all routes (but not static assets / API) ─────────
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|llms.txt|sitemap.xml|apple-touch-icon.png).*)",
  ],
};
