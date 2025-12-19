"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import { AUTH_DISABLED } from "@/lib/feature-flags";

export function UserNav() {
  const router = useRouter();
  const { data: session } = useSession();

  // Dev-only escape hatch: show dashboard UI without a session.
  const disableAuth = AUTH_DISABLED;
  const user =
      session?.user ??
      (disableAuth
          ? ({
                firstName: "Dev",
                lastName: "User",
                name: "Dev User",
                email: "dev@local",
            } as any)
          : undefined);
  
  const handleSignOut = () => {
    if (disableAuth) return;
    signOut({ callbackUrl: '/login' }).then()
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback>
              {(user?.firstName?.slice(0, 1) ?? "D")}
              {(user?.lastName?.slice(0, 1) ?? "U")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/dashboard/user-settings")}>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {disableAuth ? (
          <DropdownMenuItem disabled>Auth disabled (dev)</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}