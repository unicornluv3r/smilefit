import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

type CertificationsEditorProps = {
  userId: string;
  value: string[];
  onChange: (next: string[]) => void;
};

const MAX_CERTS = 20;
const MAX_CERT_LENGTH = 100;

async function updateCertifications(args: {
  userId: string;
  certifications: string[];
}): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ certifications: args.certifications })
    .eq("id", args.userId);
  if (error) throw error;
}

export function CertificationsEditor({
  userId,
  value,
  onChange,
}: CertificationsEditorProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateCertifications,
    onSuccess: () => {
      toast.success(t("profile.certifications.successToast"));
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      void queryClient.invalidateQueries({ queryKey: ["instructor", userId] });
    },
    onError: () => {
      toast.error(t("profile.certifications.errorToast"));
    },
  });

  const persist = (next: string[]) => {
    onChange(next);
    mutation.mutate({ userId, certifications: next });
  };

  const addCert = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CERT_LENGTH) return;
    if (value.length >= MAX_CERTS) return;
    if (value.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setDraft("");
      return;
    }
    persist([...value, trimmed]);
    setDraft("");
  };

  const removeCert = (cert: string) => {
    persist(value.filter((c) => c !== cert));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCert();
    }
  };

  const atMax = value.length >= MAX_CERTS;
  const draftTooLong = draft.length > MAX_CERT_LENGTH;

  return (
    <Card className="p-5">
      <h3 className="font-semibold">
        {t("profile.certifications.sectionTitle")}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("profile.certifications.helpText")}
      </p>

      <div className="mt-4 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("profile.certifications.placeholder")}
          maxLength={MAX_CERT_LENGTH}
          disabled={atMax || mutation.isPending}
          aria-invalid={draftTooLong}
        />
        <Button
          type="button"
          onClick={addCert}
          disabled={
            !draft.trim() || atMax || draftTooLong || mutation.isPending
          }
          className="shrink-0 bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          {mutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="mr-1 size-4" />
          )}
          {t("profile.certifications.addButton")}
        </Button>
      </div>

      {value.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {value.map((cert) => (
            <Badge
              key={cert}
              variant="secondary"
              className="bg-[#2563EB]/10 text-[#2563EB] pr-1 pl-2.5 py-1 text-xs"
            >
              <span>{cert}</span>
              <button
                type="button"
                onClick={() => removeCert(cert)}
                disabled={mutation.isPending}
                aria-label={`Remove ${cert}`}
                className="ml-1 inline-flex size-4 items-center justify-center rounded-full hover:bg-[#2563EB]/20"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("profile.certifications.emptyState")}
        </p>
      )}
    </Card>
  );
}
