import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  ArrowRight,
  Search,
  CalendarCheck,
  Smile,
  CalendarDays,
  Award,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialProofBar } from "@/components/home/SocialProofBar";
import { ExploreCitiesSection } from "@/components/home/ExploreCitiesSection";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { useInView } from "@/hooks/useInView";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

const HOW_IT_WORKS_STEPS = [
  {
    icon: Search,
    title: "Browse Classes",
    description:
      "Explore outdoor fitness classes across Italian cities. Filter by type, location, and schedule.",
  },
  {
    icon: CalendarCheck,
    title: "Book Your Spot",
    description:
      "Reserve your place in seconds with our simple booking system. Secure payment, instant confirmation.",
  },
  {
    icon: Smile,
    title: "Show Up & Enjoy",
    description:
      "Head to the outdoor location, meet your instructor, and enjoy a great workout in the fresh air.",
  },
];

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <SocialProofBar />
      <ExploreCitiesSection />
      <HowItWorksSection />
      <TestimonialsCarousel />
      <BecomeInstructorCTA />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-[#2563EB]/5 via-[#2563EB]/[0.02] to-transparent">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 size-96 rounded-full bg-[#2563EB]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 size-72 rounded-full bg-[#2563EB]/[0.05] blur-3xl" />

      <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        {/* Left side — staggered entrance */}
        <div className="flex flex-col items-start gap-6">
          {/* Badge — enters first */}
          <Badge
            variant="secondary"
            className="h-auto rounded-full px-3 py-1.5 text-xs font-medium opacity-0 animate-[fade-in_0.4s_ease-out_0.1s_forwards]"
          >
            <Sparkles className="mr-1.5 size-3 text-[#2563EB]" />
            Find outdoor sports classes in Italian cities
          </Badge>

          {/* Headline — enters second */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight opacity-0 animate-[slide-up_0.5s_ease-out_0.3s_forwards] sm:text-5xl lg:text-6xl">
            Discover and Book{" "}
            <span className="gradient-text">Outdoor Fitness</span> Classes
            Near You
          </h1>

          {/* Description — enters third */}
          <p className="max-w-lg text-lg text-muted-foreground opacity-0 animate-[slide-up_0.5s_ease-out_0.5s_forwards]">
            Connect with professional trainers and join outdoor fitness classes
            in your city. From yoga and pilates to HIIT and bootcamps — find
            the perfect class for your active lifestyle.
          </p>

          {/* CTAs — enter fourth */}
          <div className="flex flex-wrap gap-3 opacity-0 animate-[slide-up_0.5s_ease-out_0.7s_forwards]">
            <Button
              size="lg"
              asChild
              className="btn-shimmer bg-[#2563EB] hover:bg-[#2563EB]/90 transition-all duration-200 hover:shadow-lg hover:shadow-[#2563EB]/25"
            >
              <Link to="/classes">
                Browse Classes <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="transition-all duration-200 hover:shadow-md"
            >
              <Link to="/become-instructor">Become an Instructor</Link>
            </Button>
          </div>

          {/* Trust signals — enter fifth */}
          <div className="mt-2 flex flex-wrap gap-6 text-sm text-muted-foreground opacity-0 animate-[fade-in_0.4s_ease-out_0.9s_forwards]">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[#2563EB]" />
              <span>8 Italian Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#2563EB]" />
              <span>Flexible Schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-4 text-[#2563EB]" />
              <span>Expert Trainers</span>
            </div>
          </div>
        </div>

        {/* Right side — featured card with slide-up + float */}
        <div className="flex justify-center lg:justify-end">
          <div className="opacity-0 animate-[slide-up_0.6s_ease-out_0.5s_forwards]">
            <Card className="group w-full max-w-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop"
                  alt="Morning Yoga in Parco Sempione — outdoor yoga class in Milan"
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">
                  Morning Yoga in Parco Sempione
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span>Milan, Italy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0" />
                  <span>Tue &amp; Thu, 7:30 AM</span>
                </div>
              </CardContent>
              <CardFooter className="border-t-0 bg-transparent px-4 pb-4">
                <Button
                  asChild
                  className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
                >
                  <Link to="/classes/1">View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-t bg-muted/40 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2
          className={`mb-12 text-center text-3xl font-bold tracking-tight transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          How It Works
        </h2>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connecting line that draws itself */}
          <div
            className={`absolute top-7 left-[16.67%] right-[16.67%] hidden h-0.5 origin-left bg-gradient-to-r from-[#2563EB]/40 via-[#2563EB]/20 to-[#2563EB]/40 sm:block ${
              inView
                ? "animate-[draw-line_0.8s_ease-out_0.3s_forwards] scale-x-100"
                : "scale-x-0"
            }`}
            style={{ transformOrigin: "left" }}
          />

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`relative flex flex-col items-center text-center transition-all duration-500 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: inView ? `${200 + i * 150}ms` : "0ms",
              }}
            >
              <div
                className={`relative mb-4 flex size-14 items-center justify-center rounded-full bg-[#2563EB]/10 transition-transform duration-300 ${
                  inView ? "animate-[pulse-soft_2s_ease-in-out_infinite]" : ""
                }`}
                style={{
                  animationDelay: `${i * 300}ms`,
                }}
              >
                <step.icon className="size-7 text-[#2563EB]" />
                <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-[#2563EB]/30">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BecomeInstructorCTA() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563EB] to-[#3b82f6] py-20 lg:py-28"
    >
      {/* Subtle grain/mesh overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-64 rounded-full bg-white/[0.05] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-80 rounded-full bg-white/[0.05] blur-2xl" />

      <div className="container relative mx-auto px-4 text-center text-white">
        <h2
          className={`text-3xl font-bold tracking-tight transition-all duration-500 sm:text-4xl ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Turn Your Passion Into a Business
        </h2>
        <p
          className={`mx-auto mt-4 max-w-xl text-lg text-white/80 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
        >
          Join SmileFit as an instructor and start teaching outdoor fitness
          classes across Italy. Set your own schedule, keep 90% of earnings.
        </p>

        {/* Stats */}
        <div
          className={`mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: inView ? "200ms" : "0ms" }}
        >
          <InstructorStat
            icon={DollarSign}
            value={2500}
            suffix="+"
            label="Avg. Monthly"
            inView={inView}
          />
          <InstructorStat
            icon={Users}
            value={50}
            suffix="+"
            label="Instructors"
            inView={inView}
          />
          <InstructorStat
            icon={TrendingUp}
            value={90}
            suffix="%"
            label="You Keep"
            inView={inView}
          />
        </div>

        <div
          className={`mt-10 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: inView ? "400ms" : "0ms" }}
        >
          <Button
            size="lg"
            asChild
            className="btn-shimmer bg-white text-[#2563EB] hover:bg-white/90 px-8 font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
          >
            <Link to="/become-instructor">
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function InstructorStat({
  icon: Icon,
  value,
  suffix,
  label,
  inView,
}: {
  icon: typeof DollarSign;
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const count = useAnimatedCounter(value, 1500, inView);
  const display = value >= 100 ? Math.round(count).toLocaleString() : Math.round(count);

  return (
    <div className="flex flex-col items-center">
      <Icon className="mb-2 size-5 text-white/60" />
      <span className="text-2xl font-bold sm:text-3xl">
        {display}
        {suffix}
      </span>
      <span className="mt-1 text-xs text-white/60">{label}</span>
    </div>
  );
}
