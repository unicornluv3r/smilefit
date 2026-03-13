import { useSearchParams, Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BookingCancelledPage() {
  const [params] = useSearchParams();
  const classId = params.get("class_id");

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12 animate-[fade-in-up_0.5s_ease-out]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
            <XCircle className="size-9 text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your booking was not completed. No charges were made.
          </p>

          <div className="mt-6 flex w-full gap-2">
            {classId && (
              <Button
                asChild
                className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]/90"
              >
                <Link to={`/classes/${classId}`}>Try Again</Link>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1">
              <Link to="/classes">Browse Classes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
