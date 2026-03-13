import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";

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
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const pausedRef = useRef(false);
  const { ref: sectionRef, inView } = useInView();

  const goTo = useCallback(
    (idx: number, dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 350);
    },
    [animating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % TESTIMONIALS.length, "right");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(
      (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
      "left",
    );
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) next();
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  const t = TESTIMONIALS[current];

  const slideClass = animating
    ? direction === "right"
      ? "animate-[slide-testimonial_0.35s_ease-out_forwards]"
      : "animate-[slide-testimonial_0.35s_ease-out_forwards] [--tw-translate-x:-1rem]"
    : "";

  return (
    <section ref={sectionRef} className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h2
          className={`mb-12 text-center text-3xl font-bold tracking-tight transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          What Our Community Says
        </h2>

        <div
          className={`relative mx-auto max-w-2xl transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: inView ? "200ms" : "0ms" }}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          aria-live="polite"
        >
          <div
            className={`relative rounded-2xl border bg-card p-8 text-center shadow-sm ${slideClass}`}
          >
            {/* Decorative quote mark */}
            <Quote className="absolute top-4 left-4 size-8 text-[#2563EB]/10 -scale-x-100" />

            <div className="mb-4 flex justify-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <blockquote className="mb-6 text-lg text-muted-foreground italic leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center gap-2">
              <img
                src={t.avatar}
                alt={`Photo of ${t.author}`}
                className="size-12 rounded-full object-cover ring-2 ring-background shadow-sm"
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
            className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            aria-label="Next testimonial"
          >
            <ChevronRight className="size-4" />
          </Button>

          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  goTo(i, i > current ? "right" : "left")
                }
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "h-2.5 w-6 bg-[#2563EB]"
                    : "size-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
