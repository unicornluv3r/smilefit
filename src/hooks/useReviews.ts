import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchClassReviews,
  fetchInstructorReviews,
  createReview,
  type ReviewWithDetails,
  type DbReview,
} from "@/lib/reviews";

export function useClassReviews(classId: string | undefined) {
  return useQuery<ReviewWithDetails[]>({
    queryKey: ["class-reviews", classId],
    queryFn: () => fetchClassReviews(classId!),
    enabled: !!classId,
  });
}

export function useInstructorReviews(instructorId: string | undefined) {
  return useQuery<ReviewWithDetails[]>({
    queryKey: ["instructor-reviews", instructorId],
    queryFn: () => fetchInstructorReviews(instructorId!),
    enabled: !!instructorId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation<DbReview, Error, Parameters<typeof createReview>[0]>({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["class-reviews", variables.class_id],
      });
      void queryClient.invalidateQueries({
        queryKey: ["instructor-reviews", variables.instructor_id],
      });
    },
  });
}
