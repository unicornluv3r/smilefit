import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingsPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <CalendarDays className="mb-4 size-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="mt-2 text-muted-foreground">Coming Soon</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Your booking history and upcoming classes will appear here. In the
        meantime, check out the dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/classes">Find Classes</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
