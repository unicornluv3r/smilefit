import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, BadgeCheck, Star, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MOCK_INSTRUCTOR } from "@/data/mockInstructor";
import type { InstructorProfile as MockInstructorProfile } from "@/data/mockInstructor";
import { MOCK_INSTRUCTORS } from "@/data/mockInstructors";
import { InstructorHeader } from "@/components/instructor-profile/InstructorHeader";
import { InstructorClassCard } from "@/components/instructor-profile/InstructorClassCard";
import { InstructorReviewCard } from "@/components/instructor-profile/InstructorReviewCard";
import {
  InstructorSidebar,
  MobileMessageBar,
} from "@/components/instructor-profile/InstructorSidebar";
import { useInstructor } from "@/hooks/useInstructors";
import { useInstructorReviews } from "@/hooks/useReviews";
import { useClasses } from "@/hooks/useClasses";
import type { DbClass } from "@/lib/bookings";

function dbToMockProfile(
  profile: {
    id: string;
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    city: string | null;
    specialties: string[];
    certifications: string[];
    years_experience: number | null;
    instagram_handle: string | null;
    website_url: string | null;
    is_verified_instructor: boolean;
    total_classes_taught: number;
    average_rating: number;
  },
  classes: DbClass[],
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    profiles: { full_name: string | null; avatar_url: string | null };
    classes: { title: string };
  }[],
): MockInstructorProfile {
  return {
    id: profile.id,
    name: profile.display_name ?? profile.full_name ?? "Instructor",
    avatarUrl:
      profile.avatar_url ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name ?? "I")}&background=2563EB&color=fff&size=300`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    tagline: profile.specialties?.slice(0, 3).join(", ") ?? "",
    bio: profile.bio ?? "",
    city: profile.city ?? "",
    languages: [],
    specialties: profile.specialties ?? [],
    certifications: profile.certifications ?? [],
    yearsExperience: profile.years_experience ?? 0,
    rating: Number(profile.average_rating),
    reviewCount: reviews.length,
    totalStudents: profile.total_classes_taught,
    responseRate: "",
    responseTime: "",
    joinedDate: "",
    classes: classes.map((cls) => ({
      id: cls.id,
      title: cls.title,
      category: cls.category,
      city: cls.city,
      price: Number(cls.price),
      currency: "EUR",
      rating: Number(profile.average_rating),
      reviewCount: reviews.filter((r) => r.classes.title === cls.title).length,
      imageUrl: cls.images[0]?.replace("w=1200", "w=600") ?? "",
      difficulty: cls.difficulty,
      spotsRemaining: cls.spots_total,
      nextSession: new Date(Date.now() + 86400000 * 3).toISOString(),
    })),
    reviews: reviews.map((r) => ({
      id: r.id,
      reviewerName: r.profiles.full_name ?? "Anonymous",
      reviewerAvatar:
        r.profiles.avatar_url ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.profiles.full_name ?? "A")}&size=100`,
      rating: r.rating,
      date: r.created_at,
      comment: r.comment ?? "",
      className: r.classes.title,
    })),
    socialLinks: {
      instagram: profile.instagram_handle
        ? `https://instagram.com/${profile.instagram_handle.replace("@", "")}`
        : undefined,
      website: profile.website_url ?? undefined,
    },
  };
}

function buildProfileFromMockOrClasses(
  id: string,
  allClasses: DbClass[],
): MockInstructorProfile | null {
  // Check mock instructors by ID
  const mock = MOCK_INSTRUCTORS.find((m) => m.id === id);
  // Check class-derived instructors
  const classMatch = allClasses.find(
    (c) =>
      c.instructor_id === id ||
      `class-instructor-${c.instructor_name?.toLowerCase().replace(/\s+/g, "-")}` === id,
  );

  const name = mock?.name ?? classMatch?.instructor_name;
  if (!name) return null;

  const matchingClasses = allClasses.filter(
    (c) =>
      c.instructor_name === name ||
      c.instructor_id === id,
  );

  const specialties = mock
    ? mock.specialty.split(" & ")
    : classMatch?.instructor_specialties?.length
      ? classMatch.instructor_specialties
      : matchingClasses.map((c) => c.category).filter((v, i, a) => a.indexOf(v) === i);

  const city = mock?.city ?? classMatch?.city ?? "";

  return {
    id,
    name,
    avatarUrl:
      mock?.avatar ??
      classMatch?.instructor_avatar ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&size=300`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    tagline: specialties.slice(0, 3).join(", "),
    bio: classMatch?.instructor_bio ?? `${name} is an outdoor fitness instructor based in ${city}, specializing in ${specialties.join(", ")}.`,
    city,
    languages: [],
    specialties,
    certifications: [],
    yearsExperience: 0,
    rating: mock?.rating ?? Number(classMatch?.instructor_rating ?? 0),
    reviewCount: mock?.reviewCount ?? 0,
    totalStudents: mock?.reviewCount ?? 0,
    responseRate: "",
    responseTime: "",
    joinedDate: "",
    classes: matchingClasses.map((cls) => ({
      id: cls.id,
      title: cls.title,
      category: cls.category,
      city: cls.city,
      price: Number(cls.price),
      currency: "EUR",
      rating: Number(cls.instructor_rating ?? mock?.rating ?? 0),
      reviewCount: 0,
      imageUrl: cls.images[0]?.replace("w=1200", "w=600") ?? "",
      difficulty: cls.difficulty,
      spotsRemaining: cls.spots_total,
      nextSession: new Date(Date.now() + 86400000 * 3).toISOString(),
    })),
    reviews: [],
    socialLinks: {},
  };
}

export function InstructorProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: dbInstructor, isLoading, error } = useInstructor(id);
  const { data: dbReviews } = useInstructorReviews(id);
  const { data: allClasses } = useClasses();

  const instructorClasses = useMemo(() => {
    if (!allClasses || !id) return [];
    return allClasses.filter((c: DbClass) => c.instructor_id === id);
  }, [allClasses, id]);

  const instructor: MockInstructorProfile = useMemo(() => {
    if (dbInstructor && !error) {
      return dbToMockProfile(
        dbInstructor,
        instructorClasses,
        dbReviews ?? [],
      );
    }
    // Try to build from mock instructors or class-derived data
    if (id) {
      const built = buildProfileFromMockOrClasses(id, allClasses ?? []);
      if (built) return built;
    }
    return MOCK_INSTRUCTOR;
  }, [dbInstructor, error, instructorClasses, dbReviews, id, allClasses]);

  const [showFullBio, setShowFullBio] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  const avgRating =
    instructor.reviews.length > 0
      ? instructor.reviews.reduce((s, r) => s + r.rating, 0) /
        instructor.reviews.length
      : instructor.rating;
  const visibleReviews = showAllReviews
    ? instructor.reviews
    : instructor.reviews.slice(0, 3);

  return (
    <>
      <div className="container mx-auto px-4 pb-24 pt-6 lg:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            {t("instructorProfile.home")}
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/instructors" className="hover:text-foreground">
            {t("instructorProfile.instructors")}
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
              <h2 className="mb-3 text-lg font-semibold">{t("instructorProfile.about")}</h2>
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
                {showFullBio ? t("instructorProfile.showLess") : t("instructorProfile.readMore")}
              </button>
            </section>

            <Separator />

            {/* Specialties & Certifications */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t("instructorProfile.specialties")}</h2>
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

              {instructor.certifications.length > 0 && (
                <>
                  <h3 className="mb-3 mt-6 text-base font-semibold">
                    {t("instructorProfile.certifications")}
                  </h3>
                  <ul className="space-y-2">
                    {instructor.certifications.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-sm"
                      >
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#2563EB]" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <Separator />

            {/* Classes */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                {t("instructorProfile.classesByInstructor", {
                  name: instructor.name.split(" ")[0],
                })}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({t("instructorProfile.classCount", { count: instructor.classes.length })})
                </span>
              </h2>
              {instructor.classes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {instructor.classes.map((cls) => (
                    <InstructorClassCard key={cls.id} cls={cls} />
                  ))}
                </div>
              ) : (
                <p className="py-4 text-sm text-muted-foreground">
                  {t("instructorProfile.noClasses")}
                </p>
              )}
            </section>

            <Separator />

            {/* Reviews */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("instructorProfile.reviews")}</h2>
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({t("instructorProfile.reviewCount", { count: instructor.reviewCount })})
                  </span>
                </div>
              </div>
              {visibleReviews.length > 0 ? (
                <div className="divide-y">
                  {visibleReviews.map((review) => (
                    <InstructorReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="py-4 text-sm text-muted-foreground">
                  {t("instructorProfile.noReviews")}
                </p>
              )}
              {instructor.reviews.length > 3 && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAllReviews((v) => !v)}
                >
                  {showAllReviews
                    ? t("instructorProfile.showFewerReviews")
                    : t("instructorProfile.showAllReviews", { count: instructor.reviews.length })}
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
