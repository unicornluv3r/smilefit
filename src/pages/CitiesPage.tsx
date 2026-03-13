import { useMemo } from "react";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CityCard } from "@/components/city/CityCard";
import { MOCK_CITIES } from "@/data/mockCities";
import { useGeolocation } from "@/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distance";

export function CitiesPage() {
  const geo = useGeolocation();

  const cities = useMemo(() => {
    if (geo.latitude !== null && geo.longitude !== null) {
      return sortByDistance(geo.latitude, geo.longitude, MOCK_CITIES);
    }
    return MOCK_CITIES.map((c) => ({ ...c, distanceKm: undefined }));
  }, [geo.latitude, geo.longitude]);

  return (
    <div className="animate-[fade-in-up_0.5s_ease-out]">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Italian Cities
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find outdoor fitness classes in beautiful cities across Italy
          </p>
        </div>

        {geo.latitude === null && (
          <div className="mb-8 flex justify-center">
            <Button
              variant="outline"
              onClick={geo.requestPermission}
              disabled={geo.loading}
              className="gap-2"
            >
              <Navigation className={`size-4 ${geo.loading ? "animate-pulse" : ""}`} />
              {geo.loading ? "Finding your location..." : "Near Me — sort by distance"}
            </Button>
          </div>
        )}

        {geo.error && (
          <p className="mb-6 text-center text-sm text-destructive">{geo.error}</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              distanceKm={city.distanceKm}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
