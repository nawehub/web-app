"use client";

import { Button } from "@/components/ui/button";
import { X, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { bottomMenuItems, documentMenuItems, exploreMenuItems } from "@/components/MenuItems";
import { SidebarItem } from "./SidebarItem";
import { useSession } from "next-auth/react";
import { IfAllowed } from "@/components/auth/IfAllowed";
import { isAdmin } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons";

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebarAction: () => void;
    pathname: string;
    isCollapsed: boolean;
    onToggleCollapseAction: () => void;
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

function CollapsedMark() {
    return (
        <Image
            src="/nawehub-mark.png"
            alt="NaWeHub"
            width={36}
            height={40}
            className="h-9 w-auto"
            priority
        />
    );
}

/**
 * Styled identically to SidebarItem (same row height, padding, hover, and
 * focus treatment) so it reads as part of the same family of controls
 * instead of a one-off floating widget — and gets the same icon-only +
 * tooltip behavior as every other item when collapsed.
 */
function CollapseToggleButton({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
    const button = (
        <button
            type="button"
            onClick={onClick}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium text-muted-foreground",
                "transition-colors duration-150 hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed ? "h-10 w-10 justify-center" : "w-full px-3 py-2.5"
            )}
        >
            <span className="shrink-0 [&>svg]:h-5 [&>svg]:w-5">
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </span>
            {!collapsed && <span className="flex-1 truncate text-left">Collapse sidebar</span>}
        </button>
    );

    if (!collapsed) return button;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
                Expand sidebar
            </TooltipContent>
        </Tooltip>
    );
}

export function Sidebar({ isSidebarOpen, toggleSidebarAction, pathname, isCollapsed, onToggleCollapseAction }: SidebarProps) {
    const { data: session } = useSession();
    const user =
        session?.user ?? undefined;

    const allHrefs = [
        ...exploreMenuItems.map((i) => i.href),
        ...documentMenuItems.map((i) => i.href),
        ...bottomMenuItems.map((i) => i.href),
    ].filter(Boolean);

    const bestMatch = getBestMatchHref(pathname, allHrefs);

    const getInitials = () => {
        const first = user?.firstName?.[0] || "";
        const last = user?.lastName?.[0] || "";
        return (first + last).toUpperCase() || "U";
    };

    const renderSidebarContent = (collapsed: boolean, showToggle: boolean) => (
        <div className="flex h-full flex-col">
            {/* Mobile Close Button */}
            <div className="absolute right-3 top-3 z-10 lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebarAction}
                    className="h-10 w-10 hover:bg-muted"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Logo — its own row, no competing elements, same treatment in both states */}
            <div className={cn("flex h-[59px] items-center border-b", collapsed ? "justify-center px-2" : "px-4")}>
                {collapsed ? <CollapsedMark /> : <Logo />}
            </div>

            {/* Collapse toggle — its own dedicated row styled like a nav item, rather than a separate floating widget */}
            {showToggle && (
                <div className={cn("border-b p-3", collapsed && "flex justify-center")}>
                    <CollapseToggleButton collapsed={collapsed} onClick={onToggleCollapseAction} />
                </div>
            )}{/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4" aria-label="Sidebar navigation">
                <div className="space-y-1">
                    {exploreMenuItems.map((item, i) => (
                        <SidebarItem
                            key={i}
                            href={item.href}
                            icon={<item.icon className="h-5 w-5" />}
                            title={item.name}
                            isActive={item.href === bestMatch}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                <IfAllowed anyOf={["funding:create", "full:access"]}>
                    <div className="mt-8">
                        {!collapsed && (
                            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Management
                            </h3>
                        )}
                        {collapsed && <div className="mb-2 h-px bg-border" />}
                        <div className="space-y-1">
                            {documentMenuItems.map((item, i) => (
                                <React.Fragment key={i}>
                                    {item.name === "Partners Request" && isAdmin(user) ? (
                                        <SidebarItem
                                            href={item.href}
                                            icon={<item.icon className="h-5 w-5" />}
                                            title={item.name}
                                            isActive={item.href === bestMatch}
                                            collapsed={collapsed}
                                        />
                                    ) : item.name !== "Partners Request" && (
                                        <SidebarItem
                                            href={item.href}
                                            icon={<item.icon className="h-5 w-5" />}
                                            title={item.name}
                                            isActive={item.href === bestMatch}
                                            collapsed={collapsed}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </IfAllowed>
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto space-y-1 border-t p-3">
                {bottomMenuItems.map((item, i) => (
                    <SidebarItem
                        key={i}
                        href={item.href}
                        icon={<item.icon className="h-5 w-5" />}
                        title={item.name}
                        isActive={item.href === bestMatch}
                        collapsed={collapsed}
                    />
                ))}

                {/* User Profile Card */}
                {collapsed ? (
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <button className="mt-3 flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted">
                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={12}>
                            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted px-3 py-3">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 hidden h-screen flex-col lg:flex",
                    "border-r border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))]/95 backdrop-blur-md z-sticky",
                    "transition-[width] duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64"
                )}
                aria-label="Main sidebar"
            >
                {renderSidebarContent(isCollapsed, true)}
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-modal transition-opacity duration-normal lg:hidden",
                    isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                )}
                aria-hidden={!isSidebarOpen}
            >
                <div
                    className={cn(
                        "absolute inset-0 bg-[hsl(var(--color-neutral-900))]/95 backdrop-blur-sm transition-opacity duration-normal",
                        isSidebarOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={toggleSidebarAction}
                    aria-label="Close sidebar"
                />

                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile sidebar navigation"
                    className={cn(
                        "absolute left-0 top-0 h-[100dvh] w-72",
                        "border-r bg-background shadow-xl",
                        "transform transition-transform duration-slow ease-out",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        const anchor = (e.target as HTMLElement).closest("a[href]");
                        if (anchor) {
                            toggleSidebarAction();
                        }
                    }}
                >
                    {renderSidebarContent(false, false)}
                </aside>
            </div>
        </>
    );
}