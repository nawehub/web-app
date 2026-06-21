/**
 * NaWeHub Dashboard — SidebarItem
 * --------------------------------------
 * Location: components/dashboard/SidebarItem.tsx
 *
 * Added a `collapsed` prop. When true: the label and badge text are hidden,
 * the item becomes a centered icon-only square, and the title is wrapped in
 * a Tooltip that appears on hover (positioned to the right, since the
 * sidebar lives on the left edge). Assumes a standard shadcn
 * Tooltip/TooltipTrigger/TooltipContent API at @/components/ui/tooltip —
 * reasonable since TooltipProvider is already used in the dashboard page,
 * so a TooltipProvider is presumably already wrapping the app somewhere
 * higher up (root layout or similar). If not, wrap DashboardLayout's
 * returned tree in <TooltipProvider> once, rather than per-item here.
 *
 * Badge handling when collapsed: rather than hide it entirely, it becomes a
 * small dot in the corner of the icon — keeps the "you have something here"
 * signal without needing room for the number.
 */

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    badge?: number;
    collapsed?: boolean;
}

export function SidebarItem({ href, icon, title, isActive, badge, collapsed }: SidebarItemProps) {
    const hasBadge = badge !== undefined && badge > 0;

    const link = (
        <Link
            href={href}
            className={cn(
                "relative flex items-center gap-3 rounded-lg text-sm font-medium",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed ? "h-10 w-10 justify-center" : "px-3 py-2.5",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
        >
            <span
                className={cn(
                    "shrink-0 transition-colors [&>svg]:h-5 [&>svg]:w-5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
            >
                {icon}
            </span>

            {!collapsed && <span className="flex-1 truncate">{title}</span>}

            {!collapsed && hasBadge && (
                <span
                    className={cn(
                        "flex h-5 min-w-[20px] shrink-0 items-center justify-center px-1.5",
                        "rounded-full text-[10px] font-bold",
                        isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                    )}
                >
                    {badge > 99 ? "99+" : badge}
                </span>
            )}

            {collapsed && hasBadge && (
                <span
                    className={cn(
                        "absolute right-1 top-1 h-2 w-2 rounded-full",
                        isActive ? "bg-primary-foreground" : "bg-accent"
                    )}
                />
            )}
        </Link>
    );

    if (!collapsed) return link;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
                {title}
                {hasBadge && <span className="ml-1.5 text-muted-foreground">({badge > 99 ? "99+" : badge})</span>}
            </TooltipContent>
        </Tooltip>
    );
}