import { useMemo, useState } from "react";
import { Search, Crosshair } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClassCard } from "@/components/ClassCard";
import {
  MOCK_CLASSES,
  CATEGORIES,
  CITIES,
  PRICE_FILTERS,
} from "@/data/mockClasses";
import type { MockClassData } from "@/data/mockClasses";
import { MOCK_CITIES } from "@/data/mockCities";
import { useClasses } from "@/hooks/useClasses";
import type { DbClass } from "@/lib/bookings";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWishlist } from "@/hooks/useWishlist";
import { sortByDistance, findNearestCity } from "@/utils/distance";

function dbClassToMock(cls: DbClass): MockClassData {
  return {
    id: cls.id,
    title: cls.title,
    category: cls.category,
    instructor: cls.instructor_name ?? "Instructor",
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
  const [nearMeActive, setNearMeActive] = useState(false);

  const geo = useGeolocation();
  const wishlist = useWishlist();
  const { data: dbClasses } = useClasses();

  // Use Supabase data if available, otherwise fall back to mock
  const allClasses: MockClassData[] = useMemo(() => {
    if (dbClasses && dbClasses.length > 0) {
      return dbClasses.map(dbClassToMock);
    }
    return MOCK_CLASSES;
  }, [dbClasses]);

  function handleNearMe() {
    if (geo.latitude !== null && geo.longitude !== null) {
      setNearMeActive((prev) => !prev);
      if (!nearMeActive) {
        const nearest = findNearestCity(
          geo.latitude,
          geo.longitude,
          MOCK_CITIES,
        );
        setCity(nearest.nameIT);
      } else {
        setCity("All Cities");
      }
      return;
    }

    geo.requestPermission();
    const checkInterval = setInterval(() => {
      const cached = sessionStorage.getItem("smilefit_geo");
      if (cached) {
        clearInterval(checkInterval);
        const { latitude, longitude } = JSON.parse(cached) as {
          latitude: number;
          longitude: number;
        };
        const nearest = findNearestCity(latitude, longitude, MOCK_CITIES);
        setCity(nearest.nameIT);
        setNearMeActive(true);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!sessionStorage.getItem("smilefit_geo")) {
        toast.error("Could not get your location. Please try again.");
      }
    }, 15000);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let results = allClasses.filter((cls) => {
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

    if (
      nearMeActive &&
      geo.latitude !== null &&
      geo.longitude !== null
    ) {
      results = sortByDistance(geo.latitude, geo.longitude, results);
    }

    return results;
  }, [search, category, city, priceFilter, nearMeActive, geo.latitude, geo.longitude, allClasses]);

  return (
    <div className="container mx-auto px-4 py-10 animate-[fade-in-up_0.5s_ease-out]">
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

        <Select value={city} onValueChange={(v) => { setCity(v); setNearMeActive(false); }}>
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

        <Button
          variant={nearMeActive ? "default" : "outline"}
          onClick={handleNearMe}
          className={`gap-2 ${nearMeActive ? "bg-[#2563EB] hover:bg-[#2563EB]/90" : ""}`}
        >
          <Crosshair className={`size-4 ${geo.loading ? "animate-pulse" : ""}`} />
          Near Me
        </Button>
      </div>

      {/* Results count */}
      <p className="mb-6 text-sm text-muted-foreground">
        Showing {filtered.length} class{filtered.length !== 1 && "es"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              showWishlist
              wishlisted={wishlist.isWishlisted(cls.id)}
              onToggleWishlist={wishlist.toggle}
              distanceKm={
                "distanceKm" in cls
                  ? (cls as typeof cls & { distanceKm: number }).distanceKm
                  : undefined
              }
            />
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
