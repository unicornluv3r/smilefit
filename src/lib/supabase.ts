import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[SmileFit] Missing Supabase environment variables.",
    "VITE_SUPABASE_URL:",
    supabaseUrl ? "SET" : "MISSING",
    "VITE_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "SET" : "MISSING",
  );
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
