import { useState } from "react";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import type { ClassDetail } from "@/data/mockClassDetail";

interface BookingDialogProps {
  classData: ClassDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQty: number;
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

export function BookingDialog({
  classData,
  open,
  onOpenChange,
  initialQty,
}: BookingDialogProps) {
  const [qty, setQty] = useState(initialQty);
  const [confirmed, setConfirmed] = useState(false);
  const total = classData.price * qty;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setConfirmed(false);
      setQty(initialQty);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {confirmed ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-9 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl">Booking Confirmed!</DialogTitle>
              <DialogDescription className="mt-2">
                You're all set for{" "}
                <span className="font-medium text-foreground">
                  {classData.title}
                </span>{" "}
                with {classData.instructor.name}.
              </DialogDescription>
            </DialogHeader>
            <p className="mt-4 text-sm text-muted-foreground">
              {formatSessionDate(classData.schedule.nextSession)}
            </p>
            <Button asChild className="mt-6 bg-[#2563EB] hover:bg-[#2563EB]/90">
              <Link to="/classes">Back to Classes</Link>
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Booking</DialogTitle>
              <DialogDescription>
                {classData.title} with {classData.instructor.name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 text-sm text-muted-foreground">
              {formatSessionDate(classData.schedule.nextSession)}
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
                  onClick={() => setQty((q) => q - 1)}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-6 text-center text-sm font-medium">
                  {qty}
                </span>
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

            <Separator />

            {/* Price breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  €{classData.price} × {qty} guest{qty !== 1 && "s"}
                </span>
                <span>€{total}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>€{total}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
                size="lg"
                onClick={() => setConfirmed(true)}
              >
                Confirm Booking
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
