import { useState } from "react";
import { Minus, Plus, ShieldCheck, Heart, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ClassDetail } from "@/data/mockClassDetail";

interface BookingCardProps {
  classData: ClassDetail;
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
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingCard({ classData, onBook }: BookingCardProps) {
  const [qty, setQty] = useState(1);
  const total = classData.price * qty;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-md">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">€{classData.price}</span>
        <span className="text-sm text-muted-foreground">/ person</span>
      </div>

      <Badge
        variant="secondary"
        className={`mt-3 h-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${spotsColor(classData.spotsRemaining)}`}
      >
        {classData.spotsRemaining} spot{classData.spotsRemaining !== 1 && "s"}{" "}
        left
      </Badge>

      <Separator className="my-4" />

      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="size-4 text-muted-foreground" />
        <span>{formatSessionDate(classData.schedule.nextSession)}</span>
      </div>

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
            disabled={qty >= classData.spotsRemaining}
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          €{classData.price} × {qty}
        </span>
        <span className="text-base font-bold">€{total}</span>
      </div>

      <Button
        className="mt-5 w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        size="lg"
        disabled={classData.spotsRemaining === 0}
        onClick={() => onBook(qty)}
      >
        Book Now
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
          <span className="text-lg font-bold">€{price}</span>
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
