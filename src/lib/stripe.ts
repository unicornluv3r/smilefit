import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

export const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

/**
 * Whether Stripe live mode is enabled (calls real Edge Functions).
 * When false, uses a simulated payment flow for demos/testing.
 */
export const isStripeLiveMode =
  import.meta.env.VITE_STRIPE_LIVE_MODE === "true";

/**
 * Whether we're using Stripe test keys (pk_test_...).
 */
export const isStripeTestMode = publishableKey?.startsWith("pk_test_") ?? true;
