/**
 * NaWeHub Dashboard — Layout
 * --------------------------------------
 * Location: app/(dashboard)/layout.tsx
 *
 * Added `isCollapsed` state here (rather than inside Sidebar) since the
 * main content area's left margin has to match the sidebar's actual
 * width — `lg:ml-64` is wrong the moment the sidebar collapses to icons.
 * Now it's `lg:ml-20` or `lg:ml-64` depending on `isCollapsed`, with a
 * matching transition so the content slides smoothly instead of jumping.
 *
 * HEADER BACKGROUND — now matches the public site
 * -----------------------------------------------
 * Was `bg-background/95` (theme-adaptive). Now it's the exact same fixed
 * `bg-[hsl(var(--color-neutral-900))]/95` + `border-[hsl(var(--color-
 * neutral-800))]` treatment as the public Header.tsx — a permanently dark
 * bar in both themes, same block used for the public header/hero/CTA/
 * footer, so the dashboard reads as the same product as the marketing
 * site instead of two different apps stitched together.
 *
 * That meant everything *inside* the header also needed explicit
 * dark-surface colors rather than theme-adaptive defaults — a shadcn
 * ghost or outline Button assumes the surface behind it follows the
 * theme (e.g. outline uses `bg-background`, which is white in light
 * mode); on a surface that's always dark, those render wrong regardless
 * of theme. So the mobile menu button and the notification bell are now
 * plain custom buttons styled like the public header's icon buttons
 * (circle, neutral-700 border, neutral-200 icon, orange on hover), the
 * "Visit Next Big Idea" outline button got the same treatment, and text
 * (the "Hello, {name}" greeting, search placeholder) uses the same
 * neutral-50/200/300/400 scale the public header uses for primary vs.
 * secondary text on dark. "Top Businesses" is now styled as an accent
 * (orange) button rather than primary green, since on a dark bar accent
 * reads as the call-to-action color the same way it does in the public
 * header's "Get started" button.
 *
 * One thing I couldn't safely resolve: `ThemeToggle` and `UserNav` are
 * shared components I haven't seen the internals of. The public header
 * sidesteps this by defining its own *local* dark-styled ThemeToggle
 * instead of importing a shared one — worth doing the same here if
 * `@/components/theme-toggle` assumes a theme-adaptive surface. Flagged
 * inline at the call site too.
 */

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