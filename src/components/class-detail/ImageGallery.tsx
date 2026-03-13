import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: alt, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl">
        <div className="relative aspect-[16/10]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-3 top-3 bg-white/80 text-foreground backdrop-blur-sm hover:bg-white/90"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="mr-1 size-4" />
            Back
          </Button>

          {/* Share button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3 bg-white/80 text-foreground backdrop-blur-sm hover:bg-white/90"
            onClick={() => void handleShare()}
            aria-label="Share this class"
          >
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 flex-1 overflow-hidden rounded-lg transition-all sm:h-20 ${
                i === activeIndex
                  ? "ring-2 ring-[#2563EB] ring-offset-2"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
