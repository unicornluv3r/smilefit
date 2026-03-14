import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase sends the auth code as a query param when using PKCE flow
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorParam = params.get("error");
        const errorDescription = params.get("error_description");

        if (errorParam) {
          setError(errorDescription ?? errorParam);
          return;
        }

        if (code) {
          // Exchange the authorization code for a session
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }
        } else {
          // Fallback: Supabase may have set the session via hash fragment
          // The JS client auto-detects tokens in the URL hash on init,
          // so just wait a moment for the auth state to settle.
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!session) {
            setError(t("auth.noCode"));
            return;
          }
        }

        // Check the type param to determine the flow
        const type = params.get("type");

        if (type === "recovery") {
          // Password reset flow — redirect to a page where user can set new password
          toast.success(t("auth.newPassword"));
          navigate("/forgot-password", { replace: true });
          return;
        }

        // Email confirmation or magic link — redirect home with welcome toast
        toast.success(t("auth.emailVerified"));
        navigate("/", { replace: true });
      } catch {
        setError(t("auth.authFailed"));
      }
    }

    void handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <h1 className="text-xl font-bold text-destructive">
            {t("auth.authError")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-[#2563EB] hover:underline"
          >
            {t("auth.goToLogin")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="size-8 animate-spin text-[#2563EB]" />
      <p className="text-sm text-muted-foreground">{t("auth.verifying")}</p>
    </div>
  );
}
