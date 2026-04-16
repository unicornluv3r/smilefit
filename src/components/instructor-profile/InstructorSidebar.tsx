import { useTranslation } from "react-i18next";
import {
  MessageCircle,
  Clock,
  CalendarDays,
  Link2,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { InstructorProfile } from "@/data/mockInstructor";

interface InstructorSidebarProps {
  instructor: InstructorProfile;
}

export function InstructorSidebar({ instructor }: InstructorSidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border bg-card p-5 shadow-md">
      {(instructor.responseRate ||
        instructor.responseTime ||
        instructor.joinedDate) && (
        <>
          <div className="space-y-3 text-sm">
            {instructor.responseRate && (
              <div className="flex items-center gap-2.5">
                <MessageCircle className="size-4 text-muted-foreground" />
                <span>
                  {t("instructorSidebar.responseRate")}{" "}
                  <span className="font-medium">
                    {instructor.responseRate}
                  </span>
                </span>
              </div>
            )}
            {instructor.responseTime && (
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-muted-foreground" />
                <span>
                  {t("instructorSidebar.responds")}{" "}
                  <span className="font-medium">
                    {instructor.responseTime}
                  </span>
                </span>
              </div>
            )}
            {instructor.joinedDate && (
              <div className="flex items-center gap-2.5">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span>
                  {t("instructorSidebar.joined")}{" "}
                  <span className="font-medium">{instructor.joinedDate}</span>
                </span>
              </div>
            )}
          </div>

          <Separator className="my-4" />
        </>
      )}

      <Button
        className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        size="lg"
      >
        <MessageCircle className="mr-2 size-4" />
        {t("instructorSidebar.message", { name: instructor.name.split(" ")[0] })}
      </Button>

      {instructor.responseTime && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t("instructorSidebar.usuallyResponds", {
            time: instructor.responseTime,
          })}
        </p>
      )}

      {instructor.socialLinks && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm">
              <Link2 className="size-3.5" />
            </Button>
            {instructor.socialLinks.instagram && (
              <Button variant="outline" size="icon-sm" asChild>
                <a
                  href={instructor.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="size-3.5" />
                </a>
              </Button>
            )}
            {instructor.socialLinks.website && (
              <Button variant="outline" size="icon-sm" asChild>
                <a
                  href={instructor.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function MobileMessageBar({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-3 lg:hidden">
      <div className="container mx-auto">
        <Button
          className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
          size="lg"
        >
          <MessageCircle className="mr-2 size-4" />
          {t("instructorSidebar.message", { name })}
        </Button>
      </div>
    </div>
  );
}
