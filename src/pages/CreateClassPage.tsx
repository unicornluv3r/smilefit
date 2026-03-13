import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { useClassById } from "@/hooks/useClasses";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

const classSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  city: z.string().min(1, "Please select a city"),
  address: z.string().min(3, "Address is required"),
  price: z.number().min(0, "Price must be positive"),
  duration_minutes: z.number().min(15, "Minimum 15 minutes"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  spots_total: z.number().min(1, "At least 1 spot required"),
  recurring_schedule: z.string().optional(),
  what_to_bring: z.string().optional(),
  cancellation_policy: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ClassFormValues = z.infer<typeof classSchema>;

const CATEGORIES = [
  "Yoga",
  "Pilates",
  "HIIT",
  "Bootcamp",
  "Running",
  "Meditation",
  "Barre",
  "Functional Training",
  "Tai Chi",
  "Cardio",
];

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

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

export function CreateClassPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: existingClass, isLoading: classLoading } = useClassById(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      difficulty: "Beginner",
      spots_total: 15,
      duration_minutes: 60,
      price: 15,
    },
  });

  useEffect(() => {
    if (existingClass && isEditing) {
      reset({
        title: existingClass.title,
        description: existingClass.description ?? "",
        category: existingClass.category,
        city: existingClass.city,
        address: existingClass.address ?? "",
        price: Number(existingClass.price),
        duration_minutes: existingClass.duration_minutes,
        difficulty: existingClass.difficulty,
        spots_total: existingClass.spots_total,
        recurring_schedule: existingClass.recurring_schedule ?? "",
        what_to_bring: existingClass.what_to_bring?.join(", ") ?? "",
        cancellation_policy: existingClass.cancellation_policy ?? "",
        image_url: existingClass.images[0] ?? "",
      });
    }
  }, [existingClass, isEditing, reset]);

  const onSubmit = async (data: ClassFormValues) => {
    if (!user) return;

    const classData = {
      title: data.title,
      description: data.description,
      category: data.category,
      city: data.city,
      address: data.address,
      price: data.price,
      duration_minutes: data.duration_minutes,
      difficulty: data.difficulty,
      spots_total: data.spots_total,
      recurring_schedule: data.recurring_schedule || null,
      what_to_bring: data.what_to_bring
        ? data.what_to_bring.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      cancellation_policy: data.cancellation_policy || null,
      images: data.image_url ? [data.image_url] : [],
      instructor_id: user.id,
      instructor_name: (profile as Profile | null)?.display_name ?? (profile as Profile | null)?.full_name ?? null,
      instructor_bio: (profile as Profile | null)?.bio ?? null,
      instructor_avatar: (profile as Profile | null)?.avatar_url ?? null,
      instructor_rating: Number((profile as Profile | null)?.average_rating ?? 0) || null,
      instructor_specialties: (profile as Profile | null)?.specialties ?? [],
      is_active: true,
    };

    if (isEditing && id) {
      const { error } = await supabase
        .from("classes")
        .update(classData)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update class: " + error.message);
        return;
      }
      toast.success("Class updated successfully");
    } else {
      const { error } = await supabase.from("classes").insert(classData);

      if (error) {
        toast.error("Failed to create class: " + error.message);
        return;
      }
      toast.success("Class created successfully");
    }

    navigate("/instructor/dashboard");
  };

  if (isEditing && classLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-[fade-in-up_0.5s_ease-out]">
      <h1 className="text-3xl font-bold">
        {isEditing ? "Edit Class" : "Create a New Class"}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {isEditing
          ? "Update your class details below"
          : "Fill in the details for your outdoor fitness class"}
      </p>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="mt-8 space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Class Title</Label>
          <Input
            id="title"
            placeholder="e.g., Sunrise Yoga at Parco degli Acquedotti"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe your class, what participants can expect..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category & Difficulty */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={watch("category")}
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={watch("difficulty")}
              onValueChange={(v) =>
                setValue("difficulty", v as (typeof DIFFICULTIES)[number])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* City & Address */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>City</Label>
            <Select
              value={watch("city")}
              onValueChange={(v) => setValue("city", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
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
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address / Location</Label>
            <Input
              id="address"
              placeholder="e.g., Parco degli Acquedotti"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        {/* Price, Duration, Spots */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Price (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (min)</Label>
            <Input
              id="duration_minutes"
              type="number"
              min="15"
              {...register("duration_minutes", { valueAsNumber: true })}
            />
            {errors.duration_minutes && (
              <p className="text-sm text-destructive">
                {errors.duration_minutes.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="spots_total">Max Spots</Label>
            <Input
              id="spots_total"
              type="number"
              min="1"
              {...register("spots_total", { valueAsNumber: true })}
            />
            {errors.spots_total && (
              <p className="text-sm text-destructive">
                {errors.spots_total.message}
              </p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <Label htmlFor="recurring_schedule">
            Schedule (optional)
          </Label>
          <Input
            id="recurring_schedule"
            placeholder="e.g., Mon, Wed, Fri — 7:00 AM"
            {...register("recurring_schedule")}
          />
        </div>

        {/* What to bring */}
        <div className="space-y-2">
          <Label htmlFor="what_to_bring">
            What to Bring (comma-separated, optional)
          </Label>
          <Input
            id="what_to_bring"
            placeholder="e.g., Yoga mat, Water bottle, Towel"
            {...register("what_to_bring")}
          />
        </div>

        {/* Cancellation policy */}
        <div className="space-y-2">
          <Label htmlFor="cancellation_policy">
            Cancellation Policy (optional)
          </Label>
          <Textarea
            id="cancellation_policy"
            rows={2}
            placeholder="e.g., Free cancellation up to 24 hours before class"
            {...register("cancellation_policy")}
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image_url">Cover Image URL (optional)</Label>
          <Input
            id="image_url"
            placeholder="https://images.unsplash.com/..."
            {...register("image_url")}
          />
          {errors.image_url && (
            <p className="text-sm text-destructive">
              {errors.image_url.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2563EB] hover:bg-[#2563EB]/90"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {isEditing ? "Update Class" : "Create Class"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
