import {
  MapPin,
  Globe,
  Star,
  GraduationCap,
  CalendarDays,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InstructorProfile } from "@/data/mockInstructor";

interface InstructorHeaderProps {
  instructor: InstructorProfile;
}

export function InstructorHeader({ instructor }: InstructorHeaderProps) {
  return (
    <div>
      {/* Cover image */}
      <div className="relative h-[180px] overflow-hidden rounded-xl sm:h-[250px]">
        <img
          src={instructor.coverImageUrl}
          alt={`${instructor.name} cover`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Avatar + info */}
      <div className="relative px-1">
        <div className="-mt-14 flex flex-col items-start gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-6">
          <img
            src={instructor.avatarUrl}
            alt={instructor.name}
            className="size-24 rounded-full border-4 border-background object-cover shadow-lg sm:size-[120px]"
          />
          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {instructor.name}
            </h1>
            <p className="mt-0.5 text-muted-foreground">{instructor.tagline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {instructor.city}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="size-3.5" />
                {instructor.languages.join(", ")}
              </span>
            </div>
          </div>
          <div className="flex gap-2 sm:pb-1">
            <Button variant="outline">
              <MessageCircle className="mr-2 size-4" />
              Message
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatItem
            icon={<Star className="size-4 fill-amber-400 text-amber-400" />}
            value={String(instructor.rating)}
            label={`${instructor.reviewCount} reviews`}
          />
          <StatItem
            icon={<GraduationCap className="size-4 text-[#2563EB]" />}
            value={instructor.totalStudents.toLocaleString()}
            label="Students"
          />
          <StatItem
            icon={<CalendarDays className="size-4 text-[#2563EB]" />}
            value={`${instructor.yearsExperience} yrs`}
            label="Experience"
          />
          <StatItem
            icon={<MessageCircle className="size-4 text-[#2563EB]" />}
            value={instructor.responseRate}
            label="Response rate"
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border p-3">
      {icon}
      <div>
        <div className="text-sm font-semibold leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
