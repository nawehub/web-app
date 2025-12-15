"use client";

import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { bottomMenuItems, documentMenuItems, exploreMenuItems } from "@/components/MenuItems";
import { SidebarItem } from "./SidebarItem";
import { useSession } from "next-auth/react";
import { IfAllowed } from "@/components/auth/IfAllowed";
import Link from "next/link";
import { isAdmin } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/feature-flags";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    pathname: string;
}

const matchesPath = (pathname: string, href: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
};

const getBestMatchHref = (pathname: string, hrefs: string[]) => {
    const candidates = hrefs.filter((h) => matchesPath(pathname, h));
    if (candidates.length === 0) return null;
    return candidates.sort((a, b) => b.length - a.length)[0];
};

export function Sidebar({ isSidebarOpen, toggleSidebar, pathname }: SidebarProps) {
    const { data: session } = useSession();
    const disableAuth = AUTH_DISABLED;
    const user =
        session?.user ??
        (disableAuth
            ? ({
                  firstName: "Dev",
                  lastName: "User",
                  email: "dev@local",
                  role: { name: "admin", permissions: ["full:access"] },
              } as any)
            : undefined);

    const allHrefs = [
        ...exploreMenuItems.map((i) => i.href),
        ...documentMenuItems.map((i) => i.href),
        ...bottomMenuItems.map((i) => i.href),
    ].filter(Boolean);

    const bestMatch = getBestMatchHref(pathname, allHrefs);

    // Get user initials for avatar
    const getInitials = () => {
        const first = user?.firstName?.[0] || "";
        const last = user?.lastName?.[0] || "";
        return (first + last).toUpperCase() || "U";
    };

    const SidebarContent = (
        <div className="flex flex-col h-full">
            {/* Mobile Close Button */}
            <div className="lg:hidden absolute top-3 right-3 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-10 w-10"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Logo */}
            <div className="px-4 py-4 border-b">
                <Link href="/" className="flex items-center justify-center">
                    <img
                        src="/images/wehub-sample-logo.png"
                        alt="NaWeHub Logo"
                        className="h-10 w-auto"
                    />
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sidebar navigation">
                {/* Explore Section */}
                <div className="space-y-1">
                    {exploreMenuItems.map((item, i) => (
                        <SidebarItem
                            key={i}
                            href={item.href}
                            icon={<item.icon className="w-5 h-5" />}
                            title={item.name}
                            isActive={item.href === bestMatch}
                        />
                    ))}
                </div>

                {/* Management Section */}
                <IfAllowed anyOf={["funding:create", "full:access"]}>
                    <div className="mt-8">
                        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Management
                        </h3>
                        <div className="space-y-1">
                            {documentMenuItems.map((item, i) => (
                                <React.Fragment key={i}>
                                    {item.name === "Partners Request" && isAdmin(user) ? (
                                        <SidebarItem
                                            href={item.href}
                                            icon={<item.icon className="w-5 h-5" />}
                                            title={item.name}
                                            isActive={item.href === bestMatch}
                                        />
                                    ) : item.name !== "Partners Request" && (
                                        <SidebarItem
                                            href={item.href}
                                            icon={<item.icon className="w-5 h-5" />}
                                            title={item.name}
                                            isActive={item.href === bestMatch}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </IfAllowed>
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto border-t p-3 space-y-1">
                {bottomMenuItems.map((item, i) => (
                    <SidebarItem
                        key={i}
                        href={item.href}
                        icon={<item.icon className="w-5 h-5" />}
                        title={item.name}
                        isActive={item.href === bestMatch}
                    />
                ))}

                {/* User Profile Card */}
                <div className="mt-3 flex items-center gap-3 px-3 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                        </p>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (always visible) */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col",
                    "fixed top-0 left-0 h-screen w-64",
                    "bg-background border-r z-sticky"
                )}
                aria-label="Main sidebar"
            >
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-modal lg:hidden transition-opacity duration-normal",
                    isSidebarOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                )}
                aria-hidden={!isSidebarOpen}
            >
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-normal",
                        isSidebarOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                />

                {/* Drawer Panel */}
                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile sidebar navigation"
                    className={cn(
                        "absolute top-0 left-0 h-[100dvh] w-72",
                        "bg-background border-r shadow-xl",
                        "transform transition-transform duration-slow ease-out",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        const anchor = (e.target as HTMLElement).closest("a[href]");
                        if (anchor) {
                            toggleSidebar();
                        }
                    }}
                >
                    {SidebarContent}
                </aside>
            </div>
        </>
    );
}
