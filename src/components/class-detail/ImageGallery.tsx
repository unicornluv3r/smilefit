import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

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
