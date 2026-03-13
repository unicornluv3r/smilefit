import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarCheck,
  MapPin,
  Clock,
  Users,
  Loader2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserBookings, useCancelBooking } from "@/hooks/useBookings";
import type { BookingWithDetails } from "@/lib/bookings";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
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

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
  no_show: "bg-red-100 text-red-700",
};

function BookingCardItem({
  booking,
  onCancel,
}: {
  booking: BookingWithDetails;
  onCancel: (id: string) => void;
}) {
  const cls = booking.classes;
  const session = booking.class_sessions;

  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20">
      {/* Thumbnail */}
      {cls.images[0] && (
        <Link to={`/classes/${cls.id}`} className="hidden sm:block">
          <img
            src={cls.images[0].replace("w=1200", "w=400")}
            alt={cls.title}
            className="size-24 rounded-lg object-cover"
          />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
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
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {cls.city}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`shrink-0 text-xs ${STATUS_STYLES[booking.status]}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {formatDate(session.start_time)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatTime(session.start_time)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {booking.quantity} guest{booking.quantity !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold">
            €{Number(booking.total_price).toFixed(2)}
          </span>
          {booking.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onCancel(booking.id)}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBookings({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof CalendarDays;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon className="mb-4 size-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{subtitle}</p>
      <Button
        asChild
        className="mt-4 bg-[#2563EB] hover:bg-[#2563EB]/90"
      >
        <Link to="/classes">
          <Search className="mr-2 size-4" />
          Find Classes
        </Link>
      </Button>
    </div>
  );
}

function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border p-4 animate-pulse">
          <div className="hidden size-24 rounded-lg bg-muted sm:block" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookingsPage() {
  const { data: bookings, isLoading } = useUserBookings();
  const cancelMutation = useCancelBooking();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const now = new Date().toISOString();

  const upcoming = useMemo(
    () =>
      (bookings ?? [])
        .filter(
          (b) =>
            b.status === "confirmed" &&
            b.class_sessions.start_time > now,
        )
        .sort((a, b) =>
          a.class_sessions.start_time.localeCompare(
            b.class_sessions.start_time,
          ),
        ),
    [bookings, now],
  );

  const past = useMemo(
    () =>
      (bookings ?? [])
        .filter(
          (b) =>
            b.status !== "confirmed" ||
            b.class_sessions.start_time <= now,
        )
        .sort((a, b) =>
          b.class_sessions.start_time.localeCompare(
            a.class_sessions.start_time,
          ),
        ),
    [bookings, now],
  );

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    await cancelMutation.mutateAsync({
      bookingId: cancelTarget,
      reason: cancelReason || undefined,
    });
    setCancelTarget(null);
    setCancelReason("");
  };

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
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <BookingsSkeleton />
          ) : upcoming.length === 0 ? (
            <EmptyBookings
              icon={CalendarDays}
              title="No upcoming bookings"
              subtitle="You don't have any upcoming classes. Browse our catalogue to find your next workout!"
            />
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <BookingCardItem
                  key={booking.id}
                  booking={booking}
                  onCancel={setCancelTarget}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {isLoading ? (
            <BookingsSkeleton />
          ) : past.length === 0 ? (
            <EmptyBookings
              icon={CalendarCheck}
              title="No past bookings"
              subtitle="You haven't attended any classes yet. Book your first class today!"
            />
          ) : (
            <div className="space-y-4">
              {past.map((booking) => (
                <BookingCardItem
                  key={booking.id}
                  booking={booking}
                  onCancel={setCancelTarget}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel confirmation dialog */}
      <AlertDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelTarget(null);
            setCancelReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? Check the
              cancellation policy — cancellations within 24 hours may be
              charged.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Separator />

          <div className="space-y-2">
            <label
              htmlFor="cancel-reason"
              className="text-sm font-medium"
            >
              Reason (optional)
            </label>
            <Textarea
              id="cancel-reason"
              placeholder="Why are you cancelling?"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={2}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => void handleConfirmCancel()}
            >
              {cancelMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
