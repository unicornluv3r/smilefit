import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BookingStepConfirmationProps {
  confirmationCode: string;
  className: string;
  date: string;
  time: string;
  location: string;
  quantity: number;
  total: number;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BookingStepConfirmation({
  confirmationCode,
  className,
  date,
  time,
  location,
  quantity,
  total,
}: BookingStepConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Animated checkmark */}
      <div className="mb-4 flex size-16 animate-[scale-in_0.4s_ease-out] items-center justify-center rounded-full bg-green-100">
        <svg
          className="size-9 animate-[draw-check_0.5s_ease-out_0.3s_both] text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" className="[stroke-dasharray:24] [stroke-dashoffset:0]" />
        </svg>
      </div>

      <h3 className="text-xl font-bold">Booking Confirmed!</h3>

      <div className="mt-3 rounded-lg bg-muted px-4 py-2">
        <p className="text-xs text-muted-foreground">Confirmation Code</p>
        <p className="font-mono text-lg font-bold tracking-wider">
          {confirmationCode}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="w-full space-y-2 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class</span>
          <span className="font-medium">{className}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formatDate(date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location</span>
          <span className="font-medium">{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Guests</span>
          <span className="font-medium">{quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold">€{total.toFixed(2)}</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        A confirmation email has been sent to your inbox.
      </p>

      <div className="mt-4 flex w-full gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/classes">Back to Classes</Link>
        </Button>
        <Button
          asChild
          className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          <Link to="/dashboard">View My Bookings</Link>
        </Button>
      </div>
    </div>
  );
}
