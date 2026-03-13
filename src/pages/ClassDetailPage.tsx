import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  Droplets,
  Sun,
  Footprints,
  Shirt,
  Sparkles,
  Backpack,
  Users,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useClassById, useClassSessions } from "@/hooks/useClasses";
import { useAuth } from "@/context/AuthContext";
import { MOCK_CLASS_DETAIL } from "@/data/mockClassDetail";
import type { ClassDetail } from "@/data/mockClassDetail";
import type { DbClass, DbSession } from "@/lib/bookings";
import { ImageGallery } from "@/components/class-detail/ImageGallery";
import { InstructorCard } from "@/components/class-detail/InstructorCard";
import { ReviewCard, AverageRating } from "@/components/class-detail/ReviewCard";
import { BookingCard, MobileBookingBar } from "@/components/class-detail/BookingCard";
import { BookingDialog } from "@/components/class-detail/BookingDialog";

const BRING_ICONS: Record<string, typeof Droplets> = {
  "Water bottle": Droplets,
  Sunscreen: Sun,
  "Sneakers or barefoot shoes": Footprints,
  "Comfortable clothing": Shirt,
  "Yoga mat": Sparkles,
  "Light towel": Backpack,
  "Light layers": Shirt,
  Towel: Backpack,
  "Running shoes": Footprints,
  "Sand-appropriate shoes": Footprints,
  "Light jacket": Shirt,
  "Pilates mat": Sparkles,
  "Meditation cushion (optional)": Sparkles,
  Blanket: Backpack,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "border-green-500 text-green-700 bg-green-50",
  Intermediate: "border-amber-500 text-amber-700 bg-amber-50",
  Advanced: "border-red-500 text-red-700 bg-red-50",
};

function mapDbToClassDetail(
  dbClass: DbClass,
  sessions: DbSession[],
): ClassDetail {
  const nextSession = sessions[0];
  const spotsRemaining = nextSession?.spots_remaining ?? dbClass.spots_total;

  return {
    id: dbClass.id,
    title: dbClass.title,
    description: dbClass.description ?? "",
    instructor: dbClass.instructor_name
      ? {
          id: dbClass.instructor_id ?? "",
          name: dbClass.instructor_name,
          bio: dbClass.instructor_bio ?? "",
          avatarUrl: dbClass.instructor_avatar ?? "",
          rating: Number(dbClass.instructor_rating ?? 4.8),
          reviewCount: 0,
          classCount: 0,
          specialties: dbClass.instructor_specialties ?? [],
        }
      : MOCK_CLASS_DETAIL.instructor,
    category: dbClass.category,
    city: dbClass.city,
    location: {
      name: dbClass.address?.split(",")[0] ?? dbClass.city,
      address: dbClass.address ?? dbClass.city,
      lat: dbClass.latitude ?? 0,
      lng: dbClass.longitude ?? 0,
    },
    price: Number(dbClass.price),
    currency: dbClass.currency,
    spotsTotal: dbClass.spots_total,
    spotsRemaining: spotsRemaining,
    duration: dbClass.duration_minutes,
    difficulty: dbClass.difficulty,
    images: dbClass.images.length > 0
      ? dbClass.images
      : ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200"],
    schedule: {
      nextSession: nextSession?.start_time ?? new Date().toISOString(),
      recurring: dbClass.recurring_schedule ?? "",
    },
    tags: dbClass.tags,
    whatToBring: dbClass.what_to_bring,
    cancellationPolicy:
      dbClass.cancellation_policy ?? "Free cancellation up to 24 hours before.",
    reviews: MOCK_CLASS_DETAIL.reviews, // Keep mock reviews for now
  };
}

function ClassDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 pb-12 pt-6 animate-pulse">
      <div className="mb-6 h-4 w-48 rounded bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <div className="aspect-[16/10] rounded-xl bg-muted" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-6 w-16 rounded-full bg-muted" />
              ))}
            </div>
          </div>
          <div className="h-px bg-muted" />
          <div className="flex gap-4">
            <div className="size-16 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
          <div className="h-px bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-80 rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: dbClass,
    isLoading: classLoading,
    error: classError,
    refetch: refetchClass,
  } = useClassById(id);

  const { data: sessions = [] } = useClassSessions(id);

  const [showFullDesc, setShowFullDesc] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQty, setDialogQty] = useState(1);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  if (classLoading) return <ClassDetailSkeleton />;

  // Fall back to mock if Supabase fetch fails
  const cls: ClassDetail = dbClass
    ? mapDbToClassDetail(dbClass, sessions)
    : MOCK_CLASS_DETAIL;

  const usingSupabase = !!dbClass;
  const selectedSession = sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];

  if (classError && !dbClass) {
    // Check if it's the mock ID "1"
    if (id === "1" || id === MOCK_CLASS_DETAIL.id) {
      // Use mock data - fall through
    } else {
      return (
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <AlertCircle className="mb-4 size-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Failed to load class</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong. Please try again.
          </p>
          <Button
            className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90"
            onClick={() => void refetchClass()}
          >
            Try Again
          </Button>
        </div>
      );
    }
  }

  const avgRating =
    cls.reviews.reduce((sum, r) => sum + r.rating, 0) / cls.reviews.length;

  const handleBook = (qty: number) => {
    if (!user) {
      navigate(`/login?returnUrl=/classes/${id}`);
      return;
    }
    setDialogQty(qty);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 pb-28 pt-6 lg:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/classes" className="hover:text-foreground">
            Find Classes
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{cls.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* ── Left column ── */}
          <div className="min-w-0 space-y-10">
            <ImageGallery images={cls.images} alt={cls.title} />

            {/* Title block */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {cls.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <Badge
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB]"
                >
                  {cls.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={DIFFICULTY_COLORS[cls.difficulty]}
                >
                  {cls.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {cls.city}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" />
                  {cls.duration} min
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">
                    {avgRating.toFixed(1)}
                  </span>
                  ({cls.reviews.length})
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {cls.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <Users className="size-4 text-muted-foreground" />
                <span
                  className={`font-medium ${
                    cls.spotsRemaining <= 2
                      ? "text-red-600"
                      : cls.spotsRemaining <= 5
                        ? "text-amber-600"
                        : "text-green-600"
                  }`}
                >
                  {cls.spotsRemaining} spot{cls.spotsRemaining !== 1 && "s"}{" "}
                  remaining
                </span>
                <span className="text-muted-foreground">
                  out of {cls.spotsTotal}
                </span>
              </div>
            </div>

            <Separator />

            {/* Instructor */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Your Instructor</h2>
              <InstructorCard instructor={cls.instructor} />
            </section>

            <Separator />

            {/* About */}
            <section>
              <h2 className="mb-3 text-lg font-semibold">About This Class</h2>
              <div
                className={`relative text-sm leading-relaxed text-muted-foreground ${
                  !showFullDesc ? "max-h-[6.5rem] overflow-hidden" : ""
                }`}
              >
                {cls.description.split("\n").map((p, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {p}
                  </p>
                ))}
                {!showFullDesc && (
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
                )}
              </div>
              <button
                onClick={() => setShowFullDesc((v) => !v)}
                className="mt-2 text-sm font-medium text-[#2563EB] hover:underline"
              >
                {showFullDesc ? "Show less" : "Read more"}
              </button>
            </section>

            <Separator />

            {/* Schedule & Availability */}
            <section>
              <h2 className="mb-3 text-lg font-semibold">
                Schedule &amp; Availability
              </h2>
              {usingSupabase && sessions.length > 0 ? (
                <div className="space-y-2">
                  {sessions.slice(0, 6).map((session) => {
                    const d = new Date(session.start_time);
                    const formatted = d.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isSelected = session.id === (selectedSessionId ?? sessions[0]?.id);
                    const soldOut = session.spots_remaining === 0;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        disabled={soldOut}
                        className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]/5"
                            : "hover:bg-muted/50"
                        } ${soldOut ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays className="size-4 text-[#2563EB]" />
                          <span>{formatted}</span>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            soldOut
                              ? "text-red-600"
                              : session.spots_remaining <= 3
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          {soldOut
                            ? "Sold out"
                            : `${session.spots_remaining} spots`}
                        </span>
                      </button>
                    );
                  })}
                  {sessions.length > 6 && (
                    <p className="text-center text-xs text-muted-foreground">
                      +{sessions.length - 6} more sessions
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-[#2563EB]" />
                    <span>
                      <span className="font-medium">Next session: </span>
                      {new Date(cls.schedule.nextSession).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="size-4 text-[#2563EB]" />
                    <span>{cls.schedule.recurring}</span>
                  </div>
                </div>
              )}
            </section>

            <Separator />

            {/* Location */}
            <section>
              <h2 className="mb-3 text-lg font-semibold">Location</h2>
              <p className="text-sm font-medium">{cls.location.name}</p>
              <p className="text-sm text-muted-foreground">
                {cls.location.address}
              </p>
              <div className="mt-3 flex h-[200px] items-center justify-center rounded-xl bg-muted">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <MapPin className="size-8" />
                  <span className="text-sm">Interactive map coming soon</span>
                </div>
              </div>
            </section>

            <Separator />

            {/* What to Bring */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">What to Bring</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {cls.whatToBring.map((item) => {
                  const Icon = BRING_ICONS[item] ?? Sparkles;
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-lg border p-3 text-sm"
                    >
                      <Icon className="size-4 shrink-0 text-[#2563EB]" />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <Separator />

            {/* Cancellation Policy */}
            <section>
              <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-green-600" />
                <div>
                  <h3 className="text-sm font-semibold">Cancellation Policy</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {cls.cancellationPolicy}
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Reviews */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <AverageRating
                  rating={Number(avgRating.toFixed(1))}
                  count={cls.reviews.length}
                />
              </div>
              <div className="divide-y">
                {cls.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                See all reviews
              </Button>
            </section>
          </div>

          {/* ── Right column — sticky booking card (desktop) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BookingCard
                classData={cls}
                sessions={usingSupabase ? sessions : []}
                selectedSessionId={selectedSession?.id ?? null}
                onSelectSession={setSelectedSessionId}
                onBook={handleBook}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MobileBookingBar price={cls.price} onBook={() => handleBook(1)} />

      {/* Booking dialog */}
      <BookingDialog
        classData={cls}
        sessions={usingSupabase ? sessions : []}
        selectedSessionId={selectedSession?.id ?? null}
        onSelectSession={setSelectedSessionId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialQty={dialogQty}
      />
    </>
  );
}
