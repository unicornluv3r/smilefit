import { Link } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-[fade-in-up_0.5s_ease-out]">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#2563EB]/10">
        <MapPin className="size-8 text-[#2563EB]" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Looks like this route doesn't exist yet. Let's get you back to
        discovering outdoor fitness classes across Italy.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/classes">Browse Classes</Link>
        </Button>
      </div>
    </div>
  );
}
