import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Search,
  CreditCard,
  Sun,
  UserPlus,
  CalendarPlus,
  Banknote,
  MapPin,
  Wind,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "@/hooks/useInView";

// ─── Fade-in wrapper ─────────────────────────────────────────────────

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Step card ───────────────────────────────────────────────────────

function StepCard({
  step,
  icon: Icon,
  title,
  description,
  highlights,
}: {
  step: number;
  icon: typeof Search;
  title: string;
  description: string;
  highlights: string[];
}) {
  return (
    <Card className="relative overflow-hidden border-0 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-6">
        {/* Step number */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#2563EB] text-white text-sm font-bold shadow-md shadow-[#2563EB]/20">
            {step}
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#2563EB]/10">
            <Icon className="size-5 text-[#2563EB]" />
          </div>
        </div>

        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <ul className="mt-3 space-y-1.5">
          {highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#2563EB]" />
              {h}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ─── Benefit card ────────────────────────────────────────────────────

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 transition-colors group-hover:bg-[#2563EB]/20">
        <Icon className="size-6 text-[#2563EB]" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────

export function HowItWorksPage() {
  const { t } = useTranslation();
  return (
    <div className="animate-[fade-in-up_0.5s_ease-out]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2563EB]/5 to-transparent py-20">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-sm font-medium text-[#2563EB]">
              <Sun className="size-4" />
              {t("howItWorksPage.badge")}
            </div>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              {t("howItWorksPage.title")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              {t("howItWorksPage.subtitle")}
            </p>
          </FadeIn>
        </div>
        {/* Decorative blur */}
        <div className="pointer-events-none absolute -top-20 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-3xl" />
      </section>

      {/* For Students */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
                {t("howItWorksPage.forStudents")}
              </span>
              <h2 className="mt-3 text-3xl font-bold">
                {t("howItWorksPage.studentTitle")}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                {t("howItWorksPage.studentSubtitle")}
              </p>
            </div>
          </FadeIn>

          {/* Connecting line (desktop) */}
          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-[52px] hidden h-0.5 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent lg:block" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FadeIn>
                <StepCard
                  step={1}
                  icon={Search}
                  title={t("howItWorksPage.s1Title")}
                  description={t("howItWorksPage.s1Desc")}
                  highlights={[
                    t("howItWorksPage.s1h1"),
                    t("howItWorksPage.s1h2"),
                    t("howItWorksPage.s1h3"),
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={2}
                  icon={CreditCard}
                  title={t("howItWorksPage.s2Title")}
                  description={t("howItWorksPage.s2Desc")}
                  highlights={[
                    t("howItWorksPage.s2h1"),
                    t("howItWorksPage.s2h2"),
                    t("howItWorksPage.s2h3"),
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={3}
                  icon={Sun}
                  title={t("howItWorksPage.s3Title")}
                  description={t("howItWorksPage.s3Desc")}
                  highlights={[
                    t("howItWorksPage.s3h1"),
                    "What to bring listed on each class page",
                    t("howItWorksPage.s3h3"),
                  ]}
                />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* For Instructors */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
                {t("howItWorksPage.forInstructors")}
              </span>
              <h2 className="mt-3 text-3xl font-bold">
                {t("howItWorksPage.instructorTitle")}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                {t("howItWorksPage.instructorSubtitle")}
              </p>
            </div>
          </FadeIn>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-[52px] hidden h-0.5 bg-gradient-to-r from-transparent via-[#2563EB]/20 to-transparent lg:block" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FadeIn>
                <StepCard
                  step={1}
                  icon={UserPlus}
                  title={t("howItWorksPage.i1Title")}
                  description={t("howItWorksPage.i1Desc")}
                  highlights={[
                    t("howItWorksPage.i1h1"),
                    t("howItWorksPage.i1h2"),
                    t("howItWorksPage.i1h3"),
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={2}
                  icon={CalendarPlus}
                  title={t("howItWorksPage.i2Title")}
                  description={t("howItWorksPage.i2Desc")}
                  highlights={[
                    t("howItWorksPage.i2h1"),
                    t("howItWorksPage.i2h2"),
                    t("howItWorksPage.i2h3"),
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={3}
                  icon={Banknote}
                  title={t("howItWorksPage.i3Title")}
                  description={t("howItWorksPage.i3Desc")}
                  highlights={[
                    t("howItWorksPage.i3h1"),
                    t("howItWorksPage.i3h2"),
                    t("howItWorksPage.i3h3"),
                  ]}
                />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {t("howItWorksPage.benefitsTitle")}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                {t("howItWorksPage.benefitsSubtitle")}
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <FadeIn>
              <BenefitCard
                icon={MapPin}
                title={t("howItWorksPage.b1Title")}
                description={t("howItWorksPage.b1Desc")}
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Wind}
                title={t("howItWorksPage.b2Title")}
                description={t("howItWorksPage.b2Desc")}
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Users}
                title={t("howItWorksPage.b3Title")}
                description={t("howItWorksPage.b3Desc")}
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Award}
                title={t("howItWorksPage.b4Title")}
                description={t("howItWorksPage.b4Desc")}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-b from-[#2563EB]/5 to-transparent py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {t("howItWorksPage.ctaTitle")}
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                {t("howItWorksPage.ctaSubtitle")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 px-8"
                >
                  <Link to="/classes">
                    {t("common.browseClasses")}
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8">
                  <Link to="/become-instructor">{t("common.becomeInstructor")}</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
