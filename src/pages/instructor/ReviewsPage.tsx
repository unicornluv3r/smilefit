import { useState, useMemo } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_DASHBOARD_REVIEWS, MOCK_DASHBOARD_CLASSES } from "@/data/mockDashboard";

type SortKey = "newest" | "oldest" | "highest" | "lowest";
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";

export function ReviewsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [classFilter, setClassFilter] = useState("all");

  const reviews = MOCK_DASHBOARD_REVIEWS;

  // Rating overview stats
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
    reviews.forEach((r) => {
      counts[r.rating - 1]++;
    });
    return counts.reverse(); // 5-star first
  }, [reviews]);

  const maxCount = Math.max(...distribution, 1);

  const filtered = useMemo(() => {
    let result = [...reviews];

    if (ratingFilter !== "all") {
      result = result.filter((r) => r.rating === Number(ratingFilter));
    }
    if (classFilter !== "all") {
      result = result.filter((r) => r.classId === classFilter);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "highest":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        result.sort((a, b) => a.rating - b.rating);
        break;
    }

    return result;
  }, [reviews, ratingFilter, classFilter, sortBy]);

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          See what your students are saying
        </p>
      </div>

      {/* Rating overview */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row">
          {/* Average rating */}
          <div className="text-center">
            <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
            <div className="mt-1 flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < Math.round(avgRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Separator orientation="vertical" className="hidden h-24 sm:block" />
          <Separator className="sm:hidden" />

          {/* Distribution bars */}
          <div className="flex-1 space-y-2 w-full max-w-md">
            {distribution.map((count, i) => {
              const stars = 5 - i;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="flex w-7 items-center gap-0.5 text-sm">
                    {stars}
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={ratingFilter} onValueChange={(v) => setRatingFilter(v as RatingFilter)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {MOCK_DASHBOARD_CLASSES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title.length > 30 ? c.title.slice(0, 30) + "..." : c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No reviews found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews will appear here after students attend your classes
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs bg-[#2563EB]/10 text-[#2563EB]">
                        {r.studentName
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">{r.className}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
                {r.comment && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {r.comment}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
