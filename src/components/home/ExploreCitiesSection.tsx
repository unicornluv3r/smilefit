import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CityCard } from "@/components/city/CityCard";
import { MOCK_CITIES } from "@/data/mockCities";
import { useInView } from "@/hooks/useInView";

const TOP_CITIES = MOCK_CITIES.slice(0, 4);

export function ExploreCitiesSection() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div
          className={`mb-10 flex items-center justify-between transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-3xl font-bold tracking-tight">
            {t("exploreCities.title")}
          </h2>
          <Button variant="ghost" asChild>
            <Link to="/cities">
              {t("exploreCities.viewAll")} <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile: horizontal scroll with snap. Desktop: grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {TOP_CITIES.map((city, i) => (
            <div
              key={city.id}
              className={`min-w-[75vw] snap-center sm:min-w-0 transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: inView ? `${150 + i * 100}ms` : "0ms",
              }}
            >
              <CityCard city={city} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
