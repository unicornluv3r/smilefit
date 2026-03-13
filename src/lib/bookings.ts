import { supabase } from "@/lib/supabase";

// ─── Database row types ───────────────────────────────────────────────

export interface DbClass {
  id: string;
  title: string;
  description: string | null;
  category: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number;
  currency: string;
  duration_minutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  spots_total: number;
  images: string[];
  tags: string[];
  what_to_bring: string[];
  cancellation_policy: string | null;
  recurring_schedule: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  instructor_bio: string | null;
  instructor_avatar: string | null;
  instructor_rating: number | null;
  instructor_specialties: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSession {
  id: string;
  class_id: string;
  start_time: string;
  end_time: string;
  spots_remaining: number;
  is_cancelled: boolean;
  created_at: string;
}

export interface DbBooking {
  id: string;
  user_id: string;
  class_id: string;
  session_id: string;
  quantity: number;
  total_price: number;
  currency: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  payment_status: "pending" | "paid" | "refunded" | "free";
  payment_intent_id: string | null;
  booked_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

export interface BookingWithDetails extends DbBooking {
  classes: DbClass;
  class_sessions: DbSession;
}

// ─── Fetch functions ──────────────────────────────────────────────────

export async function fetchClasses(): Promise<DbClass[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as DbClass[];
}

export async function fetchClassById(id: string): Promise<DbClass> {
  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as DbClass;
}

export async function fetchClassSessions(
  classId: string,
): Promise<DbSession[]> {
  const { data, error } = await supabase
    .from("class_sessions")
    .select("*")
    .eq("class_id", classId)
    .eq("is_cancelled", false)
    .gt("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as DbSession[];
}

export async function fetchSessionAvailability(
  sessionId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("class_sessions")
    .select("spots_remaining")
    .eq("id", sessionId)
    .single();

  if (error) throw new Error(error.message);
  return (data as { spots_remaining: number }).spots_remaining;
}

// ─── Booking mutations ────────────────────────────────────────────────

export async function createBooking(
  userId: string,
  classId: string,
  sessionId: string,
  quantity: number,
  totalPrice: number,
): Promise<DbBooking> {
  // Check availability first
  const spots = await fetchSessionAvailability(sessionId);
  if (spots < quantity) {
    throw new Error(
      spots === 0
        ? "This session is sold out"
        : `Only ${spots} spot${spots !== 1 ? "s" : ""} remaining`,
    );
  }

  // Decrement spots
  const { error: updateError } = await supabase
    .from("class_sessions")
    .update({ spots_remaining: spots - quantity })
    .eq("id", sessionId);

  if (updateError) throw new Error("Failed to reserve spots. Please try again.");

  // Insert booking
  const { data, error } = await supabase
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

  if (error) {
    // Restore spots on failure
    await supabase
      .from("class_sessions")
      .update({ spots_remaining: spots })
      .eq("id", sessionId);
    throw new Error("Failed to create booking. Please try again.");
  }

  return data as DbBooking;
}

export async function cancelBooking(
  bookingId: string,
  reason?: string,
): Promise<void> {
  // Get booking to restore spots
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("session_id, quantity")
    .eq("id", bookingId)
    .single();

  if (fetchError) throw new Error("Booking not found");

  const { session_id, quantity } = booking as {
    session_id: string;
    quantity: number;
  };

  // Update booking status
  const { error: updateError } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason ?? null,
    })
    .eq("id", bookingId);

  if (updateError) throw new Error("Failed to cancel booking");

  // Restore spots
  const spots = await fetchSessionAvailability(session_id);
  await supabase
    .from("class_sessions")
    .update({ spots_remaining: spots + quantity })
    .eq("id", session_id);
}

export async function fetchUserBookings(
  userId: string,
): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, classes(*), class_sessions(*)")
    .eq("user_id", userId)
    .order("booked_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as BookingWithDetails[];
}
