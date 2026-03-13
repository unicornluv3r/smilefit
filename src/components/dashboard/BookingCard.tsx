import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BookingData } from "@/data/mockBookings";

interface DashboardBookingCardProps {
  booking: BookingData;
  isToday: boolean;
  onCancel: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string, duration: number): string {
  const [h, m] = time.split(":").map(Number);
  const endMins = h * 60 + m + duration;
  const endH = Math.floor(endMins / 60) % 24;
  const endM = endMins % 60;
  return `${time} – ${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}

function formatCancelledDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig = {
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
} as const;

export function DashboardBookingCard({
  booking,
  isToday,
  onCancel,
}: DashboardBookingCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const isCancelled = booking.status === "cancelled";
  const status = statusConfig[booking.status];

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-card shadow-sm transition-colors ${
        isCancelled ? "opacity-70" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative h-48 shrink-0 sm:h-auto sm:w-48">
          <img
            src={booking.classImage}
            alt={booking.className}
            className="size-full object-cover"
          />
          <div className="absolute left-2 top-2 flex gap-1.5">
            <Badge
              variant="secondary"
              className={`h-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
            >
              {status.label}
            </Badge>
            {isToday && (
              <Badge
                variant="secondary"
                className="h-auto animate-pulse rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700"
              >
                Today!
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-tight">
                  {booking.className}
                </h3>
                <p className="text-sm text-muted-foreground">
                  with {booking.instructorName}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 text-xs">
                {booking.category}
              </Badge>
            </div>

            <div className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5" />
                <span>{formatDate(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5" />
                <span>
                  {formatTime(booking.time, booking.duration)} (
                  {booking.duration} min)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5" />
                <span>
                  {booking.location}, {booking.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-3.5" />
                <span>
                  {booking.quantity} guest{booking.quantity !== 1 && "s"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {booking.confirmationCode}
              </span>
              <span className="text-sm font-bold">
                €{booking.totalPrice.toFixed(2)}
              </span>
            </div>

            {isCancelled && booking.cancelledAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Cancelled on {formatCancelledDate(booking.cancelledAt)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {booking.status === "confirmed" && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/classes/${booking.classId}`}>View Class</Link>
                </Button>
                <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Cancel Booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your booking for{" "}
                        <span className="font-medium text-foreground">
                          {booking.className}
                        </span>
                        ? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => onCancel(booking.id)}
                      >
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {booking.status === "completed" && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/classes/${booking.classId}`}>View Class</Link>
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Leave a Review
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/classes/${booking.classId}`}>
                    <RotateCcw className="mr-1.5 size-3.5" />
                    Book Again
                  </Link>
                </Button>
              </>
            )}
            {booking.status === "cancelled" && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/classes/${booking.classId}`}>
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Book Again
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
