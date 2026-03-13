import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistance } from "@/utils/distance";
import type { MockClassData } from "@/data/mockClasses";

interface ClassCardProps {
  cls: MockClassData;
  showWishlist?: boolean;
  distanceKm?: number;
  wishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export function ClassCard({
  cls,
  showWishlist = false,
  distanceKm,
  wishlisted = false,
  onToggleWishlist,
}: ClassCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        <img
          src={cls.image}
          alt={`${cls.title} — ${cls.category} class in ${cls.city}`}
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white">
          {cls.category}
        </Badge>

        {cls.popular && (
          <Badge className="absolute top-3 left-3 translate-y-7 bg-orange-500 text-white">
            <Flame className="mr-1 size-3" />
            Popular
          </Badge>
        )}

        {cls.spotsLeft !== null && (
          <Badge
            variant="destructive"
            className={`absolute top-3 right-3 text-white ${
              cls.spotsLeft <= 2 ? "bg-red-600" : "bg-amber-500"
            }`}
          >
            {cls.spotsLeft} spot{cls.spotsLeft !== 1 && "s"} left
          </Badge>
        )}

        {showWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist?.(cls.id);
            }}
            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors hover:bg-white"
            aria-label={wishlisted ? `Remove ${cls.title} from wishlist` : `Add ${cls.title} to wishlist`}
          >
            <Heart
              className={`size-4 transition-colors ${
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}

        {distanceKm !== undefined && (
          <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-800 backdrop-blur">
            <MapPin className="mr-1 size-3" />
            {formatDistance(distanceKm)}
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
