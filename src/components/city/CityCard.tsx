import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatDistance } from "@/utils/distance";
import type { City } from "@/data/mockCities";

interface CityCardProps {
  city: City;
  distanceKm?: number;
}

export function CityCard({ city, distanceKm }: CityCardProps) {
  return (
    <Link
      to={`/cities/${city.slug}`}
      className="group relative block overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full">
        <img
          src={city.heroImage}
          alt={`Outdoor fitness in ${city.name}, Italy`}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-xl font-bold text-white">{city.name}</h3>
        <p className="text-sm text-white/80">{city.nameIT}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-white/70">
          <span>{city.classCount} classes</span>
          {distanceKm !== undefined && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {formatDistance(distanceKm)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
