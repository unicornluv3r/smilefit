import { useState, useCallback } from "react";
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
import { BookingStepConfirmation } from "@/components/booking/BookingStepConfirmation";
import { useAuth } from "@/context/AuthContext";
import { useCreateBooking } from "@/hooks/useBookings";
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

function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SF-2026-${code}`;
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
  const { user } = useAuth();
  const createBooking = useCreateBooking();

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
  }, [initialQty]);

  const handleOpenChange = (next: boolean) => {
    if (!next && step === 2) {
      setShowCloseAlert(true);
      return;
    }
    if (!next) {
      resetState();
    }
    onOpenChange(next);
  };

  const handleConfirm = async (_data: BookingDetailsValues) => {
    // If we have a real session and user, create in Supabase
    if (activeSession && user) {
      try {
        await createBooking.mutateAsync({
          classId: classData.id,
          sessionId: activeSession.id,
          quantity: qty,
          totalPrice: total,
        });
      } catch {
        // Error toast is handled by the mutation
        return;
      }
    }

    const code = generateConfirmationCode();
    setConfirmationCode(code);
    setStep(3);
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

          <StepIndicator currentStep={step} totalSteps={3} />

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
                onConfirm={(data) => void handleConfirm(data)}
              />
            )}
            {step === 3 && (
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
