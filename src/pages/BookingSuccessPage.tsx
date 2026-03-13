import { useSearchParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  CalendarPlus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isStripeTestMode } from "@/lib/stripe";

function generateIcsContent(
  title: string,
  date: string,
  location: string,
): string {
  const start = new Date(date);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SmileFit//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "DESCRIPTION:Booked via SmileFit",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(title: string, date: string, location: string) {
  const content = generateIcsContent(title, date, location);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smilefit-booking.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function BookingSuccessPage() {
  const [params] = useSearchParams();
  const bookingId = params.get("booking_id");
  const className = params.get("class_name") ?? "Your Class";
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const location = params.get("location") ?? "";
  const quantity = params.get("quantity") ?? "1";
  const total = params.get("total") ?? "0";
  const code = params.get("code") ?? bookingId?.slice(0, 8).toUpperCase() ?? "";

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12 animate-[fade-in-up_0.5s_ease-out]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          {/* Test mode badge */}
          {isStripeTestMode && (
            <div className="mb-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Test Mode — No real charges
            </div>
          )}

          {/* Success icon */}
          <div className="mb-4 flex size-16 animate-[scale-in_0.4s_ease-out] items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-9 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your spot has been reserved. See you there!
          </p>

          {code && (
            <div className="mt-4 rounded-lg bg-muted px-4 py-2">
              <p className="text-xs text-muted-foreground">Confirmation Code</p>
              <p className="font-mono text-lg font-bold tracking-wider">
                {code}
              </p>
            </div>
          )}

          <Separator className="my-4" />

          {/* Booking details */}
          <div className="w-full space-y-2 text-left text-sm">
            {className !== "Your Class" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium">{className}</span>
              </div>
            )}
            {date && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            )}
            {time && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{time}</span>
              </div>
            )}
            {location && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{location}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{quantity}</span>
            </div>
            {Number(total) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-bold">€{Number(total).toFixed(2)}</span>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            A confirmation email has been sent to your inbox.
          </p>

          {/* Actions */}
          <div className="mt-5 flex w-full flex-col gap-2">
            {date && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => downloadIcs(className, date, location)}
              >
                <CalendarPlus className="mr-1.5 size-4" />
                Add to Calendar
              </Button>
            )}
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/classes">
                  Browse Classes
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]/90"
              >
                <Link to="/bookings">
                  My Bookings <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
