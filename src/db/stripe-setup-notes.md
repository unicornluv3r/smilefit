# Stripe Integration Setup Guide

## 1. Add Stripe Secret Key to Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings → Edge Functions**
3. Click **Add new secret**
4. Add the following secrets:

| Secret Name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `SITE_URL` | `https://smilefit.vercel.app` (or your deployment URL) |

## 2. Deploy Edge Functions

Install the Supabase CLI if you haven't already:

```bash
npm install -g supabase
```

Login and link your project:

```bash
supabase login
supabase link --project-ref wlprzwukwrsdlsomcbzo
```

Deploy both functions:

```bash
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
```

## 3. Run the Database Migration

In the Supabase SQL Editor, run the contents of `src/db/stripe-schema.sql` to add Stripe columns to the bookings table.

## 4. Set Up Stripe Webhook

1. Go to the [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Enter the webhook URL:
   ```
   https://wlprzwukwrsdlsomcbzo.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copy the **Signing secret** (`whsec_...`)
6. Add it as a Supabase secret:

| Secret Name | Value |
|---|---|
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (your signing secret) |

## 5. Enable Live Stripe Mode

Once everything is deployed and tested, set this in your `.env`:

```
VITE_STRIPE_LIVE_MODE=true
```

This switches from the simulated payment flow to real Stripe Checkout redirects.

## How It Works

### Simulated Mode (default, `VITE_STRIPE_LIVE_MODE=false`)
- User clicks "Pay with Stripe" in the booking modal
- A 2-second simulated processing delay runs
- Booking is created directly in Supabase with `payment_status: 'paid'`
- User sees the success confirmation
- No real charges are made

### Live Stripe Mode (`VITE_STRIPE_LIVE_MODE=true`)
1. User clicks "Pay with Stripe"
2. Frontend calls the `create-checkout-session` Edge Function
3. Edge Function creates a pending booking + Stripe Checkout Session
4. User is redirected to Stripe's hosted checkout page
5. After payment, user is redirected to `/booking/success`
6. Stripe webhook fires `checkout.session.completed`
7. Webhook updates booking to `payment_status: 'paid'`

### Security
- Stripe secret key (`sk_test_...`) is ONLY in the Edge Function environment
- The publishable key (`pk_test_...`) is safe for the frontend
- Prices are verified server-side in the Edge Function (not trusted from the client)
- Webhook signatures are verified to prevent spoofed events
