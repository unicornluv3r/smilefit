import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  DollarSign,
  Plus,
  Star,
  Users,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useInstructorStats, useInstructorBookings } from "@/hooks/useInstructors";
import { useClasses } from "@/hooks/useClasses";
import { useInstructorReviews } from "@/hooks/useReviews";
import type { DbClass } from "@/lib/bookings";

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
          <Icon className="size-5 text-[#2563EB]" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
  no_show: "bg-red-100 text-red-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InstructorDashboardPage() {
  const { user } = useAuth();
  const instructorId = user?.id;

  const { data: stats, isLoading: statsLoading } =
    useInstructorStats(instructorId);
  const { data: bookings, isLoading: bookingsLoading } =
    useInstructorBookings(instructorId);
  const { data: allClasses } = useClasses();
  const { data: reviews } = useInstructorReviews(instructorId);

  const myClasses = useMemo(() => {
    if (!allClasses || !instructorId) return [];
    return allClasses.filter((c: DbClass) => c.instructor_id === instructorId);
  }, [allClasses, instructorId]);

  const upcomingBookings = useMemo(() => {
    if (!bookings) return [];
    const now = new Date().toISOString();
    return bookings
      .filter(
        (b) =>
          b.status === "confirmed" && b.class_sessions.start_time > now,
      )
      .slice(0, 10);
  }, [bookings]);

  if (statsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-[fade-in-up_0.5s_ease-out]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your classes, bookings, and reviews
          </p>
        </div>
        <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/instructor/classes/new">
            <Plus className="mr-2 size-4" />
            Create Class
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={String(stats?.totalClasses ?? 0)}
        />
        <StatCard
          icon={Users}
          label="Total Bookings"
          value={String(stats?.totalBookings ?? 0)}
        />
        <StatCard
          icon={CalendarDays}
          label="Upcoming Sessions"
          value={String(stats?.upcomingSessions ?? 0)}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`€${(stats?.totalRevenue ?? 0).toFixed(0)}`}
          sublabel={
            stats?.averageRating
              ? `${stats.averageRating.toFixed(1)} avg rating`
              : undefined
          }
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">
            My Classes ({myClasses.length})
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Bookings ({bookings?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Sessions */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-semibold">Upcoming Bookings</h3>
              {upcomingBookings.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No upcoming bookings
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{b.classes.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.profiles.full_name ?? b.profiles.email} &middot;{" "}
                          {b.quantity} guest{b.quantity !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>{formatDate(b.class_sessions.start_time)}</p>
                        <p>{formatTime(b.class_sessions.start_time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Reviews */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 font-semibold">Recent Reviews</h3>
              {!reviews || reviews.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {r.profiles.full_name ?? "Anonymous"}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span className="text-sm">{r.rating}</span>
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {r.comment}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {r.classes.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* My Classes Tab */}
        <TabsContent value="classes" className="mt-6">
          {myClasses.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No classes yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first outdoor fitness class
              </p>
              <Button
                asChild
                className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90"
              >
                <Link to="/instructor/classes/new">
                  <Plus className="mr-2 size-4" />
                  Create Class
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myClasses.map((cls: DbClass) => (
                <div
                  key={cls.id}
                  className="flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20"
                >
                  {cls.images[0] && (
                    <img
                      src={cls.images[0].replace("w=1200", "w=400")}
                      alt={cls.title}
                      className="hidden size-20 rounded-lg object-cover sm:block"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to={`/classes/${cls.id}`}
                          className="font-semibold hover:underline"
                        >
                          {cls.title}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px]">
                            {cls.category}
                          </Badge>
                          <span>{cls.city}</span>
                          <span>€{Number(cls.price).toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/instructor/classes/${cls.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="mt-6">
          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarDays className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bookings will appear here when students enroll in your classes
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Student</th>
                    <th className="pb-3 pr-4 font-medium">Class</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 pr-4 font-medium">Guests</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/20">
                      <td className="py-3 pr-4">
                        {b.profiles.full_name ?? b.profiles.email}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          to={`/classes/${b.classes.id}`}
                          className="hover:underline"
                        >
                          {b.classes.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {formatDate(b.class_sessions.start_time)}
                        </div>
                      </td>
                      <td className="py-3 pr-4">{b.quantity}</td>
                      <td className="py-3 pr-4 font-medium">
                        €{Number(b.total_price).toFixed(2)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${STATUS_STYLES[b.status] ?? ""}`}
                        >
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
          {!reviews || reviews.length === 0 ? (
            <div className="py-16 text-center">
              <Star className="mx-auto mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No reviews yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reviews will appear here after students attend your classes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {r.profiles.avatar_url ? (
                        <img
                          src={r.profiles.avatar_url}
                          alt=""
                          className="size-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {(r.profiles.full_name ?? "A").charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {r.profiles.full_name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.classes.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <>
                      <Separator className="my-3" />
                      <p className="text-sm text-muted-foreground">
                        {r.comment}
                      </p>
                    </>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(r.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
