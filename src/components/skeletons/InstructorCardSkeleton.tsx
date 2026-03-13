export function InstructorCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border p-4">
      <div className="size-16 animate-pulse rounded-full bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="h-3 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}
