import { useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function useSupabaseHealthCheck() {
  useEffect(() => {
    const checkConnection = async () => {
      if (!isSupabaseConfigured) {
        console.error(
          "[SmileFit] Supabase env vars are missing — auth and data calls will fail.",
        );
        return;
      }
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error(
            "[SmileFit] Supabase auth check failed:",
            error.message,
          );
        } else {
          console.log("[SmileFit] Supabase connection OK");
        }
      } catch (err) {
        console.error("[SmileFit] Cannot reach Supabase:", err);
      }
    };
    void checkConnection();
  }, []);
}
