import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Users,
  MapPin,
  Star,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useBecomeInstructor } from "@/hooks/useInstructors";

const instructorSchema = z.object({
  bio: z.string().min(20, "Tell us more about yourself (at least 20 characters)"),
  city: z.string().min(1, "Please select a city"),
  specialties: z.string().min(1, "Please add at least one specialty"),
  certifications: z.string().min(1, "Please add at least one certification"),
  years_experience: z.number().min(0, "Must be a positive number").max(50),
  instagram_handle: z.string().optional(),
  website_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

const CITIES = [
  "Roma",
  "Milano",
  "Firenze",
  "Napoli",
  "Venezia",
  "Bologna",
  "Torino",
  "Palermo",
];

const BENEFITS = [
  {
    icon: Users,
    title: "Reach More Students",
    description:
      "Connect with fitness enthusiasts across Italy looking for outdoor classes",
  },
  {
    icon: MapPin,
    title: "Beautiful Locations",
    description:
      "Teach in Italy's most stunning outdoor spaces — parks, beaches, piazzas",
  },
  {
    icon: DollarSign,
    title: "Set Your Own Prices",
    description:
      "You're in control — set your prices and manage your availability",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Grow your brand with reviews, ratings, and a verified instructor profile",
  },
];

export function BecomeInstructorPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const becomeInstructor = useBecomeInstructor();

  const isAlreadyInstructor = profile?.role === "instructor";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      bio: profile?.bio ?? "",
      city: profile?.city ?? "",
      years_experience: 1,
    },
  });

  const onSubmit = async (data: InstructorFormValues) => {
    if (!user) {
      navigate("/login?returnUrl=/become-instructor");
      return;
    }

    try {
      await becomeInstructor.mutateAsync({
        userId: user.id,
        details: {
          specialties: data.specialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          certifications: data.certifications
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          years_experience: data.years_experience,
          bio: data.bio,
          city: data.city,
          instagram_handle: data.instagram_handle || undefined,
          website_url: data.website_url || undefined,
        },
      });

      // Wait for the profile cache to refetch so InstructorRoute sees role=instructor
      await queryClient.refetchQueries({ queryKey: ["profile", user.id] });

      toast.success("Welcome aboard! You're now an instructor.");
      navigate("/instructor/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile. Please try again.",
      );
    }
  };

  if (isAlreadyInstructor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto mb-4 size-16 text-green-500" />
        <h1 className="text-3xl font-bold">You&apos;re already an instructor!</h1>
        <p className="mt-2 text-muted-foreground">
          Head to your dashboard to manage your classes.
        </p>
        <Button
          asChild
          className="mt-6 bg-[#2563EB] hover:bg-[#2563EB]/90"
        >
          <Link to="/instructor/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-[fade-in-up_0.5s_ease-out]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#2563EB]/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Become a SmileFit Instructor
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Share your passion for fitness in Italy&apos;s most beautiful outdoor
            spaces. Join our community of certified instructors.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#2563EB]/10">
                  <b.icon className="size-6 text-[#2563EB]" />
                </div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Application Form */}
      <section className="py-12">
        <div className="container mx-auto max-w-xl px-4">
          <h2 className="text-center text-2xl font-bold">
            {user ? "Complete Your Profile" : "Apply to Teach"}
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            {user
              ? "Fill in your instructor details below"
              : "Sign in first, then complete your instructor profile"}
          </p>

          {!user ? (
            <div className="mt-8 text-center">
              <Button
                asChild
                className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                size="lg"
              >
                <Link to="/login?returnUrl=/become-instructor">
                  Sign In to Get Started
                </Link>
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              className="mt-8 space-y-6"
            >
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about your fitness background, teaching style, and what makes your classes special..."
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>Primary City</Label>
                <Select
                  value={watch("city")}
                  onValueChange={(v) => setValue("city", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Where will you teach?" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <Label htmlFor="specialties">
                  Specialties (comma-separated)
                </Label>
                <Input
                  id="specialties"
                  placeholder="e.g., Yoga, HIIT, Pilates"
                  {...register("specialties")}
                />
                {errors.specialties && (
                  <p className="text-sm text-destructive">
                    {errors.specialties.message}
                  </p>
                )}
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <Label htmlFor="certifications">
                  Certifications (comma-separated)
                </Label>
                <Input
                  id="certifications"
                  placeholder="e.g., RYT-200, NASM-CPT, ACE"
                  {...register("certifications")}
                />
                {errors.certifications && (
                  <p className="text-sm text-destructive">
                    {errors.certifications.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="years_experience">
                  Years of Teaching Experience
                </Label>
                <Input
                  id="years_experience"
                  type="number"
                  min="0"
                  max="50"
                  {...register("years_experience", { valueAsNumber: true })}
                />
                {errors.years_experience && (
                  <p className="text-sm text-destructive">
                    {errors.years_experience.message}
                  </p>
                )}
              </div>

              {/* Social (optional) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram_handle">
                    Instagram (optional)
                  </Label>
                  <Input
                    id="instagram_handle"
                    placeholder="@your_handle"
                    {...register("instagram_handle")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website (optional)</Label>
                  <Input
                    id="website_url"
                    placeholder="https://yourwebsite.com"
                    {...register("website_url")}
                  />
                  {errors.website_url && (
                    <p className="text-sm text-destructive">
                      {errors.website_url.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90"
                size="lg"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Become an Instructor
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
