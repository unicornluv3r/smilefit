import { Link } from "react-router-dom";
import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { InstructorClass } from "@/data/mockInstructor";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "border-green-500 text-green-700 bg-green-50",
  Intermediate: "border-amber-500 text-amber-700 bg-amber-50",
  Advanced: "border-red-500 text-red-700 bg-red-50",
};

function spotsLabel(remaining: number): { text: string; className: string } | null {
  if (remaining <= 3) {
    return {
      text: `${remaining} spot${remaining !== 1 ? "s" : ""} left`,
      className: remaining <= 1 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700",
    };
  }
  return null;
}

export function InstructorClassCard({ cls }: { cls: InstructorClass }) {
  const nextDate = new Date(cls.nextSession).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const spots = spotsLabel(cls.spotsRemaining);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={cls.imageUrl}
          alt={cls.title}
          className="h-44 w-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white">
          {cls.category}
        </Badge>
        {spots && (
          <Badge
            variant="secondary"
            className={`absolute top-3 right-3 ${spots.className}`}
          >
            {spots.text}
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Next: {nextDate}</span>
        </div>
        <CardTitle className="text-base">{cls.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0" />
          <span>{cls.city}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[0.65rem] ${DIFFICULTY_COLORS[cls.difficulty]}`}
          >
            {cls.difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-xs">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {cls.rating} ({cls.reviewCount})
          </span>
        </div>
      </CardContent>
      <div className="mt-auto flex items-center justify-between px-4 pb-4">
        <span className="text-lg font-bold">€{cls.price}</span>
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
