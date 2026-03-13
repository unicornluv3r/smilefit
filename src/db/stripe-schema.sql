-- Add Stripe-related columns to bookings if not already present
alter table public.bookings
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text;

-- Create index for faster lookups
create index if not exists idx_bookings_stripe_session
  on public.bookings(stripe_checkout_session_id);
