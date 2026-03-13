import { supabase } from "@/lib/supabase";
import { stripePromise, isStripeLiveMode } from "@/lib/stripe";
import { createBooking } from "@/lib/bookings";

interface CreateCheckoutParams {
  userId: string;
  classId: string;
  sessionId: string;
  quantity: number;
  totalPrice: number;
  className: string;
  unitPrice: number;
}

interface CheckoutResult {
  success: boolean;
  bookingId?: string;
  confirmationCode?: string;
  error?: string;
}

function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SF-2026-${code}`;
}

/**
 * Simulated payment flow — creates booking directly with paid status.
 * Used when VITE_STRIPE_LIVE_MODE !== 'true'.
 */
async function simulatedCheckout(
  params: CreateCheckoutParams,
): Promise<CheckoutResult> {
  // Simulate a 2s payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const booking = await createBooking(
      params.userId,
      params.classId,
      params.sessionId,
      params.quantity,
      params.totalPrice,
    );

    // Update payment status to "paid" for simulated flow
    await supabase
      .from("bookings")
      .update({ payment_status: "paid" })
      .eq("id", booking.id);

    return {
      success: true,
      bookingId: booking.id,
      confirmationCode: generateConfirmationCode(),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Payment failed",
    };
  }
}

/**
 * Real Stripe Checkout — calls Supabase Edge Function to create a session,
 * then redirects to Stripe's hosted checkout.
 */
async function stripeCheckout(
  params: CreateCheckoutParams,
): Promise<CheckoutResult> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "create-checkout-session",
      {
        body: {
          classId: params.classId,
          sessionId: params.sessionId,
          quantity: params.quantity,
          userId: params.userId,
          className: params.className,
          unitPrice: params.unitPrice,
        },
      },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    const { url } = data as { url: string };

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      return { success: false, error: "Stripe failed to load" };
    }

    window.location.href = url;

    // Won't reach here — browser navigates away
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Payment failed",
    };
  }
}

/**
 * Main checkout function — switches between simulated and real Stripe
 * based on VITE_STRIPE_LIVE_MODE env var.
 */
export async function processPayment(
  params: CreateCheckoutParams,
): Promise<CheckoutResult> {
  if (isStripeLiveMode) {
    return stripeCheckout(params);
  }
  return simulatedCheckout(params);
}
