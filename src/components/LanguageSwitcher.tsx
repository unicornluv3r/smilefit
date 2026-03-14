import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/i18n";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  const currentLang =
    LANGUAGES.find((l) => i18n.language.startsWith(l.code)) ?? LANGUAGES[0];

  function selectLanguage(code: string) {
    void i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className="transition-all duration-200 hover:bg-muted"
      >
        <Globe className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right animate-[fade-in_0.15s_ease-out] rounded-xl border bg-card p-1.5 shadow-lg">
          {LANGUAGES.map((lang) => {
            const isActive = currentLang.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                  isActive
                    ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {isActive && <Check className="size-3.5 text-[#2563EB]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LanguageSwitcherMobile() {
  const { i18n } = useTranslation();

  const currentLang =
    LANGUAGES.find((l) => i18n.language.startsWith(l.code)) ?? LANGUAGES[0];

  return (
    <div className="space-y-1">
      <p className="px-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Language
      </p>
      <div className="grid grid-cols-2 gap-1">
        {LANGUAGES.map((lang) => {
          const isActive = currentLang.code === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => void i18n.changeLanguage(lang.code)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                isActive
                  ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <span className="text-sm leading-none">{lang.flag}</span>
              <span className="truncate">{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
