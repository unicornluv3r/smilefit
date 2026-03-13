// Supabase Edge Function: create-checkout-session
// Deploy with: supabase functions deploy create-checkout-session --no-verify-jwt
//
// Required secrets (set via Supabase Dashboard → Settings → Edge Functions):
//   STRIPE_SECRET_KEY — your Stripe secret key (sk_test_... or sk_live_...)

import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-04-10",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  classId: string;
  sessionId: string;
  quantity: number;
  userId: string;
  className: string;
  unitPrice: number; // in EUR, e.g. 18
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    const { classId, sessionId, quantity, userId, className, unitPrice } = body;

    // Validate inputs
    if (!classId || !sessionId || !quantity || !userId || !unitPrice) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the class exists and check price server-side
    const { data: cls, error: clsError } = await supabase
      .from("classes")
      .select("price, title")
      .eq("id", classId)
      .single();

    if (clsError || !cls) {
      return new Response(
        JSON.stringify({ error: "Class not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Use server-side price (don't trust client)
    const serverPrice = Number(cls.price);
    const subtotal = serverPrice * quantity;
    const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
    const totalPrice = subtotal + serviceFee;

    // Create a pending booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        class_id: classId,
        session_id: sessionId,
        quantity,
        total_price: totalPrice,
        status: "confirmed",
        payment_status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: "Failed to create booking" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Determine site URL for redirects
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://smilefit.vercel.app";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: cls.title ?? className,
              description: `${quantity} guest${quantity > 1 ? "s" : ""} — Outdoor fitness class`,
            },
            unit_amount: Math.round(serverPrice * 100), // cents
          },
          quantity,
        },
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Service fee",
            },
            unit_amount: Math.round(serviceFee * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${siteUrl}/booking/cancelled?class_id=${classId}`,
      metadata: {
        booking_id: booking.id,
        user_id: userId,
        class_id: classId,
        session_id: sessionId,
      },
    });

    // Store Stripe session ID on the booking
    await supabase
      .from("bookings")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", booking.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
