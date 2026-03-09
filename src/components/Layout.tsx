import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold">
            <span className="text-[#2563EB]">Smile</span>
            <span className="text-foreground">Fit</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/classes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Find Classes
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              to="/instructors"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Instructors
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Instructor Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-[#2563EB] hover:bg-[#2563EB]/90"
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-[#2563EB]">Smile</span>
          <span className="text-foreground">Fit</span>. All rights reserved.
        </p>
        <p className="mt-1">Outdoor fitness classes across Italy</p>
      </div>
    </footer>
  );
}
