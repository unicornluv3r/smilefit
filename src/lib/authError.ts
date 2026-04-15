import { isSupabaseConfigured } from "@/lib/supabase";

export function getAuthErrorMessage(err: unknown): string {
  const raw =
    err instanceof Error ? err.message : "An unexpected error occurred";
  const lower = raw.toLowerCase();

  if (!isSupabaseConfigured) {
    console.error(
      "[SmileFit Auth] Supabase env vars are missing — request cannot be made.",
    );
    return "Service is not configured. Please contact support.";
  }

  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    console.error("[SmileFit Auth] Network error — cannot reach Supabase:", raw);
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  return raw;
}
