import { useQuery } from "@tanstack/react-query";
import {
  fetchClasses,
  fetchClassById,
  fetchClassSessions,
  type DbClass,
  type DbSession,
} from "@/lib/bookings";

export function useClasses() {
  return useQuery<DbClass[]>({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
}

export function useClassById(id: string | undefined) {
  return useQuery<DbClass>({
    queryKey: ["class", id],
    queryFn: () => fetchClassById(id!),
    enabled: !!id,
  });
}

export function useClassSessions(classId: string | undefined) {
  return useQuery<DbSession[]>({
    queryKey: ["class-sessions", classId],
    queryFn: () => fetchClassSessions(classId!),
    enabled: !!classId,
  });
}
