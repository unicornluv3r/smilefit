import { useState, useMemo } from "react";
import { Search, Users, UserPlus, Repeat, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { MOCK_DASHBOARD_STUDENTS } from "@/data/mockDashboard";

type SortKey = "most_bookings" | "most_spent" | "most_recent";

function InsightCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  suffix?: string;
}) {
  const animated = useAnimatedCounter(value);
  const display = Number.isInteger(value)
    ? Math.round(animated)
    : animated.toFixed(1);

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
          <Icon className="size-5 text-[#2563EB]" />
        </div>
        <div>
          <p className="text-xl font-bold">
            {display}{suffix ?? ""}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentsPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("most_bookings");

  const students = MOCK_DASHBOARD_STUDENTS;

  const totalUnique = students.length;
  const returning = students.filter((s) => s.totalBookings >= 2).length;
  const returningPct = totalUnique > 0 ? Math.round((returning / totalUnique) * 100) : 0;
  const avgBookings = totalUnique > 0
    ? students.reduce((s, st) => s + st.totalBookings, 0) / totalUnique
    : 0;

  // "new this month" = students whose first booking is within last 30 days
  const newThisMonth = students.filter((s) => {
    const last = new Date(s.lastBookingDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return s.totalBookings === 1 && last > thirtyDaysAgo;
  }).length;

  const filtered = useMemo(() => {
    let result = [...students];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case "most_bookings":
        result.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
      case "most_spent":
        result.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case "most_recent":
        result.sort(
          (a, b) =>
            new Date(b.lastBookingDate).getTime() -
            new Date(a.lastBookingDate).getTime(),
        );
        break;
    }

    return result;
  }, [search, sortBy, students]);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm text-muted-foreground">
          Insights about your student community
        </p>
      </div>

      {/* Insight cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <InsightCard icon={Users} label="Total students" value={totalUnique} />
        <InsightCard icon={Repeat} label={`Returning (${returningPct}%)`} value={returning} />
        <InsightCard icon={UserPlus} label="New this month" value={newThisMonth} />
        <InsightCard icon={BarChart3} label="Avg bookings/student" value={avgBookings} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most_bookings">Most Bookings</SelectItem>
            <SelectItem value="most_spent">Most Spent</SelectItem>
            <SelectItem value="most_recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Student table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="mx-auto mb-4 size-12 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold">No students found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Students will appear here when they book your classes
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 font-medium">Bookings</th>
                    <th className="px-4 py-3 font-medium">Spent</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Last Booking</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Favorite Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs bg-[#2563EB]/10 text-[#2563EB]">
                              {s.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                        {s.email}
                      </td>
                      <td className="px-4 py-3 font-medium">{s.totalBookings}</td>
                      <td className="px-4 py-3 font-medium">€{s.totalSpent.toFixed(0)}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {new Date(s.lastBookingDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground truncate max-w-[200px]">
                        {s.favoriteClass}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
