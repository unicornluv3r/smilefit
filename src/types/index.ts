export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: "user" | "instructor" | "admin";
  city: string | null;
  favorite_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface Instructor {
  id: string;
  profile_id: string;
  bio: string;
  specialties: string[];
  rating: number;
  total_reviews: number;
  city: string;
  verified: boolean;
  photo_url: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  price_cents: number;
  currency: string;
  image_url: string | null;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  class_id: string;
  status: "confirmed" | "cancelled" | "completed";
  booked_at: string;
  cancelled_at: string | null;
}

export interface Review {
  id: string;
  user_id: string;
  class_id: string;
  instructor_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
