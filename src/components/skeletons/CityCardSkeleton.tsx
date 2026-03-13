export function CityCardSkeleton() {
  return (
    <div className="aspect-[4/3] w-full animate-pulse overflow-hidden rounded-xl bg-muted">
      <div className="flex h-full flex-col justify-end p-4">
        <div className="h-6 w-24 rounded bg-muted-foreground/20" />
        <div className="mt-1 h-4 w-16 rounded bg-muted-foreground/20" />
        <div className="mt-2 h-3 w-20 rounded bg-muted-foreground/20" />
      </div>
    </div>
  );
}
