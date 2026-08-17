// ─────────────────────────────────────────────────────────────
//  CrashRating — Stripe server client (server-only)
//  Uses the PRIVATE Stripe secret key.
//  MUST ONLY be imported in server-side contexts.
//
//  The Stripe client is lazily initialised so that module-level
//  import (e.g. during `next build`) does not throw when
//  STRIPE_SECRET_KEY is absent from the environment.
// ─────────────────────────────────────────────────────────────
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to your environment variables."
      );
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}
