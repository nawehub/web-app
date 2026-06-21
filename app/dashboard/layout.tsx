'use client';

import React, { ReactNode, useState } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search, Home, Briefcase, Heart, BookOpen, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import { UserNav } from "@/components/dashboard/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav, BottomNavSpacer, BottomNavItem } from "@/components/ui/bottom-nav";
import { cn } from "@/lib/utils";

const bottomNavItems: BottomNavItem[] = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Business", href: "/dashboard/my-businesses", icon: Briefcase, matchPartial: true },
    { label: "Next Big Idea", href: "/web/next-bug-idea", icon: Heart },
    { label: "Resources", href: "/dashboard/resources", icon: BookOpen, matchPartial: true },
    { label: "Profile", href: "/dashboard/user-settings", icon: User },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const isMobile = useIsMobile();

    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/web/login");
        },
    });

    if (status === "loading") {
        return <Loading />;
    }

    const user = session?.user ?? undefined;

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebarAction={toggleSidebar}
                pathname={pathname}
                isCollapsed={isCollapsed}
                onToggleCollapseAction={toggleCollapse}
            />

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex min-h-screen flex-col transition-[margin] duration-300 ease-in-out",
                    isCollapsed ? "lg:ml-20" : "lg:ml-64"
                )}
            >
                {/* Top Header — matches the public site's Header.tsx treatment: a fixed
                    warm-near-black bar in both themes (same neutral-900 block used for
                    the public header/hero/CTA/footer), so it reads as a deliberate frame
                    around the theme-adaptive page content below it, rather than just
                    "what the header looks like in dark mode." Every element inside had
                    to be recolored explicitly for a permanently-dark surface rather than
                    relying on shadcn defaults like `text-foreground` or the outline
                    Button variant, which assume the surface itself follows the theme — on
                    a fixed-dark bar, those would render dark-on-dark in light mode. */}
                <header
                    className={cn(
                        "sticky top-0 z-sticky",
                        "border-b border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))]/95 backdrop-blur-md",
                        "px-4 lg:px-6"
                    )}
                >
                    <div className="flex h-16 items-center justify-between">
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                aria-label="Open sidebar menu"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-neutral-700))] text-[hsl(var(--color-neutral-200))] transition-colors hover:border-[hsl(25_95%_53%)] hover:text-[hsl(25_95%_53%)] lg:hidden"
                            >
                                <Menu className="h-4 w-4" />
                            </button>

                            {!isMobile && (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-[hsl(var(--color-neutral-300))]">
                                        Hello, <span className="text-[hsl(var(--color-neutral-50))]">{user?.firstName}!</span>
                                    </span>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--color-neutral-400))]" />
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="w-[280px] rounded-full border-0 bg-[hsl(var(--color-neutral-800))] pl-9 text-[hsl(var(--color-neutral-50))] placeholder:text-[hsl(var(--color-neutral-400))] focus-visible:ring-[hsl(25_95%_53%)] lg:w-[400px]"
                                        />
                                    </div>
                                </div>
                            )}

                            {isMobile && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-accent text-accent-foreground hover:bg-[hsl(var(--color-secondary-400))]"
                                        onClick={() => router.push("/dashboard/top-businesses")}
                                    >
                                        Top Businesses
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex md:gap-2">
                                <Button
                                    size="sm"
                                    className="bg-accent text-accent-foreground hover:bg-[hsl(var(--color-secondary-400))]"
                                    onClick={() => router.push("/dashboard/top-businesses")}
                                >
                                    Top Businesses
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[hsl(var(--color-neutral-700))] bg-transparent text-[hsl(var(--color-neutral-50))] hover:border-[hsl(25_95%_53%)] hover:bg-transparent hover:text-[hsl(25_95%_53%)]"
                                    onClick={() => router.push("/lyd")}
                                >
                                    Visit Next Big Idea
                                </Button>
                            </div>

                            <button
                                type="button"
                                aria-label="Notifications"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-neutral-700))] text-[hsl(var(--color-neutral-200))] transition-colors hover:border-[hsl(25_95%_53%)] hover:text-[hsl(25_95%_53%)]"
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                            </button>

                            <ThemeToggle />
                            <UserNav />
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {isMobile && (
                        <div className="pb-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--color-neutral-400))]" />
                                <Input
                                    type="search"
                                    placeholder="Search resources, businesses..."
                                    className="w-full rounded-full border-0 bg-[hsl(var(--color-neutral-800))] pl-9 text-[hsl(var(--color-neutral-50))] placeholder:text-[hsl(var(--color-neutral-400))] focus-visible:ring-[hsl(25_95%_53%)]"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* Page Content */}
                <main className="flex-1 container mx-auto overflow-y-auto p-4 lg:py-6">{children}</main>

                <BottomNavSpacer />
            </div>

            <BottomNav items={bottomNavItems} />
        </div>
    );
}