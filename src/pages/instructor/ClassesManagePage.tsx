import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Star,
  BookOpen,
  Copy,
  Pencil,
  EyeOff,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MOCK_DASHBOARD_CLASSES, type DashboardClass } from "@/data/mockDashboard";
import { CATEGORIES } from "@/data/mockClasses";

type SortKey = "newest" | "most_booked" | "highest_rated" | "highest_revenue";
type ViewMode = "grid" | "list";

function ClassCard({ cls, view }: { cls: DashboardClass; view: ViewMode }) {
  if (view === "list") {
    return (
      <div className="group flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20">
        <img
          src={cls.image}
          alt={cls.title}
          className="hidden size-20 rounded-lg object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  to={`/classes/${cls.id}`}
                  className="truncate font-semibold hover:underline"
                >
                  {cls.title}
                </Link>
                {!cls.isActive && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-500 text-[10px]">
                    Inactive
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[10px]">{cls.category}</Badge>
                <span>{cls.city}</span>
                <span>€{cls.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="hidden md:inline">{cls.totalBookings} bookings</span>
              <span className="hidden lg:inline">{cls.upcomingSessions} upcoming</span>
              <span className="hidden lg:inline">€{cls.totalRevenue}</span>
              <span className="flex items-center gap-0.5">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {cls.averageRating}
              </span>
              <ActionMenu classId={cls.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative">
        <img src={cls.image} alt={cls.title} className="h-40 w-full object-cover" />
        {!cls.isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="secondary" className="bg-white/90">Inactive</Badge>
          </div>
        )}
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionMenu classId={cls.id} />
        </div>
        <Badge className="absolute left-2 top-2 bg-white/90 text-foreground text-[10px]">
          {cls.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <Link to={`/classes/${cls.id}`} className="font-semibold hover:underline line-clamp-1">
          {cls.title}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{cls.city} &middot; €{cls.price}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="font-semibold">{cls.totalBookings}</p>
            <p className="text-muted-foreground">Bookings</p>
          </div>
          <div>
            <p className="font-semibold">{cls.upcomingSessions}</p>
            <p className="text-muted-foreground">Upcoming</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{cls.averageRating}</span>
            </div>
            <p className="text-muted-foreground">Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionMenu({ classId }: { classId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="size-8 p-0">
          <span className="sr-only">Actions</span>
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="5" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/instructor/classes/${classId}/edit`}>
            <Pencil className="mr-2 size-4" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Class duplicated")}>
          <Copy className="mr-2 size-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Class deactivated")}>
          <EyeOff className="mr-2 size-4" /> Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ClassesManagePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    let result = [...MOCK_DASHBOARD_CLASSES];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }
    if (category !== "All Categories") {
      result = result.filter((c) => c.category === category);
    }
    if (status === "active") result = result.filter((c) => c.isActive);
    if (status === "inactive") result = result.filter((c) => !c.isActive);

    switch (sortBy) {
      case "most_booked":
        result.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
      case "highest_rated":
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "highest_revenue":
        result.sort((a, b) => b.totalRevenue - a.totalRevenue);
        break;
      default:
        break;
    }

    return result;
  }, [search, category, status, sortBy]);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-sm text-muted-foreground">
            {MOCK_DASHBOARD_CLASSES.length} classes &middot;{" "}
            {MOCK_DASHBOARD_CLASSES.filter((c) => c.isActive).length} active
          </p>
        </div>
        <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/instructor/classes/new">
            <Plus className="mr-1.5 size-4" /> Create Class
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="most_booked">Most Booked</SelectItem>
            <SelectItem value="highest_rated">Highest Rated</SelectItem>
            <SelectItem value="highest_revenue">Highest Revenue</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 rounded-lg border p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md p-1.5 ${view === "grid" ? "bg-muted" : ""}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-md p-1.5 ${view === "list" ? "bg-muted" : ""}`}
            aria-label="List view"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* Class grid/list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No classes found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or create your first class
          </p>
          <Button asChild className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90">
            <Link to="/instructor/classes/new">
              <Plus className="mr-1.5 size-4" /> Create Class
            </Link>
          </Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cls) => (
            <ClassCard key={cls.id} cls={cls} view="list" />
          ))}
        </div>
      )}
    </div>
  );
}
