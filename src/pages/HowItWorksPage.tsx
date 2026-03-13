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
  return (
    <div className="animate-[fade-in-up_0.5s_ease-out]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2563EB]/5 to-transparent py-20">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-sm font-medium text-[#2563EB]">
              <Sun className="size-4" />
              Simple. Social. Outdoors.
            </div>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              How{" "}
              <span className="text-[#2563EB]">Smile</span>Fit Works
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Discover outdoor fitness classes across Italy&apos;s most beautiful
              cities. Whether you&apos;re a student looking for your next class
              or an instructor ready to share your passion — getting started
              takes minutes.
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
                For Students
              </span>
              <h2 className="mt-3 text-3xl font-bold">
                Find Your Perfect Class
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                From sunrise yoga in Rome to beachside bootcamp in Palermo — book
                your next outdoor workout in three simple steps.
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
                  title="Browse Classes"
                  description="Explore hundreds of outdoor fitness classes across Italy's top cities."
                  highlights={[
                    "Search by city, category, or schedule",
                    "Filter by price, difficulty, and distance",
                    "See real reviews from other students",
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={2}
                  icon={CreditCard}
                  title="Book & Pay"
                  description="Reserve your spot in seconds with our secure checkout powered by Stripe."
                  highlights={[
                    "Instant confirmation via email",
                    "Secure payment processing",
                    "Free cancellation up to 24 hours before",
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={3}
                  icon={Sun}
                  title="Show Up & Smile"
                  description="Arrive at the outdoor location, meet your instructor, and enjoy the class."
                  highlights={[
                    "GPS directions to the exact meeting point",
                    "All equipment provided by the instructor",
                    "Leave a review to help the community",
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
                For Instructors
              </span>
              <h2 className="mt-3 text-3xl font-bold">
                Grow Your Fitness Business
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                Turn your passion into a thriving outdoor fitness business.
                Reach new students, manage your schedule, and get paid — all in
                one platform.
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
                  title="Create Your Profile"
                  description="Build a professional instructor profile that showcases your expertise."
                  highlights={[
                    "Highlight specialties and certifications",
                    "Add your bio, photos, and social links",
                    "Get verified for increased visibility",
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={2}
                  icon={CalendarPlus}
                  title="List Your Classes"
                  description="Create and manage outdoor fitness classes with a powerful instructor dashboard."
                  highlights={[
                    "Set your own schedule and pricing",
                    "Define capacity and difficulty level",
                    "Add photos, descriptions, and requirements",
                  ]}
                />
              </FadeIn>
              <FadeIn>
                <StepCard
                  step={3}
                  icon={Banknote}
                  title="Get Paid"
                  description="Receive automatic weekly payouts directly to your bank account via Stripe."
                  highlights={[
                    "Transparent 10% platform fee",
                    "Real-time earnings dashboard",
                    "Automatic invoicing and tax reports",
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
                Why Outdoor Fitness in Italy?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                There&apos;s nothing quite like working out under the Italian
                sky. Here&apos;s what makes SmileFit special.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <FadeIn>
              <BenefitCard
                icon={MapPin}
                title="Stunning Locations"
                description="From ancient Roman parks to Sicilian beaches — every class takes place in a beautiful outdoor setting you won't find in any gym."
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Wind}
                title="Fresh Air & Vitamin D"
                description="Studies show outdoor exercise boosts mood, reduces stress, and improves focus. Swap fluorescent lights for Italian sunshine."
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Users}
                title="Real Community"
                description="Meet like-minded people in your city. SmileFit classes are social by nature — you'll make friends while getting fit."
              />
            </FadeIn>
            <FadeIn>
              <BenefitCard
                icon={Award}
                title="Expert Instructors"
                description="Every instructor is vetted and certified. From yoga masters to HIIT coaches, find the perfect guide for your fitness journey."
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
                Ready to Get Started?
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Join thousands of people discovering the joy of outdoor fitness
                across Italy. Your next great workout is just a click away.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#2563EB] hover:bg-[#2563EB]/90 px-8"
                >
                  <Link to="/classes">
                    Browse Classes
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8">
                  <Link to="/become-instructor">Become an Instructor</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
