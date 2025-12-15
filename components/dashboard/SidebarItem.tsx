"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
    badge?: number;
}

export function SidebarItem({ href, icon, title, isActive, badge }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                "transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
            aria-current={isActive ? "page" : undefined}
        >
            <span className={cn(
                "shrink-0 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
            )}>
                {icon}
            </span>
            <span className="truncate flex-1">{title}</span>
            {badge !== undefined && badge > 0 && (
                <span
                    className={cn(
                        "shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center",
                        "text-[10px] font-bold rounded-full",
                        isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                    )}
                >
                    {badge > 99 ? "99+" : badge}
                </span>
            )}
        </Link>
    );
}
