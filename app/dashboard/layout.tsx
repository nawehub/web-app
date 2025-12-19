'use client';

import React, { ReactNode, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Bell,
    Menu,
    Search,
    Home,
    Briefcase,
    Heart,
    BookOpen,
    User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { UserNav } from "@/components/dashboard/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav, BottomNavSpacer, BottomNavItem } from "@/components/ui/bottom-nav";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/feature-flags";

// Bottom navigation items for mobile
const bottomNavItems: BottomNavItem[] = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Business", href: "/dashboard/my-businesses", icon: Briefcase, matchPartial: true },
    { label: "LYD", href: "/lyd", icon: Heart },
    { label: "Resources", href: "/dashboard/resources", icon: BookOpen, matchPartial: true },
    { label: "Profile", href: "/dashboard/user-settings", icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const isMobile = useIsMobile();

    // Dev-only escape hatch: allow viewing dashboard locally without auth.
    // Set `NEXT_PUBLIC_DISABLE_AUTH=true` in your env when running `npm run dev`.
    const disableAuth = AUTH_DISABLED;

    const { data: session, status } = useSession(
        disableAuth
            ? undefined
            : {
                  required: true,
                  onUnauthenticated() {
                      redirect("/login");
                  },
              }
    );

    const user =
        session?.user ??
        (disableAuth
            ? ({
                  id: "dev-user",
                  firstName: "Dev",
                  lastName: "User",
                  name: "Dev User",
                  email: "dev@local",
              } as any)
            : undefined);

    if (!disableAuth && status === "loading") {
        return <Loading />;
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                pathname={pathname}
            />

            {/* Main Content Area */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                {/* Top Header */}
                <header
                    className={cn(
                        "sticky top-0 z-sticky",
                        "bg-background/95 backdrop-blur-md border-b",
                        "px-4 lg:px-6"
                    )}
                >
                    <div className="flex items-center justify-between h-16">
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSidebar}
                                className="lg:hidden h-10 w-10"
                                aria-label="Open sidebar menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            {/* Greeting & Search (Desktop) */}
                            {!isMobile && (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Hello, <span className="text-foreground">{user?.firstName}!</span>
                                    </span>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="pl-9 w-[280px] lg:w-[400px] rounded-full bg-neutral-100 dark:bg-neutral-800 border-0"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Mobile Quick Actions */}
                            {isMobile && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => router.push("/dashboard/top-businesses")}
                                    >
                                        Top Businesses
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            {/* Desktop CTAs */}
                            <div className="hidden md:flex md:gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => router.push("/dashboard/top-businesses")}
                                >
                                    Top Businesses
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/lyd")}
                                >
                                    Contribute to LYD
                                </Button>
                            </div>

                            {/* Notifications (placeholder) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-10 w-10"
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {/* Notification badge */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                            </Button>

                            <ThemeToggle />
                            <UserNav />
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {isMobile && (
                        <div className="pb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search resources, businesses..."
                                    className="pl-9 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 border-0"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                    {children}
                </main>

                {/* Bottom Navigation Spacer (Mobile) */}
                <BottomNavSpacer />
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav items={bottomNavItems} />
        </div>
    );
}
