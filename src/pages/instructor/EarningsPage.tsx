import { useMemo } from "react";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
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
import { toast } from "sonner";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import {
  MOCK_DASHBOARD_CLASSES,
  MOCK_DASHBOARD_BOOKINGS,
  MOCK_MONTHLY_EARNINGS,
  type MonthlyEarnings,
} from "@/data/mockDashboard";

function EarningCard({
  icon: Icon,
  label,
  value,
  prefix,
}: {
  icon: typeof DollarSign;
  label: string;
  value: number;
  prefix?: string;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10">
          <Icon className="size-5 text-[#2563EB]" />
        </div>
        <p className="mt-3 text-2xl font-bold">
          {prefix ?? ""}
          {Math.round(animated).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export function EarningsPage() {
  const totalEarnings = useMemo(
    () => MOCK_DASHBOARD_CLASSES.reduce((s, c) => s + c.totalRevenue, 0),
    [],
  );

  const thisMonthEarnings = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    return MOCK_DASHBOARD_BOOKINGS.filter(
      (b) =>
        b.status !== "cancelled" &&
        new Date(b.bookedAt).getMonth() === thisMonth,
    ).reduce((s, b) => s + b.totalPrice, 0);
  }, []);

  const avgPerClass = useMemo(() => {
    const active = MOCK_DASHBOARD_CLASSES.filter((c) => c.isActive);
    if (active.length === 0) return 0;
    return Math.round(totalEarnings / active.length);
  }, [totalEarnings]);

  // Per-class breakdown
  const classBreakdown = useMemo(
    () =>
      [...MOCK_DASHBOARD_CLASSES]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .map((c) => ({
          ...c,
          avgPerSession:
            c.totalBookings > 0
              ? Math.round(c.totalRevenue / c.totalBookings)
              : 0,
        })),
    [],
  );

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-sm text-muted-foreground">
          Track your revenue and payouts
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EarningCard
          icon={DollarSign}
          label="Total earnings (all time)"
          value={totalEarnings}
          prefix="€"
        />
        <EarningCard
          icon={TrendingUp}
          label="This month"
          value={Math.round(thisMonthEarnings)}
          prefix="€"
        />
        <EarningCard
          icon={CreditCard}
          label="Pending payouts"
          value={0}
          prefix="€"
        />
        <EarningCard
          icon={BarChart3}
          label="Avg per class"
          value={avgPerClass}
          prefix="€"
        />
      </div>

      {/* Monthly earnings chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Monthly Earnings (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {MOCK_MONTHLY_EARNINGS.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">No data yet</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MOCK_MONTHLY_EARNINGS}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
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
                    const d = payload[0].payload as MonthlyEarnings;
                    return (
                      <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
                        <p className="text-xs text-muted-foreground">{d.month}</p>
                        <p className="text-sm font-semibold">€{d.earnings.toLocaleString()}</p>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="earnings"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Per-class breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Earnings by Class
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Bookings</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Avg/Session</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classBreakdown.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium truncate max-w-[250px]">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.totalBookings}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      €{c.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      €{c.avgPerSession}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stripe Connect section */}
      <Card className="border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <CreditCard className="mb-3 size-10 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold">Connect with Stripe</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Set up Stripe Connect to receive automatic weekly payouts directly to
              your bank account.
            </p>
          </div>

          {/* How payouts work */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-[#2563EB]/10">
                <span className="text-sm font-bold text-[#2563EB]">1</span>
              </div>
              <p className="text-sm font-medium">Students Pay</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Students pay for your classes securely via Stripe
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-[#2563EB]/10">
                <span className="text-sm font-bold text-[#2563EB]">2</span>
              </div>
              <p className="text-sm font-medium">We Process</p>
              <p className="mt-1 text-xs text-muted-foreground">
                SmileFit handles payment processing (10% platform fee)
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-[#2563EB]/10">
                <span className="text-sm font-bold text-[#2563EB]">3</span>
              </div>
              <p className="text-sm font-medium">You Get Paid</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Weekly automatic transfers to your bank account
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
              onClick={() =>
                toast.info("Coming soon — Stripe Connect integration in progress")
              }
            >
              Set Up Payouts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
