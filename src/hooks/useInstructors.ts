import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchInstructors,
  fetchInstructor,
  fetchInstructorStats,
  fetchInstructorBookings,
  becomeInstructor,
  type InstructorProfile,
  type InstructorStats,
  type InstructorBooking,
} from "@/lib/instructors";

export function useInstructors() {
  return useQuery<InstructorProfile[]>({
    queryKey: ["instructors"],
    queryFn: fetchInstructors,
  });
}

export function useInstructor(id: string | undefined) {
  return useQuery<InstructorProfile>({
    queryKey: ["instructor", id],
    queryFn: () => fetchInstructor(id!),
    enabled: !!id,
  });
}

export function useInstructorStats(instructorId: string | undefined) {
  return useQuery<InstructorStats>({
    queryKey: ["instructor-stats", instructorId],
    queryFn: () => fetchInstructorStats(instructorId!),
    enabled: !!instructorId,
  });
}

export function useInstructorBookings(instructorId: string | undefined) {
  return useQuery<InstructorBooking[]>({
    queryKey: ["instructor-bookings", instructorId],
    queryFn: () => fetchInstructorBookings(instructorId!),
    enabled: !!instructorId,
  });
}

export function useBecomeInstructor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      details,
    }: {
      userId: string;
      details: Parameters<typeof becomeInstructor>[1];
    }) => becomeInstructor(userId, details),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      void queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
  });
}
