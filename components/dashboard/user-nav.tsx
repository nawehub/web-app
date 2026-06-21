/**
 * NaWeHub Dashboard — UserNav
 * --------------------------------------
 * Location: components/dashboard/user-nav.tsx
 *
 * Only change: the AvatarFallback now uses `bg-primary/15 text-primary`
 * instead of the shadcn default (a plain muted gray), matching the avatar
 * treatment in the redesigned Sidebar so the same person's initials look
 * the same color in both places. Everything else — the AUTH_DISABLED dev
 * escape hatch, signOut flow, dropdown structure — is untouched.
 */

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
import { signOut, useSession } from "next-auth/react";

export function UserNav() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user ?? undefined;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/web/login' }).then()
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
                {(user?.firstName?.slice(0, 1) ?? "D")}
                {(user?.lastName?.slice(0, 1) ?? "U")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-10" align="end" forceMount>
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
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}