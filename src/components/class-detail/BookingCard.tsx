import { useState } from "react";
import { Minus, Plus, ShieldCheck, Heart, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ClassDetail } from "@/data/mockClassDetail";
import type { DbSession } from "@/lib/bookings";

interface BookingCardProps {
  classData: ClassDetail;
  sessions: DbSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  onBook: (quantity: number) => void;
}

function spotsColor(remaining: number): string {
  if (remaining <= 1) return "bg-red-100 text-red-700";
  if (remaining <= 5) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
}

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingCard({
  classData,
  sessions,
  selectedSessionId,
  onSelectSession,
  onBook,
}: BookingCardProps) {
  const [qty, setQty] = useState(1);

  const activeSession = sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];
  const spotsRemaining = activeSession?.spots_remaining ?? classData.spotsRemaining;
  const soldOut = spotsRemaining === 0;
  const total = Number(classData.price) * qty;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-md">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">€{Number(classData.price)}</span>
        <span className="text-sm text-muted-foreground">/ person</span>
      </div>

      <Badge
        variant="secondary"
        className={`mt-3 h-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${spotsColor(spotsRemaining)}`}
      >
        {soldOut
          ? "Sold out"
          : `${spotsRemaining} spot${spotsRemaining !== 1 ? "s" : ""} left`}
      </Badge>

      <Separator className="my-4" />

      {/* Session picker */}
      {sessions.length > 0 ? (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Select session
          </span>
          <div className="max-h-[120px] space-y-1 overflow-y-auto">
            {sessions.slice(0, 5).map((session) => {
              const isSelected =
                session.id === (selectedSessionId ?? sessions[0]?.id);
              const sessionSoldOut = session.spots_remaining === 0;
              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  disabled={sessionSoldOut}
                  className={`flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "border-[#2563EB] bg-[#2563EB]/5"
                      : "hover:bg-muted/50"
                  } ${sessionSoldOut ? "opacity-50" : ""}`}
                >
                  <span>{formatSessionDate(session.start_time)}</span>
                  <span
                    className={
                      sessionSoldOut ? "text-red-600" : "text-green-600"
                    }
                  >
                    {sessionSoldOut
                      ? "Full"
                      : `${session.spots_remaining} left`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span>
            {formatSessionDate(classData.schedule.nextSession)}
          </span>
        </div>
      )}

      <Separator className="my-4" />

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Guests</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={qty <= 1}
            onClick={() => setQty((q) => q - 1)}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{qty}</span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={qty >= spotsRemaining}
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          €{Number(classData.price)} × {qty}
        </span>
        <span className="text-base font-bold">€{total}</span>
      </div>

      <Button
        className="mt-5 w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        size="lg"
        disabled={soldOut}
        onClick={() => onBook(qty)}
      >
        {soldOut ? "Sold Out" : "Book Now"}
      </Button>

      <Button variant="outline" className="mt-2 w-full" size="lg">
        <Heart className="mr-2 size-4" />
        Add to Wishlist
      </Button>

      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-green-600" />
        <span>Free cancellation up to 24h before</span>
      </div>
    </div>
  );
}

export function MobileBookingBar({
  price,
  onBook,
}: {
  price: number;
  onBook: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-3 lg:hidden">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <span className="text-lg font-bold">€{Number(price)}</span>
          <span className="text-sm text-muted-foreground"> / person</span>
        </div>
        <Button
          className="bg-[#2563EB] px-8 hover:bg-[#2563EB]/90"
          size="lg"
          onClick={onBook}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
