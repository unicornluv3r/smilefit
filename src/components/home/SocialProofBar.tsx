import { useTranslation } from "react-i18next";
import { MapPin, Users, Star, CalendarCheck } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface StatConfig {
  icon: typeof MapPin;
  value: number;
  suffix: string;
  prefix: string;
  labelKey: string;
  decimals: number;
}

const STATS: StatConfig[] = [
  { icon: CalendarCheck, value: 500, suffix: "+", prefix: "", labelKey: "stats.classesAvailable", decimals: 0 },
  { icon: Users, value: 50, suffix: "+", prefix: "", labelKey: "stats.expertInstructors", decimals: 0 },
  { icon: MapPin, value: 8, suffix: "", prefix: "", labelKey: "stats.italianCities", decimals: 0 },
  { icon: Star, value: 4.8, suffix: "", prefix: "", labelKey: "stats.averageRating", decimals: 1 },
];

function AnimatedStat({ stat, inView, delay }: { stat: StatConfig; inView: boolean; delay: number }) {
  const { t } = useTranslation();
  const count = useAnimatedCounter(stat.value, 1400, inView);
  const display = stat.decimals > 0
    ? count.toFixed(stat.decimals)
    : Math.round(count).toLocaleString();

  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      <stat.icon className="mb-2 size-6 text-[#2563EB]" />
      <span className="text-2xl font-bold tabular-nums">
        {stat.prefix}{display}{stat.suffix}
      </span>
      <span className="text-sm text-muted-foreground">{t(stat.labelKey)}</span>
    </div>
  );
}

export function SocialProofBar() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="border-y bg-muted/30 py-10">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <AnimatedStat
            key={stat.labelKey}
            stat={stat}
            inView={inView}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}
