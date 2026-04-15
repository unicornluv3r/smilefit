import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAuthErrorMessage } from "@/lib/authError";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["student", "instructor"]),
    agreeToTerms: z.literal(true, {
      error: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const { user, loading: authLoading, signUp } = useAuth();
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      agreeToTerms: undefined as unknown as true,
    },
  });

  const password = watch("password");
  const role = watch("role");

  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: SignUpValues) => {
    setError(null);
    try {
      await signUp(data.email, data.password, data.fullName);
      setSuccess(true);
    } catch (err: unknown) {
      console.error("[SmileFit Auth] signUp failed:", err);
      setError(getAuthErrorMessage(err));
    }
  };

  if (success) {
    return (
      <AuthLayout title={t("auth.checkEmail")} description={t("auth.confirmationSent")}>
        <div className="flex flex-col items-center gap-4 py-4">
          <MailCheck className="size-12 text-[#2563EB]" />
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.checkEmailDesc")}
          </p>
          <Button asChild className="mt-2 bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Link to="/login">{t("auth.goToLogin")}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.signupTitle")} description={t("auth.signupSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="fullName">{t("auth.fullName")}</Label>
          <Input id="fullName" placeholder={t("auth.fullNamePlaceholder")} {...register("fullName")} aria-invalid={!!errors.fullName} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" placeholder={t("auth.emailPlaceholder")} {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t("auth.createPassword")}</Label>
          <PasswordInput id="password" placeholder={t("auth.passwordPlaceholder")} {...register("password")} aria-invalid={!!errors.password} />
          <PasswordStrength password={password} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
          <PasswordInput id="confirmPassword" placeholder={t("auth.confirmPasswordPlaceholder")} {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>{t("auth.iWantTo")}</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={role === "student" ? "default" : "outline"}
              className={role === "student" ? "bg-[#2563EB] hover:bg-[#2563EB]/90" : ""}
              onClick={() => setValue("role", "student", { shouldValidate: true })}
            >
              {t("auth.takeClasses")}
            </Button>
            <Button
              type="button"
              variant={role === "instructor" ? "default" : "outline"}
              className={role === "instructor" ? "bg-[#2563EB] hover:bg-[#2563EB]/90" : ""}
              onClick={() => setValue("role", "instructor", { shouldValidate: true })}
            >
              {t("auth.teachClasses")}
            </Button>
          </div>
        </div>

        <Controller
          control={control}
          name="agreeToTerms"
          render={({ field }) => (
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal leading-snug">
                  {t("auth.agreeTerms")}{" "}
                  <Link to="#" className="text-[#2563EB] underline">
                    {t("auth.termsOfService")}
                  </Link>{" "}
                  {t("auth.and")}{" "}
                  <Link to="#" className="text-[#2563EB] underline">
                    {t("auth.privacyPolicy")}
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {t("auth.createAccount")}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground dark:bg-card">{t("auth.or")}</span>
        </div>
      </div>

      <SocialLoginButton />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.hasAccount")}{" "}
        <Link to="/login" className="font-medium text-[#2563EB] hover:underline">
          {t("auth.logInLink")}
        </Link>
      </p>
    </AuthLayout>
  );
}
