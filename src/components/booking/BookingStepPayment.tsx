import { Loader2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { isStripeTestMode } from "@/lib/stripe";

interface BookingStepPaymentProps {
  className: string;
  sessionDate: string;
  quantity: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  processing: boolean;
  onBack: () => void;
  onPay: () => void;
}

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingStepPayment({
  className,
  sessionDate,
  quantity,
  subtotal,
  serviceFee,
  total,
  processing,
  onBack,
  onPay,
}: BookingStepPaymentProps) {
  return (
    <div className="space-y-4">
      {/* Test mode badge */}
      {isStripeTestMode && (
        <div className="flex items-center justify-center">
          <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
            Test Mode — No real charges
          </Badge>
        </div>
      )}

      {/* Order summary */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="text-sm font-semibold mb-3">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {className}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{formatSessionDate(sessionDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guests</span>
            <span>{quantity}</span>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee (10%)</span>
            <span>€{serviceFee.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <PaymentIcon type="visa" />
        <PaymentIcon type="mastercard" />
        <PaymentIcon type="amex" />
        <PaymentIcon type="applepay" />
      </div>

      {/* Pay button */}
      <Button
        className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90 h-12 text-base"
        disabled={processing}
        onClick={onPay}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Processing payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 size-4" />
            Pay €{total.toFixed(2)}
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        className="w-full"
        disabled={processing}
        onClick={onBack}
      >
        Back
      </Button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
}

function PaymentIcon({ type }: { type: "visa" | "mastercard" | "amex" | "applepay" }) {
  const labels: Record<string, string> = {
    visa: "Visa",
    mastercard: "MC",
    amex: "Amex",
    applepay: "Apple Pay",
  };

  return (
    <div className="flex h-7 items-center justify-center rounded border bg-background px-2 text-[10px] font-semibold text-muted-foreground">
      {labels[type]}
    </div>
  );
}
