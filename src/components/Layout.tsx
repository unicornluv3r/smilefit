import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { LanguageSwitcher, LanguageSwitcherMobile } from "@/components/LanguageSwitcher";

const NAV_KEYS = [
  { to: "/", key: "nav.home" },
  { to: "/classes", key: "nav.findClasses" },
  { to: "/cities", key: "nav.cities" },
  { to: "/how-it-works", key: "nav.howItWorks" },
  { to: "/instructors", key: "nav.instructors" },
  { to: "/dashboard", key: "nav.instructorDashboard" },
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
  const { t } = useTranslation();
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
            {NAV_KEYS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors duration-200 hover:text-foreground ${
                  isActive(link.to) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(link.key)}
                {isActive(link.to) && (
                  <span className="absolute -bottom-[1.19rem] inset-x-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

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
                <Link to="/login">{t("nav.logIn")}</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden bg-[#2563EB] hover:bg-[#2563EB]/90 md:inline-flex transition-all duration-200 hover:shadow-md hover:shadow-[#2563EB]/25"
              >
                <Link to="/signup">{t("nav.signUp")}</Link>
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
                aria-label={t("nav.openMenu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" aria-label="Navigation menu">
              <nav className="mt-8 flex flex-col gap-4">
                {NAV_KEYS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-foreground ${
                      isActive(link.to) ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                ))}
                {!loading && !user && (
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link to="/login">{t("nav.logIn")}</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link to="/signup">{t("nav.signUp")}</Link>
                    </Button>
                  </div>
                )}
                <div className="mt-4 border-t pt-4">
                  <LanguageSwitcherMobile />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useTranslation();

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
              {t("footer.tagline")}
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
            <h4 className="mb-3 font-semibold">{t("footer.explore")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/classes" className="transition-colors duration-200 hover:text-foreground">{t("nav.findClasses")}</Link></li>
              <li><Link to="/cities" className="transition-colors duration-200 hover:text-foreground">{t("footer.browseCities")}</Link></li>
              <li><Link to="/instructors" className="transition-colors duration-200 hover:text-foreground">{t("nav.instructors")}</Link></li>
              <li><Link to="/how-it-works" className="transition-colors duration-200 hover:text-foreground">{t("nav.howItWorks")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 font-semibold">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors duration-200 hover:text-foreground">{t("footer.aboutUs")}</Link></li>
              <li><Link to="/become-instructor" className="transition-colors duration-200 hover:text-foreground">{t("footer.becomeInstructor")}</Link></li>
              <li><Link to="/careers" className="transition-colors duration-200 hover:text-foreground">{t("footer.careers")}</Link></li>
              <li><Link to="/blog" className="transition-colors duration-200 hover:text-foreground">{t("footer.blog")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 font-semibold">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="transition-colors duration-200 hover:text-foreground">{t("footer.helpCenter")}</Link></li>
              <li><Link to="/contact" className="transition-colors duration-200 hover:text-foreground">{t("footer.contactUs")}</Link></li>
              <li><Link to="/privacy" className="transition-colors duration-200 hover:text-foreground">{t("footer.privacyPolicy")}</Link></li>
              <li><Link to="/terms" className="transition-colors duration-200 hover:text-foreground">{t("footer.termsOfService")}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const { t } = useTranslation();
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
      aria-label={t("footer.backToTop")}
    >
      <ArrowUp className="size-4" />
    </button>
  );
}
