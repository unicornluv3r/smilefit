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
    </div>
  );
}

function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-[#2563EB]/5 to-transparent">
      <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        {/* Left side */}
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="secondary"
            className="h-auto rounded-full px-3 py-1 text-xs font-medium"
          >
            Find outdoor sports classes in Italian cities
          </Badge>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Discover and Book{" "}
            <span className="text-[#2563EB]">Outdoor Fitness</span> Classes
            Near You
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Connect with professional trainers and join outdoor fitness classes
            in your city. From yoga and pilates to HIIT and bootcamps — find
            the perfect class for your active lifestyle.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              asChild
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              <Link to="/classes">
                Browse Classes <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/register">Become an Instructor</Link>
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap gap-6 text-sm text-muted-foreground">
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

        {/* Right side — featured card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-sm overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop"
                alt="Morning Yoga in Parco Sempione — outdoor yoga class in Milan"
                className="h-52 w-full object-cover"
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
    </section>
  );
}

function HowItWorksSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-t bg-muted/40 py-16 lg:py-24">
      <div
        className={`container mx-auto px-4 ${
          inView ? "animate-[fade-in-up_0.5s_ease-out]" : "opacity-0"
        }`}
      >
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          How It Works
        </h2>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connecting dashed line (desktop only) */}
          <div className="absolute top-7 left-1/6 right-1/6 hidden h-px border-t-2 border-dashed border-[#2563EB]/30 sm:block" />

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative mb-4 flex size-14 items-center justify-center rounded-full bg-[#2563EB]/10">
                <step.icon className="size-7 text-[#2563EB]" />
                <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
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
