import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        <div className="relative px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/80">
            How a love for Italy and the outdoors became something bigger
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <p className="text-lg leading-relaxed text-muted-foreground">
              SmileFit was founded in Italy by people who believe fitness should
              have no walls — literally.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The idea was born from a simple observation: Italy has the most
              beautiful outdoor spaces in the world, yet most fitness happens
              inside four walls. Ancient parks, sun-drenched coastlines, historic
              piazzas — all sitting empty while people sweat under fluorescent
              lights.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              SmileFit exists to change that — to bring fitness outside, into the
              piazzas, parks, beaches, and gardens of Italy's most stunning
              cities.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We connect passionate instructors with curious students, locals
              with travelers, and everyone with the joy of moving your body
              under open skies.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-amber-50/50 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Fitness Without Boundaries
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We believe fitness shouldn't be confined to gyms. We believe
              instructors should be free to share their passion wherever
              inspiration strikes — whether that's a sunrise session by the
              Colosseum or a sunset flow on the Amalfi Coast.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We're building a community where every outdoor space becomes a
              studio, every city becomes a playground, and every class comes
              with a view.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              What We Stand For
            </h2>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            <FadeIn delay={100}>
              <div className="rounded-2xl border bg-card p-8 text-center">
                <span className="text-4xl">&#x1F30D;</span>
                <h3 className="mt-4 text-lg font-semibold">
                  Open Air, Open Mind
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We take fitness outside because fresh air, sunshine, and
                  beautiful surroundings make every workout better.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="rounded-2xl border bg-card p-8 text-center">
                <span className="text-4xl">&#x1F91D;</span>
                <h3 className="mt-4 text-lg font-semibold">Community First</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We're not just a booking platform. We're a community of
                  instructors, students, locals, and travelers united by
                  movement.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="rounded-2xl border bg-card p-8 text-center">
                <span className="text-4xl">&#x1F1EE;&#x1F1F9;</span>
                <h3 className="mt-4 text-lg font-semibold">
                  Born in Italy, For the World
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Founded in Italy with love, built for anyone who wants to
                  experience fitness the Italian way. Starting here, growing
                  everywhere.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-amber-50/50 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">The Team</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              SmileFit was founded by a small, passionate team based in Italy
              who believe the best gym is the great outdoors. We're fitness
              lovers, travelers, and dreamers building the platform we wish
              existed.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Join the Movement
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Whether you're looking for your next class or ready to teach one,
              there's a place for you here.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-[#2563EB] hover:bg-[#2563EB]/90">
                <Link to="/classes">
                  Find a Class <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/become-instructor">Become an Instructor</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
