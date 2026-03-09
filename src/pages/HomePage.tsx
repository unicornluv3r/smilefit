import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  ArrowRight,
  Search,
  CalendarCheck,
  Smile,
  Users,
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

interface FeaturedClass {
  id: string;
  title: string;
  category: string;
  instructor: string;
  price: number;
  schedule: string;
  location: string;
  city: string;
  image: string;
}

const FEATURED_CLASSES: FeaturedClass[] = [
  {
    id: "1",
    title: "Morning Yoga in Parco Sempione",
    category: "Yoga",
    instructor: "Sofia Bianchi",
    price: 15,
    schedule: "Tue & Thu, 7:30 AM",
    location: "Parco Sempione, Milano",
    city: "Milan",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "HIIT Workout at Villa Borghese",
    category: "HIIT",
    instructor: "Marco Rossi",
    price: 18,
    schedule: "Mon, Wed & Fri, 6:00 PM",
    location: "Villa Borghese, Roma",
    city: "Rome",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Pilates in Parco delle Cascine",
    category: "Pilates",
    instructor: "Lucia Verdi",
    price: 16,
    schedule: "Sat, 9:00 AM",
    location: "Parco delle Cascine, Firenze",
    city: "Florence",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
  },
];

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
      <FeaturedClassesSection />
      <HowItWorksSection />
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
              <span>Multiple Locations</span>
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
                alt="Morning Yoga in Parco Sempione"
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

function ClassCard({ cls }: { cls: FeaturedClass }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative">
        <img
          src={cls.image}
          alt={cls.title}
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white">
          {cls.category}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>{cls.schedule}</span>
        </div>
        <CardTitle className="text-lg">{cls.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" />
          <span>{cls.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0" />
          <span>{cls.instructor}</span>
        </div>
      </CardContent>
      <div className="mt-auto flex items-center justify-between px-4 pb-4">
        <span className="text-lg font-bold text-foreground">€{cls.price}</span>
        <Button
          size="sm"
          asChild
          className="bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          <Link to={`/classes/${cls.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}

function FeaturedClassesSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Classes
          </h2>
          <Button variant="ghost" asChild>
            <Link to="/classes">
              View all <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CLASSES.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="border-t bg-muted/40 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          How It Works
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#2563EB]/10">
                <step.icon className="size-7 text-[#2563EB]" />
              </div>
              <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
                Step {i + 1}
              </span>
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
