import { useState, useMemo } from "react";
import {
  Search,
  ClipboardList,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MOCK_DASHBOARD_BOOKINGS, MOCK_DASHBOARD_CLASSES } from "@/data/mockDashboard";
import { STATUS_STYLES } from "./OverviewPage";

type BookingStatus = "all" | "confirmed" | "completed" | "cancelled" | "no_show";
type PerPage = 10 | 25 | 50;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingsManagePage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<PerPage>(10);

  const filtered = useMemo(() => {
    let result = [...MOCK_DASHBOARD_BOOKINGS];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.studentName.toLowerCase().includes(q) ||
          b.confirmationCode.toLowerCase().includes(q),
      );
    }
    if (classFilter !== "all") {
      result = result.filter((b) => b.classId === classFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    result.sort(
      (a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime(),
    );

    return result;
  }, [search, classFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Summary stats
  const summary = useMemo(() => {
    const total = MOCK_DASHBOARD_BOOKINGS.length;
    const confirmed = MOCK_DASHBOARD_BOOKINGS.filter((b) => b.status === "confirmed").length;
    const completed = MOCK_DASHBOARD_BOOKINGS.filter((b) => b.status === "completed").length;
    const cancelled = MOCK_DASHBOARD_BOOKINGS.filter((b) => b.status === "cancelled").length;
    return { total, confirmed, completed, cancelled };
  }, []);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage all your class bookings
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Export feature coming soon!")}
        >
          <Download className="mr-1.5 size-4" /> Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Confirmed" value={summary.confirmed} color="text-blue-600" />
        <SummaryCard label="Completed" value={summary.completed} color="text-green-600" />
        <SummaryCard label="Cancelled" value={summary.cancelled} color="text-gray-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student or code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {MOCK_DASHBOARD_CLASSES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title.length > 30 ? c.title.slice(0, 30) + "..." : c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as BookingStatus); setPage(1); }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {paged.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList className="mx-auto mb-4 size-12 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold">No bookings found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Class</th>
                    <th className="px-4 py-3 font-medium">Session</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Guests</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Booked</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paged.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {b.confirmationCode}
                      </td>
                      <td className="px-4 py-3 font-medium">{b.studentName}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground truncate max-w-[200px]">
                        {b.className}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(b.sessionDate)}{" "}
                        <span className="text-muted-foreground">{b.sessionTime}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">{b.guests}</td>
                      <td className="px-4 py-3 font-medium">€{b.totalPrice.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${STATUS_STYLES[b.status] ?? ""}`}
                        >
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {formatDate(b.bookedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Show</span>
                <Select
                  value={String(perPage)}
                  onValueChange={(v) => { setPerPage(Number(v) as PerPage); setPage(1); }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>of {filtered.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="px-2 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={`text-2xl font-bold ${color ?? ""}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
