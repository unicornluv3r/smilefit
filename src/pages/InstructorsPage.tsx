import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  MapPin,
  BadgeCheck,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useInstructors } from "@/hooks/useInstructors";
import type { InstructorProfile } from "@/lib/instructors";
import {
  MOCK_INSTRUCTORS,
  type MockInstructorSummary,
} from "@/data/mockInstructors";

const CITIES = [
  "All Cities",
  "Roma",
  "Milano",
  "Firenze",
  "Napoli",
  "Venezia",
  "Bologna",
  "Torino",
  "Palermo",
];

function InstructorCard({
  instructor,
}: {
  instructor: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    rating: number;
    reviewCount: number;
    city: string;
    verified?: boolean;
    bio?: string;
  };
}) {
  return (
    <Link
      to={`/instructors/${instructor.id}`}
      className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={instructor.avatar}
          alt={`${instructor.name}, fitness instructor`}
          className="size-20 rounded-full object-cover ring-2 ring-background"
        />
        {instructor.verified && (
          <BadgeCheck className="absolute -right-1 bottom-0 size-5 fill-[#2563EB] text-white" />
        )}
      </div>
      <h3 className="mt-3 font-semibold group-hover:text-[#2563EB]">
        {instructor.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{instructor.specialty}</p>
      <div className="mt-2 flex items-center gap-1 text-sm">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        <span className="font-medium">{instructor.rating}</span>
        <span className="text-muted-foreground">({instructor.reviewCount})</span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" />
        {instructor.city}
      </div>
      {instructor.bio && (
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
          {instructor.bio}
        </p>
      )}
    </Link>
  );
}

function dbToCard(p: InstructorProfile) {
  return {
    id: p.id,
    name: p.display_name ?? p.full_name ?? "Instructor",
    avatar:
      p.avatar_url ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name ?? "I")}&background=2563EB&color=fff`,
    specialty: p.specialties?.slice(0, 2).join(" & ") ?? "",
    rating: Number(p.average_rating),
    reviewCount: p.total_classes_taught,
    city: p.city ?? "",
    verified: p.is_verified_instructor,
    bio: p.bio ?? undefined,
  };
}

function mockToCard(m: MockInstructorSummary) {
  return {
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    specialty: m.specialty,
    rating: m.rating,
    reviewCount: m.reviewCount,
    city: m.city,
    verified: false,
    bio: undefined,
  };
}

function InstructorsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col items-center rounded-xl border p-6"
        >
          <div className="size-20 rounded-full bg-muted" />
          <div className="mt-3 h-5 w-32 rounded bg-muted" />
          <div className="mt-2 h-4 w-24 rounded bg-muted" />
          <div className="mt-2 h-4 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function InstructorsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const { data: dbInstructors, isLoading } = useInstructors();

  const instructors = useMemo(() => {
    if (dbInstructors && dbInstructors.length > 0) {
      return dbInstructors.map(dbToCard);
    }
    return MOCK_INSTRUCTORS.map(mockToCard);
  }, [dbInstructors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return instructors.filter((inst) => {
      if (
        q &&
        !inst.name.toLowerCase().includes(q) &&
        !inst.specialty.toLowerCase().includes(q) &&
        !inst.city.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (city !== "All Cities" && inst.city !== city) return false;
      return true;
    });
  }, [instructors, search, city]);

  return (
    <div className="container mx-auto px-4 py-10 animate-[fade-in-up_0.5s_ease-out]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Our Instructors
        </h1>
        <p className="mt-2 text-muted-foreground">
          Meet the certified fitness professionals leading outdoor classes across
          Italy
        </p>
      </div>

      {/* Search & filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="size-4" />
          {filtered.length} instructor{filtered.length !== 1 && "s"}
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <InstructorsSkeleton />
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((inst) => (
            <InstructorCard key={inst.id} instructor={inst} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-medium">No instructors found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl border bg-muted/30 p-8 text-center">
        <h2 className="text-2xl font-bold">Are you a fitness instructor?</h2>
        <p className="mt-2 text-muted-foreground">
          Join SmileFit and start teaching outdoor classes in Italy&apos;s most
          beautiful cities.
        </p>
        <Badge
          asChild
          className="mt-4 cursor-pointer bg-[#2563EB] px-6 py-2 text-sm text-white hover:bg-[#2563EB]/90"
        >
          <Link to="/become-instructor">Become an Instructor</Link>
        </Badge>
      </div>
    </div>
  );
}
