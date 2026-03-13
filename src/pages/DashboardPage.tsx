import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CalendarCheck, CalendarX } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardBookingCard } from "@/components/dashboard/BookingCard";
import { EmptyState } from "@/components/dashboard/EmptyState";

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DashboardPage() {
  const { user, loading } = useAuth();
  const { bookings, cancelBooking } = useBookings();

  const today = getTodayStr();

  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" && b.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [bookings, today],
  );

  const completed = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            b.status === "completed" ||
            (b.status === "confirmed" && b.date < today),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [bookings, today],
  );

  const cancelled = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "cancelled")
        .sort((a, b) => b.date.localeCompare(a.date)),
    [bookings],
  );

  const handleCancel = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    cancelBooking(id);
    toast.success("Booking cancelled", {
      description: booking
        ? `Your booking for ${booking.className} has been cancelled.`
        : "Your booking has been cancelled.",
    });
  };

  if (!loading && !user) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <CalendarDays className="mb-4 size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Sign in to view your bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Log in to manage your upcoming classes and booking history.
        </p>
        <Button asChild className="mt-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your fitness class bookings
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming bookings"
              subtitle="You don't have any upcoming classes. Browse our catalogue to find your next workout!"
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <DashboardBookingCard
                  key={booking.id}
                  booking={booking}
                  isToday={booking.date === today}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="No completed bookings"
              subtitle="Once you attend a class, it will appear here."
            />
          ) : (
            <div className="space-y-4">
              {completed.map((booking) => (
                <DashboardBookingCard
                  key={booking.id}
                  booking={booking}
                  isToday={false}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelled.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No cancelled bookings"
              subtitle="You haven't cancelled any bookings."
            />
          ) : (
            <div className="space-y-4">
              {cancelled.map((booking) => (
                <DashboardBookingCard
                  key={booking.id}
                  booking={booking}
                  isToday={false}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
