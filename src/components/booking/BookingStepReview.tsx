import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ClassDetail } from "@/data/mockClassDetail";

interface BookingStepReviewProps {
  classData: ClassDetail;
  qty: number;
  onQtyChange: (qty: number) => void;
  onContinue: () => void;
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

export function BookingStepReview({
  classData,
  qty,
  onQtyChange,
  onContinue,
}: BookingStepReviewProps) {
  const subtotal = classData.price * qty;
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + serviceFee;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">{classData.title}</h3>
        <p className="text-sm text-muted-foreground">
          with {classData.instructor.name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatSessionDate(classData.schedule.nextSession)}
        </p>
      </div>

      <Separator />

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Guests</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={qty <= 1}
            onClick={() => onQtyChange(qty - 1)}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{qty}</span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={qty >= classData.spotsRemaining}
            onClick={() => onQtyChange(qty + 1)}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            €{classData.price} × {qty} guest{qty !== 1 && "s"}
          </span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Service fee (10%)</span>
          <span>€{serviceFee.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
        size="lg"
        onClick={onContinue}
      >
        Continue to Details
      </Button>
    </div>
  );
}
