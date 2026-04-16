import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Camera, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getCroppedImg, readFileAsDataURL } from "@/lib/cropImage";
import { useUploadAvatar } from "@/hooks/useAvatarUpload";

type AvatarUploadProps = {
  currentAvatarUrl: string | null;
  userId: string;
  userInitials: string;
  onUploadComplete: (newUrl: string) => void;
};

const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

export function AvatarUpload({
  currentAvatarUrl,
  userId,
  userInitials,
  onUploadComplete,
}: AvatarUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const uploadMutation = useUploadAvatar();

  const openFilePicker = () => fileInputRef.current?.click();

  const resetCropState = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_MIME.includes(file.type as (typeof ACCEPTED_MIME)[number])) {
      toast.error(t("profile.avatar.errorInvalidType"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(t("profile.avatar.errorTooLarge"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageSrc(dataUrl);
    } catch {
      toast.error(t("profile.avatar.errorUploadFailed"));
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, pixels: Area) => setCroppedAreaPixels(pixels),
    [],
  );

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        400,
      );
      const result = await uploadMutation.mutateAsync({
        file: blob,
        userId,
      });
      onUploadComplete(result.url);
      toast.success(t("profile.avatar.successToast"));
      resetCropState();
    } catch (err) {
      console.error("[SmileFit Avatar] Upload failed:", err);
      toast.error(t("profile.avatar.errorUploadFailed"));
    }
  };

  const handleCancel = () => {
    if (uploadMutation.isPending) return;
    resetCropState();
  };

  const isOpen = imageSrc !== null;

  return (
    <div className="relative">
      <Avatar className="size-24 transition-opacity">
        {currentAvatarUrl && (
          <AvatarImage src={currentAvatarUrl} alt={userInitials} />
        )}
        <AvatarFallback className="bg-[#2563EB] text-xl text-white">
          {userInitials}
        </AvatarFallback>
      </Avatar>

      <button
        type="button"
        onClick={openFilePicker}
        aria-label={
          currentAvatarUrl
            ? t("profile.avatar.change")
            : t("profile.avatar.upload")
        }
        className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-background bg-[#2563EB] text-white shadow-sm transition-all hover:scale-105 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40"
      >
        <Camera className="size-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => void handleFileChange(e)}
        className="hidden"
      />

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("profile.avatar.cropTitle")}</DialogTitle>
            <DialogDescription>
              {t("profile.avatar.cropSubtitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted sm:h-80">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {t("profile.avatar.zoom")}
              </label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={(value) => setZoom(value[0] ?? 1)}
                disabled={uploadMutation.isPending}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              disabled={uploadMutation.isPending}
              className="w-full"
            >
              <RotateCw className="mr-2 size-3.5" />
              {rotation}°
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={uploadMutation.isPending}
            >
              {t("profile.avatar.cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={uploadMutation.isPending || !croppedAreaPixels}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              {uploadMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {uploadMutation.isPending
                ? t("profile.avatar.uploading")
                : t("profile.avatar.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
