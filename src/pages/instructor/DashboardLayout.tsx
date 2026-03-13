import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  DollarSign,
  Star,
  Settings,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { to: "/instructor/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/instructor/dashboard/classes", icon: CalendarDays, label: "My Classes", end: false },
  { to: "/instructor/dashboard/bookings", icon: ClipboardList, label: "Bookings", end: false },
  { to: "/instructor/dashboard/students", icon: Users, label: "Students", end: false },
  { to: "/instructor/dashboard/earnings", icon: DollarSign, label: "Earnings", end: false },
  { to: "/instructor/dashboard/reviews", icon: Star, label: "Reviews", end: false },
  { to: "/instructor/dashboard/settings", icon: Settings, label: "Settings", end: false },
] as const;

function SidebarLink({
  to,
  icon: Icon,
  label,
  end,
}: (typeof NAV_ITEMS)[number]) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#2563EB]/10 text-[#2563EB]"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`
      }
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </NavLink>
  );
}

function MobileTabLink({
  to,
  icon: Icon,
  label,
  end,
}: (typeof NAV_ITEMS)[number]) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors ${
          isActive
            ? "text-[#2563EB]"
            : "text-muted-foreground"
        }`
      }
    >
      <Icon className="size-5" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function DashboardLayout() {
  const { profile } = useAuth();
  const initials = (profile?.full_name ?? profile?.email ?? "I")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Desktop sidebar + content */}
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar - hidden on mobile */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r bg-background p-4 md:block lg:w-64">
          {/* Instructor profile */}
          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[#2563EB]/10 text-[#2563EB] text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {profile?.full_name ?? "Instructor"}
                </p>
                <Link
                  to={`/instructors/${profile?.id ?? ""}`}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[#2563EB]"
                >
                  View Profile
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden">
        <div className="grid grid-cols-7 px-1 py-1">
          {NAV_ITEMS.map((item) => (
            <MobileTabLink key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
