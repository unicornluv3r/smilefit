// Supabase Edge Function: stripe-webhook
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
//
// Required secrets:
//   STRIPE_SECRET_KEY — Stripe secret key
//   STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret (whsec_...)
//
// After deploying, add the webhook URL in Stripe Dashboard:
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//   Events: checkout.session.completed, checkout.session.expired

import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;
        const sessionIdMeta = session.metadata?.session_id;

        if (!bookingId) {
          console.error("No booking_id in session metadata");
          break;
        }

        // Update booking: confirmed + paid
        await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .eq("id", bookingId);

        // Decrement spots_remaining on the class_session
        if (sessionIdMeta) {
          const { data: bookingData } = await supabase
            .from("bookings")
            .select("quantity")
            .eq("id", bookingId)
            .single();

          if (bookingData) {
            const { data: sessionData } = await supabase
              .from("class_sessions")
              .select("spots_remaining")
              .eq("id", sessionIdMeta)
              .single();

            if (sessionData) {
              const newSpots = Math.max(
                0,
                (sessionData as { spots_remaining: number }).spots_remaining -
                  (bookingData as { quantity: number }).quantity,
              );
              await supabase
                .from("class_sessions")
                .update({ spots_remaining: newSpots })
                .eq("id", sessionIdMeta);
            }
          }
        }

        console.log(`Booking ${bookingId} confirmed and paid`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
          // Cancel the pending booking
          await supabase
            .from("bookings")
            .update({
              status: "cancelled",
              payment_status: "pending",
              cancelled_at: new Date().toISOString(),
              cancellation_reason: "Payment session expired",
            })
            .eq("id", bookingId);

          console.log(`Booking ${bookingId} cancelled (session expired)`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing error";
    console.error("Webhook processing error:", message);
    return new Response(`Webhook processing error: ${message}`, {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
