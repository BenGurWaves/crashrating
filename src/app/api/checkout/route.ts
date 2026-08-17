// ─────────────────────────────────────────────────────────────
//  CrashRating — API: Stripe Checkout session creation
//  POST /api/checkout
//  Body: { priceId: "price_..." }
//  Requires an authenticated Supabase user.
// ─────────────────────────────────────────────────────────────
import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  // ── Auth check ────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  // ── Parse body ────────────────────────────────────────────
  let body: { priceId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { priceId } = body;
  if (!priceId) {
    return Response.json(
      { success: false, error: "priceId is required in the request body" },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        supabase_user_id: user.id,
      },
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return Response.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create Checkout session";
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
