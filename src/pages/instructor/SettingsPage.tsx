import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Save,
  Bell,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function SettingsPage() {
  const { profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [instagram, setInstagram] = useState(profile?.instagram_handle ?? "");
  const [website, setWebsite] = useState(profile?.website_url ?? "");
  const [specialties, setSpecialties] = useState(
    (profile?.specialties ?? []).join(", "),
  );
  const [certifications, setCertifications] = useState(
    (profile?.certifications ?? []).join(", "),
  );
  const [saving, setSaving] = useState(false);

  // Notification prefs (local state only — no backend yet)
  const [notifyBooking, setNotifyBooking] = useState(true);
  const [notifyCancellation, setNotifyCancellation] = useState(true);
  const [notifyReview, setNotifyReview] = useState(true);

  const initials = (profile?.full_name ?? "I")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName || null,
        bio: bio || null,
        city: city || null,
        instagram_handle: instagram || null,
        website_url: website || null,
        specialties: specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: certifications
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } catch {
      // error toast already handled by AuthContext
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-[#2563EB]/10 text-[#2563EB] text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.full_name ?? "Instructor"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell students about yourself..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma-separated)</Label>
              <Input
                id="specialties"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="Yoga, Pilates, HIIT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certs">Certifications (comma-separated)</Label>
              <Input
                id="certs"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="RYT-200, ACE CPT"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
              disabled={saving}
              onClick={handleSave}
            >
              <Save className="mr-1.5 size-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/instructors/${profile?.id ?? ""}`}>
                <ExternalLink className="mr-1.5 size-4" />
                View Public Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotifRow
            label="New bookings"
            description="Get emailed when a student books your class"
            checked={notifyBooking}
            onCheckedChange={setNotifyBooking}
          />
          <Separator />
          <NotifRow
            label="Cancellations"
            description="Get emailed when a student cancels a booking"
            checked={notifyCancellation}
            onCheckedChange={setNotifyCancellation}
          />
          <Separator />
          <NotifRow
            label="New reviews"
            description="Get emailed when a student leaves a review"
            checked={notifyReview}
            onCheckedChange={setNotifyReview}
          />
        </CardContent>
      </Card>

      {/* Payout settings placeholder */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Payout Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Stripe Connect integration coming soon. You&apos;ll be able to manage
            your bank account and payout schedule here.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() =>
              toast.info("Coming soon — Stripe integration in progress")
            }
          >
            Set Up Payouts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function NotifRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
