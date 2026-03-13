import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Camera,
  MapPin,
  CalendarDays,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_CITIES } from "@/data/mockCities";

const CATEGORIES = [
  "Yoga",
  "HIIT",
  "Pilates",
  "Running",
  "Cycling",
  "Swimming",
  "Boxing",
  "Dance",
  "Bootcamp",
  "Meditation",
];

const profileSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(300, "Bio must be 300 characters or fewer").optional(),
  city: z.string().optional(),
  favorite_categories: z.array(z.string()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-20 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-muted" />
          <div className="h-4 w-56 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="h-32 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      display_name:
        profile?.display_name ?? profile?.full_name ?? "",
      bio: profile?.bio ?? "",
      city: profile?.city ?? "",
      favorite_categories: profile?.favorite_categories ?? [],
    },
  });

  if (loading) return <ProfileSkeleton />;

  const displayName =
    profile?.display_name ?? profile?.full_name ?? user?.email ?? "User";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile({
      display_name: data.display_name,
      bio: data.bio || null,
      city: data.city || null,
      favorite_categories: data.favorite_categories,
    });
    setEditing(false);
  };

  const handleCancel = () => {
    reset();
    setEditing(false);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-1.5 size-3.5" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Avatar + Name header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-20">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-[#2563EB] text-lg text-white">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          {editing && (
            <button
              type="button"
              onClick={() => toast.info("Photo upload coming soon")}
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted hover:bg-muted/80"
              aria-label="Upload photo"
            >
              <Camera className="size-3.5" />
            </button>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {profile?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {profile.city}
              </span>
            )}
            {memberSince && (
              <span className="flex items-center gap-1">
                <CalendarDays className="size-3" />
                Member since {memberSince}
              </span>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  {...register("display_name")}
                  aria-invalid={!!errors.display_name}
                />
                {errors.display_name && (
                  <p className="text-xs text-destructive">
                    {errors.display_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  {...register("bio")}
                  aria-invalid={!!errors.bio}
                />
                {errors.bio && (
                  <p className="text-xs text-destructive">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CITIES.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 font-semibold">Favorite Categories</h3>
            <Controller
              control={control}
              name="favorite_categories"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((cat) => {
                    const checked = field.value.includes(cat);
                    return (
                      <label
                        key={cat}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => {
                            if (c) {
                              field.onChange([...field.value, cat]);
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== cat),
                              );
                            }
                          }}
                        />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="mr-1.5 size-3.5" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Bio */}
          <Card className="p-5">
            <h3 className="mb-2 font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
              {profile?.bio || "No bio yet. Click Edit Profile to add one."}
            </p>
          </Card>

          {/* Favorite Categories */}
          <Card className="p-5">
            <h3 className="mb-3 font-semibold">Favorite Categories</h3>
            {profile?.favorite_categories &&
            profile.favorite_categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.favorite_categories.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No favorites yet. Click Edit Profile to pick some.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
