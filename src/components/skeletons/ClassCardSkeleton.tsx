import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ClassCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="h-48 w-full animate-pulse bg-muted" />
      <CardHeader className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
      <div className="mt-auto flex items-center justify-between px-4 pb-4">
        <div className="h-6 w-12 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </Card>
  );
}
