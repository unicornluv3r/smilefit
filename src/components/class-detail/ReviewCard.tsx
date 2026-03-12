import { Star } from "lucide-react";
import type { ClassDetailReview } from "@/data/mockClassDetail";

interface ReviewCardProps {
  review: ClassDetailReview;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
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
        <div className="mt-1">
          <StarRating rating={review.rating} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

export function AverageRating({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Star className="size-5 fill-amber-400 text-amber-400" />
      <span className="text-xl font-bold">{rating}</span>
      <span className="text-sm text-muted-foreground">
        ({count} review{count !== 1 && "s"})
      </span>
    </div>
  );
}
