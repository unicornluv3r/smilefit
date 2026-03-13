import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { StepIndicator } from "@/components/booking/StepIndicator";
import { BookingStepReview } from "@/components/booking/BookingStepReview";
import {
  BookingStepDetails,
  type BookingDetailsValues,
} from "@/components/booking/BookingStepDetails";
import { BookingStepPayment } from "@/components/booking/BookingStepPayment";
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";
import { useAuth } from "@/context/AuthContext";
import { processPayment } from "@/lib/payments";
import { toast } from "sonner";
import type { ClassDetail } from "@/data/mockClassDetail";
import type { DbSession } from "@/lib/bookings";

interface BookingDialogProps {
  classData: ClassDetail;
  sessions: DbSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQty: number;
}

function formatSessionTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatSessionDateOnly(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().split("T")[0];
}

export function BookingDialog({
  classData,
  sessions,
  selectedSessionId,
  open,
  onOpenChange,
  initialQty,
}: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(initialQty);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) ?? sessions[0];
  const sessionDate = activeSession?.start_time ?? classData.schedule.nextSession;

  const subtotal = Number(classData.price) * qty;
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + serviceFee;

  const resetState = useCallback(() => {
    setStep(1);
    setQty(initialQty);
    setConfirmationCode("");
    setPaymentProcessing(false);
  }, [initialQty]);

  const handleOpenChange = (next: boolean) => {
    if (!next && (step === 2 || step === 3)) {
      setShowCloseAlert(true);
      return;
    }
    if (!next) {
      resetState();
    }
    onOpenChange(next);
  };

  const handleDetailsConfirm = (_data: BookingDetailsValues) => {
    // Move to payment step
    setStep(3);
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to book a class");
      return;
    }

    setPaymentProcessing(true);

    const result = await processPayment({
      userId: user.id,
      classId: classData.id,
      sessionId: activeSession?.id ?? "",
      quantity: qty,
      totalPrice: total,
      className: classData.title,
      unitPrice: Number(classData.price),
    });

    setPaymentProcessing(false);

    if (result.success) {
      if (result.confirmationCode) {
        // Simulated flow — show confirmation in dialog
        setConfirmationCode(result.confirmationCode);
        setStep(4);
      } else {
        // Stripe redirect flow — navigate to success page
        const params = new URLSearchParams({
          class_name: classData.title,
          date: formatSessionDateOnly(sessionDate),
          time: formatSessionTime(sessionDate),
          location: classData.location.name,
          quantity: String(qty),
          total: String(total),
          code: result.confirmationCode ?? "",
        });
        navigate(`/booking/success?${params.toString()}`);
      }
    } else {
      toast.error(result.error ?? "Payment failed. Please try again.");
    }
  };

  const handleCloseAlertConfirm = () => {
    setShowCloseAlert(false);
    resetState();
    onOpenChange(false);
  };

  const defaultFormValues = {
    fullName:
      (user?.user_metadata?.full_name as string | undefined) ?? "",
    email: user?.email ?? "",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Book {classData.title}</DialogTitle>
            <DialogDescription>
              Complete your booking for {classData.title}
            </DialogDescription>
          </DialogHeader>

          <StepIndicator currentStep={step} totalSteps={4} />

          <div className="mt-2">
            {step === 1 && (
              <BookingStepReview
                classData={classData}
                qty={qty}
                onQtyChange={setQty}
                onContinue={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <BookingStepDetails
                defaultValues={defaultFormValues}
                onBack={() => setStep(1)}
                onConfirm={(data) => void handleDetailsConfirm(data)}
              />
            )}
            {step === 3 && (
              <BookingStepPayment
                className={classData.title}
                sessionDate={sessionDate}
                quantity={qty}
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
                processing={paymentProcessing}
                onBack={() => setStep(2)}
                onPay={() => void handlePayment()}
              />
            )}
            {step === 4 && (
              <BookingStepConfirmation
                confirmationCode={confirmationCode}
                className={classData.title}
                date={formatSessionDateOnly(sessionDate)}
                time={formatSessionTime(sessionDate)}
                location={classData.location.name}
                quantity={qty}
                total={total}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAlert} onOpenChange={setShowCloseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close? Your booking details will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Booking</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleCloseAlertConfirm}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
