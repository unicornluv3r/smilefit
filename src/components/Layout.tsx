import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Menu, Instagram, Facebook, Twitter, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/classes", label: "Find Classes" },
  { to: "/cities", label: "Cities" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/instructors", label: "Instructors" },
  { to: "/dashboard", label: "Instructor Dashboard" },
] as const;

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <Toaster richColors closeButton />
    </div>
  );
}

function Navbar() {
  const { user, loading } = useAuth();
  const scrollY = useScrollPosition();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(to: string) {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  }

  const scrolled = scrollY > 50;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-all duration-300 ${
        scrolled
          ? "bg-background/80 shadow-sm supports-backdrop-filter:bg-background/60"
          : "bg-background/95 supports-backdrop-filter:bg-background/80"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group text-xl font-bold transition-transform duration-200 hover:scale-105"
          >
            <span className="text-[#2563EB] transition-colors duration-200 group-hover:text-[#1d4ed8]">
              Smile
            </span>
            <span className="text-foreground">Fit</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors duration-200 hover:text-foreground ${
                  isActive(link.to) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[1.19rem] inset-x-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <>
              <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
            </>
          ) : user ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                <Link to="/login">Log In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden bg-[#2563EB] hover:bg-[#2563EB]/90 md:inline-flex transition-all duration-200 hover:shadow-md hover:shadow-[#2563EB]/25"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-label="Navigation menu">
              <nav className="mt-8 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-foreground ${
                      isActive(link.to) ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!loading && !user && (
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative bg-muted/30">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold">
              <span className="text-[#2563EB]">Smile</span>
              <span className="text-foreground">Fit</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Outdoor fitness classes across Italy. Train in the open air with
              expert instructors.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://instagram.com/joinsmilefit" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Instagram @joinsmilefit"
                  className="transition-all duration-200 hover:-translate-y-0.5 hover:text-[#E4405F] hover:bg-[#E4405F]/10"
                >
                  <Instagram className="size-4" />
                </Button>
              </a>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Facebook"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1877F2] hover:bg-[#1877F2]/10"
              >
                <Facebook className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Twitter"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
              >
                <Twitter className="size-4" />
              </Button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-3 font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/classes" className="transition-colors duration-200 hover:text-foreground">Find Classes</Link></li>
              <li><Link to="/cities" className="transition-colors duration-200 hover:text-foreground">Browse Cities</Link></li>
              <li><Link to="/instructors" className="transition-colors duration-200 hover:text-foreground">Instructors</Link></li>
              <li><Link to="/how-it-works" className="transition-colors duration-200 hover:text-foreground">How It Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors duration-200 hover:text-foreground">About Us</Link></li>
              <li><Link to="/become-instructor" className="transition-colors duration-200 hover:text-foreground">Become an Instructor</Link></li>
              <li><Link to="/careers" className="transition-colors duration-200 hover:text-foreground">Careers</Link></li>
              <li><Link to="/blog" className="transition-colors duration-200 hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="transition-colors duration-200 hover:text-foreground">Help Center</Link></li>
              <li><Link to="/contact" className="transition-colors duration-200 hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/privacy" className="transition-colors duration-200 hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors duration-200 hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-[#2563EB]">Smile</span>
          <span className="text-foreground">Fit</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const scrollY = useScrollPosition();
  const visible = scrollY > 400;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex size-10 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-lg transition-all duration-300 hover:bg-[#1d4ed8] hover:shadow-xl hover:scale-110 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
