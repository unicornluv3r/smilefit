import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

// ─── Instructor profile ─────────────────────────────────────────────
// Profile already includes all instructor fields (specialties, certifications, etc.)

export type InstructorProfile = Profile;

// ─── Fetch all instructors ──────────────────────────────────────────

export async function fetchInstructors(): Promise<InstructorProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "instructor")
    .order("average_rating", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as InstructorProfile[];
}

// ─── Fetch single instructor ────────────────────────────────────────

export async function fetchInstructor(
  id: string,
): Promise<InstructorProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "instructor")
    .single();

  if (error) throw new Error(error.message);
  return data as InstructorProfile;
}

// ─── Become an instructor ───────────────────────────────────────────

export async function becomeInstructor(
  userId: string,
  details: {
    specialties: string[];
    certifications: string[];
    years_experience: number;
    bio: string;
    city: string;
    instagram_handle?: string;
    website_url?: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      role: "instructor",
      specialties: details.specialties,
      certifications: details.certifications,
      years_experience: details.years_experience,
      bio: details.bio,
      city: details.city,
      instagram_handle: details.instagram_handle ?? null,
      website_url: details.website_url ?? null,
      is_verified_instructor: false,
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

// ─── Instructor stats (dashboard) ───────────────────────────────────

export interface InstructorStats {
  totalClasses: number;
  totalBookings: number;
  upcomingSessions: number;
  averageRating: number;
  totalRevenue: number;
}

export async function fetchInstructorStats(
  instructorId: string,
): Promise<InstructorStats> {
  // Fetch classes count
  const { count: totalClasses } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructorId);

  // Fetch bookings for instructor's classes
  const { data: classes } = await supabase
    .from("classes")
    .select("id")
    .eq("instructor_id", instructorId);

  const classIds = (classes ?? []).map((c: { id: string }) => c.id);

  let totalBookings = 0;
  let totalRevenue = 0;
  if (classIds.length > 0) {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("total_price")
      .in("class_id", classIds)
      .eq("status", "confirmed");

    totalBookings = bookings?.length ?? 0;
    totalRevenue = (bookings ?? []).reduce(
      (sum: number, b: { total_price: number }) => sum + Number(b.total_price),
      0,
    );
  }

  // Upcoming sessions count
  let upcomingSessions = 0;
  if (classIds.length > 0) {
    const { count } = await supabase
      .from("class_sessions")
      .select("*", { count: "exact", head: true })
      .in("class_id", classIds)
      .eq("is_cancelled", false)
      .gt("start_time", new Date().toISOString());

    upcomingSessions = count ?? 0;
  }

  // Instructor average rating from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("average_rating")
    .eq("id", instructorId)
    .single();

  return {
    totalClasses: totalClasses ?? 0,
    totalBookings,
    upcomingSessions,
    averageRating: Number(profile?.average_rating ?? 0),
    totalRevenue,
  };
}

// ─── Instructor bookings (dashboard) ────────────────────────────────

export interface InstructorBooking {
  id: string;
  quantity: number;
  total_price: number;
  status: string;
  booked_at: string;
  classes: { title: string; id: string };
  class_sessions: { start_time: string; end_time: string };
  profiles: { full_name: string | null; email: string };
}

export async function fetchInstructorBookings(
  instructorId: string,
): Promise<InstructorBooking[]> {
  // Get instructor's class IDs
  const { data: classes } = await supabase
    .from("classes")
    .select("id")
    .eq("instructor_id", instructorId);

  const classIds = (classes ?? []).map((c: { id: string }) => c.id);
  if (classIds.length === 0) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, quantity, total_price, status, booked_at, classes(id, title), class_sessions(start_time, end_time), profiles:user_id(full_name, email)",
    )
    .in("class_id", classIds)
    .order("booked_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as InstructorBooking[];
}
