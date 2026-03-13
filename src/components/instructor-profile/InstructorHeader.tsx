import {
  MapPin,
  Globe,
  Star,
  GraduationCap,
  CalendarDays,
  MessageCircle,
  Share2,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { InstructorProfile } from "@/data/mockInstructor";

interface InstructorHeaderProps {
  instructor: InstructorProfile;
}

export function InstructorHeader({ instructor }: InstructorHeaderProps) {
  const initials = instructor.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Profile info — clean white background, no image overlap */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <Avatar className="size-28 shrink-0 border-4 border-background shadow-lg sm:size-32">
          <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
          <AvatarFallback className="bg-[#2563EB]/10 text-[#2563EB] text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {instructor.name}
            </h1>
            {instructor.rating >= 4.5 && (
              <BadgeCheck className="size-6 fill-[#2563EB] text-white shrink-0" />
            )}
          </div>

          <p className="mt-1 text-muted-foreground">{instructor.tagline}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {instructor.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="size-4" />
              {instructor.languages.join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              Joined {instructor.joinedDate}
            </span>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-1.5 size-4" />
              Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied!");
              }}
            >
              <Share2 className="mr-1.5 size-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Star className="size-5 fill-amber-400 text-amber-400" />}
          value={instructor.rating.toFixed(1)}
          label={`${instructor.reviewCount} reviews`}
        />
        <StatCard
          icon={<GraduationCap className="size-5 text-[#2563EB]" />}
          value={instructor.totalStudents.toLocaleString()}
          label="Students trained"
        />
        <StatCard
          icon={<CalendarDays className="size-5 text-[#2563EB]" />}
          value={`${instructor.yearsExperience}+`}
          label="Years experience"
        />
        <StatCard
          icon={<MessageCircle className="size-5 text-[#2563EB]" />}
          value={instructor.responseRate}
          label="Response rate"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon}
        <div>
          <p className="text-lg font-bold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
