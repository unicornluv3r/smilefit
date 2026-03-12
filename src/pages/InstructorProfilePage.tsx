import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, BadgeCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MOCK_INSTRUCTOR } from "@/data/mockInstructor";
import { InstructorHeader } from "@/components/instructor-profile/InstructorHeader";
import { InstructorClassCard } from "@/components/instructor-profile/InstructorClassCard";
import { InstructorReviewCard } from "@/components/instructor-profile/InstructorReviewCard";
import {
  InstructorSidebar,
  MobileMessageBar,
} from "@/components/instructor-profile/InstructorSidebar";

export function InstructorProfilePage() {
  const instructor = MOCK_INSTRUCTOR;
  const [showFullBio, setShowFullBio] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const avgRating =
    instructor.reviews.reduce((s, r) => s + r.rating, 0) /
    instructor.reviews.length;
  const visibleReviews = showAllReviews
    ? instructor.reviews
    : instructor.reviews.slice(0, 3);

  return (
    <>
      <div className="container mx-auto px-4 pb-24 pt-6 lg:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/instructors" className="hover:text-foreground">
            Instructors
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{instructor.name}</span>
        </nav>

        {/* Header with cover + avatar + stats */}
        <InstructorHeader instructor={instructor} />

        {/* Main content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="min-w-0 space-y-10">
            {/* About */}
            <section>
              <h2 className="mb-3 text-lg font-semibold">About</h2>
              <div
                className={`relative text-sm leading-relaxed text-muted-foreground ${
                  !showFullBio ? "max-h-[7.5rem] overflow-hidden" : ""
                }`}
              >
                {instructor.bio.split("\n").map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {p}
                  </p>
                ))}
                {!showFullBio && (
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
                )}
              </div>
              <button
                onClick={() => setShowFullBio((v) => !v)}
                className="mt-2 text-sm font-medium text-[#2563EB] hover:underline"
              >
                {showFullBio ? "Show less" : "Read more"}
              </button>
            </section>

            <Separator />

            {/* Specialties & Certifications */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="bg-[#2563EB]/10 text-[#2563EB]"
                  >
                    {s}
                  </Badge>
                ))}
              </div>

              <h3 className="mb-3 mt-6 text-base font-semibold">
                Certifications
              </h3>
              <ul className="space-y-2">
                {instructor.certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#2563EB]" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Classes */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                Classes by {instructor.name.split(" ")[0]}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({instructor.classes.length} class
                  {instructor.classes.length !== 1 && "es"})
                </span>
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {instructor.classes.map((cls) => (
                  <InstructorClassCard key={cls.id} cls={cls} />
                ))}
              </div>
            </section>

            <Separator />

            {/* Reviews */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({instructor.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="divide-y">
                {visibleReviews.map((review) => (
                  <InstructorReviewCard key={review.id} review={review} />
                ))}
              </div>
              {instructor.reviews.length > 3 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAllReviews((v) => !v)}
                >
                  {showAllReviews
                    ? "Show fewer reviews"
                    : `Show all ${instructor.reviews.length} reviews`}
                </Button>
              )}
            </section>
          </div>

          {/* Right column — sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <InstructorSidebar instructor={instructor} />
            </div>
          </aside>
        </div>

        {/* Sidebar content for mobile (below main content) */}
        <div className="mt-10 lg:hidden">
          <InstructorSidebar instructor={instructor} />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MobileMessageBar name={instructor.name.split(" ")[0]} />
    </>
  );
}
