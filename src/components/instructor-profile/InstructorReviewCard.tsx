import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InstructorReview } from "@/data/mockInstructor";

export function InstructorReviewCard({ review }: { review: InstructorReview }) {
  const formattedDate = new Date(review.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex gap-3 py-4">
      <img
        src={review.reviewerAvatar}
        alt={review.reviewerName}
        className="size-10 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="text-sm font-medium">{review.reviewerName}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
        <Badge
          variant="secondary"
          className="mt-2 text-[0.65rem] font-normal"
        >
          {review.className}
        </Badge>
      </div>
    </div>
  );
}
