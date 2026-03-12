import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ClassDetail } from "@/data/mockClassDetail";

interface InstructorCardProps {
  instructor: ClassDetail["instructor"];
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:p-5">
      <img
        src={instructor.avatarUrl}
        alt={instructor.name}
        className="size-16 shrink-0 rounded-full object-cover sm:size-20"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold">{instructor.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {instructor.rating}
            </span>
            <span>({instructor.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {instructor.specialties.map((s) => (
            <Badge
              key={s}
              variant="secondary"
              className="text-[0.65rem] font-normal"
            >
              {s}
            </Badge>
          ))}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {instructor.bio}
        </p>

        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{instructor.classCount} classes taught</span>
          <Link
            to={`/instructors/${instructor.id}`}
            className="font-medium text-[#2563EB] hover:underline"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
