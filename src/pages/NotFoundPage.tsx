import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-[fade-in-up_0.5s_ease-out]">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#2563EB]/10">
        <MapPin className="size-8 text-[#2563EB]" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("notFound.description")}
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 size-4" />
            {t("notFound.backHome")}
          </Link>
        </Button>
        <Button asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Link to="/classes">{t("notFound.browseClasses")}</Link>
        </Button>
      </div>
    </div>
  );
}
