import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
  city: string;
  className: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Doing yoga at sunrise in Villa Borghese was one of the most magical experiences of my life. The instructor was incredible and the setting was unreal.",
    author: "Anna M.",
    city: "Roma",
    className: "Sunrise Yoga at Villa Borghese",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote:
      "The morning yoga sessions in Parco Sempione are the perfect way to start my workday. I've been going for three months and I feel transformed.",
    author: "Giulia R.",
    city: "Milano",
    className: "Morning Yoga in Parco Sempione",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote:
      "Bootcamp on Mondello Beach at sunrise is the most energizing thing I've ever done. Giovanni pushes you just the right amount.",
    author: "Valentina G.",
    city: "Palermo",
    className: "Bootcamp Training by the Beach",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    quote:
      "Running along the Po River with snow-capped Alps in the distance — my favorite way to start the day. The group energy is amazing.",
    author: "Davide L.",
    city: "Torino",
    className: "Sunrise Running Group",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const pausedRef = useRef(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const t = TESTIMONIALS[current];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
          What Our Community Says
        </h2>

        <div
          className="relative mx-auto max-w-2xl"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          aria-live="polite"
        >
          <div className="rounded-2xl border bg-card p-8 text-center shadow-sm transition-all duration-300">
            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <blockquote className="mb-6 text-lg text-muted-foreground italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center gap-2">
              <img
                src={t.avatar}
                alt={`Photo of ${t.author}`}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm text-muted-foreground">
                  {t.className} · {t.city}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-4" />
          </Button>

          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`size-2.5 rounded-full transition-colors ${
                  i === current ? "bg-[#2563EB]" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
