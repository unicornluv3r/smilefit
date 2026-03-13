import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CityCard } from "@/components/city/CityCard";
import { MOCK_CITIES } from "@/data/mockCities";
import { useInView } from "@/hooks/useInView";

const TOP_CITIES = MOCK_CITIES.slice(0, 4);

export function ExploreCitiesSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div
        className={`container mx-auto px-4 ${
          inView ? "animate-[fade-in-up_0.5s_ease-out]" : "opacity-0"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Explore by City
          </h2>
          <Button variant="ghost" asChild>
            <Link to="/cities">
              View all cities <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOP_CITIES.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
