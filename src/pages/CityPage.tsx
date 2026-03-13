import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Star,
  Users,
  BookOpen,
  Landmark,
  Sun,
  TreePine,
  Palette,
  Mountain,
  Heart,
  Building2,
  Zap,
  Train,
  Waves,
  Ship,
  Sunrise,
  Sparkles,
  GraduationCap,
  Utensils,
  Droplets,
  Trophy,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassCard } from "@/components/ClassCard";
import { MOCK_CITIES } from "@/data/mockCities";
import { MOCK_CLASSES } from "@/data/mockClasses";
import type { MockClassData } from "@/data/mockClasses";
import { MOCK_INSTRUCTORS } from "@/data/mockInstructors";
import { useClasses } from "@/hooks/useClasses";
import type { DbClass } from "@/lib/bookings";
import { useGeolocation } from "@/hooks/useGeolocation";
import { haversineDistance, formatDistance } from "@/utils/distance";

function dbClassToMock(cls: DbClass): MockClassData {
  return {
    id: cls.id,
    title: cls.title,
    category: cls.category,
    instructor: "Instructor",
    price: Number(cls.price),
    schedule: cls.recurring_schedule ?? "",
    location: cls.address ?? cls.city,
    city: cls.city,
    image: cls.images[0]?.replace("w=1200", "w=600") ?? "",
    spotsLeft: null,
    latitude: cls.latitude ?? 0,
    longitude: cls.longitude ?? 0,
    popular: false,
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  Landmark,
  Sun,
  TreePine,
  Palette,
  Mountain,
  Heart,
  Building2,
  Zap,
  Train,
  Waves,
  Ship,
  Sunrise,
  Sparkles,
  GraduationCap,
  Utensils,
  Droplets,
  Trophy,
  Compass,
  Pizza: Utensils,
};

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = MOCK_CITIES.find((c) => c.slug === slug);
  const geo = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: dbClasses } = useClasses();

  const cityClasses = useMemo(() => {
    if (!city) return [];
    // Use Supabase classes if available, otherwise mock
    const allClasses: MockClassData[] =
      dbClasses && dbClasses.length > 0
        ? dbClasses.map(dbClassToMock)
        : MOCK_CLASSES;
    const filtered = allClasses.filter(
      (c) => c.city === city.nameIT || c.city === city.name,
    );
    if (selectedCategory) {
      return filtered.filter((c) => c.category === selectedCategory);
    }
    return filtered;
  }, [city, selectedCategory, dbClasses]);

  const cityInstructors = useMemo(() => {
    if (!city) return [];
    return MOCK_INSTRUCTORS.filter((i) => i.city === city.nameIT);
  }, [city]);

  if (!city) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">City not found</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t find a city with that name.
        </p>
        <Button asChild className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/cities">Browse All Cities</Link>
        </Button>
      </div>
    );
  }

  const distanceKm =
    geo.latitude !== null && geo.longitude !== null
      ? haversineDistance(
          geo.latitude,
          geo.longitude,
          city.latitude,
          city.longitude,
        )
      : null;

  return (
    <div className="animate-[fade-in-up_0.5s_ease-out]">
      {/* Hero */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <img
          src={city.heroImage}
          alt={`${city.name}, Italy — outdoor fitness destination`}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {city.name}
            </h1>
            <p className="mt-1 text-lg text-white/80">{city.nameIT}</p>
            <p className="mt-3 max-w-2xl text-white/70">{city.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <BookOpen className="size-4" />
                {city.classCount} classes
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-4" />
                {city.instructorCount} instructors
              </span>
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                {city.averageRating} avg rating
              </span>
              {distanceKm !== null && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  You&apos;re {formatDistance(distanceKm)} away
                </span>
              )}
            </div>

            <Button
              asChild
              className="mt-5 bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              <Link to={`/classes?city=${city.nameIT}`}>
                Explore Classes <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="border-b py-8">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-lg font-semibold">Popular Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedCategory === null ? "bg-[#2563EB] text-white" : ""
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {city.popularCategories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat ? "bg-[#2563EB] text-white" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Class Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Classes in {city.name}
            </h2>
            <Button variant="ghost" asChild>
              <Link to={`/classes?city=${city.nameIT}`}>
                View all <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          {cityClasses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cityClasses.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No classes found for this category. Try another one!
            </p>
          )}
        </div>
      </section>

      {/* Featured Instructors */}
      {cityInstructors.length > 0 && (
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-2xl font-bold">
              Top Instructors in {city.name}
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {cityInstructors.map((inst) => (
                <Link
                  key={inst.id}
                  to={`/instructors/${inst.id}`}
                  className="flex min-w-[180px] flex-col items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:shadow-md"
                >
                  <img
                    src={inst.avatar}
                    alt={`${inst.name}, ${inst.specialty} instructor`}
                    className="size-16 rounded-full object-cover"
                  />
                  <span className="font-semibold">{inst.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {inst.specialty}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    {inst.rating} ({inst.reviewCount})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {city.featuredTestimonial && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 text-center shadow-sm">
              <div className="mb-3 flex justify-center gap-1">
                {Array.from({ length: city.featuredTestimonial.rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ),
                )}
              </div>
              <blockquote className="mb-4 text-lg text-muted-foreground italic">
                &ldquo;{city.featuredTestimonial.quote}&rdquo;
              </blockquote>
              <p className="font-semibold">{city.featuredTestimonial.author}</p>
              <p className="text-sm text-muted-foreground">
                {city.featuredTestimonial.className}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Why City */}
      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Why {city.name}?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {city.sellingPoints.map((sp) => {
              const Icon = ICON_MAP[sp.icon] ?? MapPin;
              return (
                <div
                  key={sp.title}
                  className="flex flex-col items-center rounded-xl border bg-card p-6 text-center"
                >
                  <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#2563EB]/10">
                    <Icon className="size-6 text-[#2563EB]" />
                  </div>
                  <h3 className="mb-2 font-semibold">{sp.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {sp.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">
            Ready to get moving in {city.name}?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join hundreds of fitness enthusiasts training outdoors in{" "}
            {city.nameIT}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
              size="lg"
            >
              <Link to={`/classes?city=${city.nameIT}`}>Browse Classes</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/signup">Become an Instructor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
