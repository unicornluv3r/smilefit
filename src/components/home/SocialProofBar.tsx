import { MapPin, Users, Star, CalendarCheck } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const STATS = [
  { icon: MapPin, value: "8", label: "Italian Cities" },
  { icon: CalendarCheck, value: "120+", label: "Classes Available" },
  { icon: Users, value: "50+", label: "Expert Instructors" },
  { icon: Star, value: "4.8", label: "Average Rating" },
];

export function SocialProofBar() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-y bg-muted/30 py-10">
      <div
        className={`container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4 ${
          inView ? "animate-[fade-in-up_0.5s_ease-out]" : "opacity-0"
        }`}
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <stat.icon className="mb-2 size-6 text-[#2563EB]" />
            <span className="text-2xl font-bold">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
