import { supabase } from "@/lib/supabase";

// ─── Review types ───────────────────────────────────────────────────

export interface DbReview {
  id: string;
  booking_id: string;
  class_id: string;
  reviewer_id: string;
  instructor_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithDetails extends DbReview {
  profiles: { full_name: string | null; avatar_url: string | null };
  classes: { title: string };
}

// ─── Fetch reviews for a class ──────────────────────────────────────

export async function fetchClassReviews(
  classId: string,
): Promise<ReviewWithDetails[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "*, profiles:reviewer_id(full_name, avatar_url), classes:class_id(title)",
    )
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ReviewWithDetails[];
}

// ─── Fetch reviews for an instructor ────────────────────────────────

export async function fetchInstructorReviews(
  instructorId: string,
): Promise<ReviewWithDetails[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "*, profiles:reviewer_id(full_name, avatar_url), classes:class_id(title)",
    )
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ReviewWithDetails[];
}

// ─── Create a review ────────────────────────────────────────────────

export async function createReview(review: {
  booking_id: string;
  class_id: string;
  reviewer_id: string;
  instructor_id: string;
  rating: number;
  comment?: string;
}): Promise<DbReview> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      booking_id: review.booking_id,
      class_id: review.class_id,
      reviewer_id: review.reviewer_id,
      instructor_id: review.instructor_id,
      rating: review.rating,
      comment: review.comment ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DbReview;
}
