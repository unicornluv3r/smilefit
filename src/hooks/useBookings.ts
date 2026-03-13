import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchUserBookings,
  createBooking,
  cancelBooking,
  type BookingWithDetails,
} from "@/lib/bookings";
import { useAuth } from "@/context/AuthContext";

export function useUserBookings() {
  const { user } = useAuth();
  return useQuery<BookingWithDetails[]>({
    queryKey: ["bookings", user?.id],
    queryFn: () => fetchUserBookings(user!.id),
    enabled: !!user,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      classId,
      sessionId,
      quantity,
      totalPrice,
    }: {
      classId: string;
      sessionId: string;
      quantity: number;
      totalPrice: number;
    }) => createBooking(user!.id, classId, sessionId, quantity, totalPrice),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({
        queryKey: ["class-sessions", variables.classId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason?: string;
    }) => cancelBooking(bookingId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
