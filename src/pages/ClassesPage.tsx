import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MockClass {
  id: string;
  title: string;
  category: string;
  instructor: string;
  price: number;
  schedule: string;
  location: string;
  city: string;
  image: string;
  spotsLeft: number | null;
}

const CATEGORIES = [
  "All Categories",
  "Yoga",
  "HIIT",
  "Pilates",
  "Bootcamp",
  "Tai Chi",
  "Functional",
  "Running",
  "Boxing",
] as const;

const CITIES = [
  "All Cities",
  "Milano",
  "Roma",
  "Firenze",
  "Torino",
  "Palermo",
  "Bologna",
  "Viareggio",
] as const;

const PRICE_FILTERS = [
  "All Prices",
  "Under €15",
  "€15-€20",
  "Over €20",
] as const;

const MOCK_CLASSES: MockClass[] = [
  {
    id: "1",
    title: "Morning Yoga in Parco Sempione",
    category: "Yoga",
    instructor: "Sofia Bianchi",
    price: 15,
    schedule: "Tue & Thu, 7:30 AM",
    location: "Parco Sempione, Milano",
    city: "Milano",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "2",
    title: "HIIT Workout at Villa Borghese",
    category: "HIIT",
    instructor: "Marco Rossi",
    price: 18,
    schedule: "Mon, Wed & Fri, 6:00 PM",
    location: "Villa Borghese, Roma",
    city: "Roma",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop",
    spotsLeft: 3,
  },
  {
    id: "3",
    title: "Pilates in Parco delle Cascine",
    category: "Pilates",
    instructor: "Lucia Verdi",
    price: 16,
    schedule: "Sat, 9:00 AM",
    location: "Parco delle Cascine, Firenze",
    city: "Firenze",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "4",
    title: "Bootcamp Training by the Beach",
    category: "Bootcamp",
    instructor: "Giovanni Russo",
    price: 20,
    schedule: "Tue & Sat, 8:00 AM",
    location: "Spiaggia di Mondello, Palermo",
    city: "Palermo",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "5",
    title: "Evening Tai Chi at Parco Valentino",
    category: "Tai Chi",
    instructor: "Elena Conti",
    price: 14,
    schedule: "Mon & Wed, 7:00 PM",
    location: "Parco del Valentino, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "6",
    title: "Functional Training at Giardini Margherita",
    category: "Functional",
    instructor: "Paolo Ferrara",
    price: 17,
    schedule: "Thu & Sun, 6:30 PM",
    location: "Giardini Margherita, Bologna",
    city: "Bologna",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "7",
    title: "Sunrise Running Group",
    category: "Running",
    instructor: "Andrea Monti",
    price: 12,
    schedule: "Daily, 6:00 AM",
    location: "Parco della Pellerina, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "8",
    title: "Sunset Beach Yoga",
    category: "Yoga",
    instructor: "Chiara Esposito",
    price: 18,
    schedule: "Fri & Sun, 7:30 PM",
    location: "Spiaggia di Viareggio, Viareggio",
    city: "Viareggio",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&h=400&fit=crop",
    spotsLeft: null,
  },
  {
    id: "9",
    title: "Outdoor Boxing Class",
    category: "Boxing",
    instructor: "Roberto Leone",
    price: 22,
    schedule: "Tue & Thu, 6:00 PM",
    location: "Parco Dora, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
    spotsLeft: 2,
  },
];

function matchesPrice(price: number, filter: string): boolean {
  switch (filter) {
    case "Under €15":
      return price < 15;
    case "€15-€20":
      return price >= 15 && price <= 20;
    case "Over €20":
      return price > 20;
    default:
      return true;
  }
}

export function ClassesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [city, setCity] = useState("All Cities");
  const [priceFilter, setPriceFilter] = useState("All Prices");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_CLASSES.filter((cls) => {
      if (
        q &&
        !cls.title.toLowerCase().includes(q) &&
        !cls.location.toLowerCase().includes(q) &&
        !cls.instructor.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (category !== "All Categories" && cls.category !== category)
        return false;
      if (city !== "All Cities" && cls.city !== city) return false;
      if (!matchesPrice(cls.price, priceFilter)) return false;
      return true;
    });
  }, [search, category, city, priceFilter]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find Outdoor Classes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover and book the best outdoor fitness classes in beautiful Italian
          cities
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by class name, location, or instructor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRICE_FILTERS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} class{filtered.length !== 1 && "es"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-medium">No classes found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}

function ClassCard({ cls }: { cls: MockClass }) {
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
        {cls.spotsLeft !== null && (
          <Badge
            variant="destructive"
            className="absolute top-3 right-3 bg-red-600 text-white"
          >
            Only {cls.spotsLeft} spots left
          </Badge>
        )}
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
