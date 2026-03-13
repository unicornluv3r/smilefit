import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Users,
  CalendarDays,
  Star,
  Plus,
  Calendar,
  Share2,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  ArrowRight,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import {
  MOCK_DASHBOARD_BOOKINGS,
  MOCK_DASHBOARD_CLASSES,
  MOCK_DASHBOARD_REVIEWS,
  MOCK_DAILY_REVENUE_7D,
  MOCK_DAILY_REVENUE_30D,
  MOCK_DAILY_REVENUE_90D,
  MOCK_DAILY_REVENUE_365D,
  MOCK_DAILY_BOOKINGS_7D,
  MOCK_DAILY_BOOKINGS_30D,
  MOCK_DAILY_BOOKINGS_90D,
  MOCK_DAILY_BOOKINGS_365D,
  MOCK_NEXT_SESSION,
  type DailyRevenue,
  type DailyBookings,
} from "@/data/mockDashboard";

// ─── Animated stat card ──────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  changePercent,
}: {
  icon: typeof DollarSign;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  changePercent?: number;
}) {
  const animated = useAnimatedCounter(value);
  const isInteger = Number.isInteger(value);
  const display = isInteger
    ? `${prefix ?? ""}${Math.round(animated).toLocaleString()}${suffix ?? ""}`
    : `${prefix ?? ""}${animated.toFixed(1)}${suffix ?? ""}`;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
            <Icon className="size-5 text-[#2563EB]" />
          </div>
          {changePercent !== undefined && (
            <div
              className={`flex items-center gap-0.5 text-xs font-medium ${
                changePercent >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {changePercent >= 0 ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {Math.abs(changePercent)}%
            </div>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{display}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

// ─── Next session card ───────────────────────────────────────────────

function NextSessionCard() {
  const session = MOCK_NEXT_SESSION;
  const startTime = new Date(session.startTime);
  const now = new Date();
  const diffMs = startTime.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffMinutes = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
  const fillPct = (session.bookedStudents / session.capacity) * 100;

  if (diffMs <= 0 || diffMs > 24 * 60 * 60 * 1000) return null;

  return (
    <Card className="border-[#2563EB]/30 bg-[#2563EB]/5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
              Next Session
            </p>
            <h3 className="mt-1 text-lg font-semibold truncate">
              {session.className}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {startTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {session.location}
              </span>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {session.bookedStudents} / {session.capacity} students
                </span>
                <span className="font-medium text-[#2563EB] animate-pulse">
                  In {diffHours > 0 ? `${diffHours}h ` : ""}{diffMinutes}m
                </span>
              </div>
              <Progress value={fillPct} className="h-2" />
            </div>
          </div>
          <Button size="sm" asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90 shrink-0">
            <Link to={`/classes/${session.classId}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Chart time range selector ───────────────────────────────────────

const TIME_RANGES = ["7D", "30D", "3M", "12M"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

function TimeRangeSelector({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border bg-muted/50 p-0.5">
      {TIME_RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            value === r
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge colors ─────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
  no_show: "bg-red-100 text-red-700",
};

// ─── Revenue chart data mapping ──────────────────────────────────────

function getRevenueData(range: TimeRange): DailyRevenue[] {
  switch (range) {
    case "7D": return MOCK_DAILY_REVENUE_7D;
    case "30D": return MOCK_DAILY_REVENUE_30D;
    case "3M": return MOCK_DAILY_REVENUE_90D;
    case "12M": return MOCK_DAILY_REVENUE_365D;
  }
}

function getBookingsData(range: TimeRange): DailyBookings[] {
  switch (range) {
    case "7D": return MOCK_DAILY_BOOKINGS_7D;
    case "30D": return MOCK_DAILY_BOOKINGS_30D;
    case "3M": return MOCK_DAILY_BOOKINGS_90D;
    case "12M": return MOCK_DAILY_BOOKINGS_365D;
  }
}

function formatChartDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Main overview page ──────────────────────────────────────────────

export function OverviewPage() {
  const { profile } = useAuth();
  const [revenueRange, setRevenueRange] = useState<TimeRange>("30D");
  const [bookingsRange, setBookingsRange] = useState<TimeRange>("30D");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const firstName = (profile?.full_name ?? "Instructor").split(" ")[0];

  // Compute stats from mock data
  const thisMonthRevenue = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    return MOCK_DASHBOARD_BOOKINGS.filter(
      (b) =>
        b.status !== "cancelled" &&
        new Date(b.bookedAt).getMonth() === thisMonth,
    ).reduce((sum, b) => sum + b.totalPrice, 0);
  }, []);

  const activeStudents = useMemo(() => {
    const names = new Set(
      MOCK_DASHBOARD_BOOKINGS.filter(
        (b) => b.status !== "cancelled",
      ).map((b) => b.studentEmail),
    );
    return names.size;
  }, []);

  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return MOCK_DASHBOARD_BOOKINGS.filter(
      (b) => b.status === "confirmed" && new Date(b.sessionDate) > now,
    ).length;
  }, []);

  const avgRating = useMemo(() => {
    if (MOCK_DASHBOARD_REVIEWS.length === 0) return 0;
    return (
      MOCK_DASHBOARD_REVIEWS.reduce((s, r) => s + r.rating, 0) /
      MOCK_DASHBOARD_REVIEWS.length
    );
  }, []);

  // Popular classes
  const popularClasses = useMemo(
    () =>
      [...MOCK_DASHBOARD_CLASSES]
        .sort((a, b) => b.totalBookings - a.totalBookings)
        .slice(0, 5),
    [],
  );
  const maxBookings = popularClasses[0]?.totalBookings ?? 1;

  // Recent bookings
  const recentBookings = useMemo(
    () =>
      [...MOCK_DASHBOARD_BOOKINGS]
        .sort(
          (a, b) =>
            new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime(),
        )
        .slice(0, 8),
    [],
  );

  // Recent reviews
  const recentReviews = useMemo(
    () =>
      [...MOCK_DASHBOARD_REVIEWS]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3),
    [],
  );

  const revenueData = getRevenueData(revenueRange);
  const bookingsData = getBookingsData(bookingsRange);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Link to="/instructor/classes/new">
              <Plus className="mr-1.5 size-4" />
              Create Class
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/instructor/dashboard/classes">
              <Calendar className="mr-1.5 size-4" />
              View Schedule
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              void navigator.clipboard.writeText(
                `${window.location.origin}/instructors/${profile?.id ?? ""}`,
              );
            }}
          >
            <Share2 className="mr-1.5 size-4" />
            Share Profile
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Revenue this month"
          value={Math.round(thisMonthRevenue)}
          prefix="€"
          changePercent={12}
        />
        <StatCard
          icon={Users}
          label="Active students"
          value={activeStudents}
          changePercent={8}
        />
        <StatCard
          icon={CalendarDays}
          label="Upcoming sessions"
          value={upcomingSessions}
        />
        <StatCard
          icon={Star}
          label={`${MOCK_DASHBOARD_REVIEWS.length} reviews`}
          value={avgRating}
          suffix=" avg"
        />
      </div>

      {/* Next session */}
      <NextSessionCard />

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Revenue</CardTitle>
            <TimeRangeSelector value={revenueRange} onChange={setRevenueRange} />
          </CardHeader>
          <CardContent className="pt-0">
            {revenueData.length === 0 ? (
              <EmptyChart label="No revenue data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `€${v}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload as DailyRevenue;
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                          <p className="text-xs text-muted-foreground">
                            {formatChartDate(d.date)}
                          </p>
                          <p className="text-sm font-semibold">
                            €{d.revenue.toFixed(2)}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bookings chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Bookings</CardTitle>
            <TimeRangeSelector value={bookingsRange} onChange={setBookingsRange} />
          </CardHeader>
          <CardContent className="pt-0">
            {bookingsData.length === 0 ? (
              <EmptyChart label="No booking data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={bookingsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as DailyBookings;
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                          <p className="mb-1 text-xs text-muted-foreground">
                            {formatChartDate(d.date)}
                          </p>
                          <p className="text-xs">
                            <span className="inline-block size-2 rounded-full bg-[#2563EB] mr-1" />
                            Confirmed: {d.confirmed}
                          </p>
                          <p className="text-xs">
                            <span className="inline-block size-2 rounded-full bg-green-500 mr-1" />
                            Completed: {d.completed}
                          </p>
                          <p className="text-xs">
                            <span className="inline-block size-2 rounded-full bg-gray-400 mr-1" />
                            Cancelled: {d.cancelled}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="confirmed" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} animationDuration={800} />
                  <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} animationDuration={800} />
                  <Bar dataKey="cancelled" stackId="a" fill="#9ca3af" radius={[4, 4, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: bookings table + sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instructor/dashboard/bookings">
                View All <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {recentBookings.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No bookings yet"
                description="Bookings will appear here when students enroll"
              />
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Student</th>
                      <th className="pb-2 pr-3 font-medium hidden sm:table-cell">Class</th>
                      <th className="pb-2 pr-3 font-medium">Date</th>
                      <th className="pb-2 pr-3 font-medium hidden md:table-cell">Guests</th>
                      <th className="pb-2 pr-3 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 pr-3 font-medium">{b.studentName}</td>
                        <td className="py-2.5 pr-3 hidden sm:table-cell text-muted-foreground truncate max-w-[200px]">
                          {b.className}
                        </td>
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted-foreground">
                          {new Date(b.sessionDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="py-2.5 pr-3 hidden md:table-cell text-muted-foreground">
                          {b.guests}
                        </td>
                        <td className="py-2.5 pr-3 font-medium">
                          €{b.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${STATUS_STYLES[b.status] ?? ""}`}
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
          </CardContent>
        </Card>

        {/* Right sidebar: popular classes + reviews */}
        <div className="space-y-6">
          {/* Popular classes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Popular Classes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {popularClasses.map((cls, i) => (
                <div key={cls.id} className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{cls.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
                          style={{
                            width: `${(cls.totalBookings / maxBookings) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {cls.totalBookings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Reviews</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/instructor/dashboard/reviews">
                  All <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {recentReviews.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No reviews yet
                </p>
              ) : (
                recentReviews.map((r) => (
                  <div key={r.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.studentName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`size-3 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {r.comment}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {r.className}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Shared empty states ─────────────────────────────────────────────

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center">
      <div className="text-center">
        <BarChart3 className="mx-auto size-8 text-muted-foreground/40" />
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof DollarSign;
  title: string;
  description: string;
}) {
  return (
    <div className="py-8 text-center">
      <Icon className="mx-auto mb-3 size-10 text-muted-foreground/40" />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Re-export for use in other pages
export { EmptyState, EmptyChart, STATUS_STYLES };
