import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/authError";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotValues) => {
    setError(null);
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("[SmileFit Auth] resetPassword failed:", err);
      setError(getAuthErrorMessage(err));
    }
  };

  if (success) {
    return (
      <AuthLayout
        title={t("auth.resetSentTitle")}
        description={t("auth.resetSentSubtitle")}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <MailCheck className="size-12 text-[#2563EB]" />
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.resetSentDesc")}
          </p>
          <Button asChild className="mt-2 bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Link to="/login">{t("auth.backToLogin")}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t("auth.forgotTitle")}
      description={t("auth.forgotSubtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {t("auth.sendResetLink")}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {t("auth.backToLogin")}
        </Link>
      </div>
    </AuthLayout>
  );
}
