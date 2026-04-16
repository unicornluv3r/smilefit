import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, User, Calendar, LayoutDashboard, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const { t } = useTranslation();

  const fullName =
    profile?.display_name ??
    profile?.full_name ??
    (user?.user_metadata?.full_name as string) ??
    user?.email ??
    "User";
  const role =
    profile?.role ?? (user?.user_metadata?.role as string | undefined);
  const initials = getInitials(fullName);
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
            <AvatarFallback className="bg-[#2563EB] text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{fullName}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User className="mr-2 size-4" />
            {t("userMenu.myProfile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/bookings">
            <Calendar className="mr-2 size-4" />
            {t("userMenu.myBookings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {role === "instructor" ? (
          <DropdownMenuItem asChild>
            <Link to="/instructor/dashboard">
              <LayoutDashboard className="mr-2 size-4" />
              {t("userMenu.instructorDashboard")}
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/become-instructor">
              <GraduationCap className="mr-2 size-4" />
              {t("userMenu.becomeInstructor")}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOut className="mr-2 size-4" />
          {t("userMenu.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
