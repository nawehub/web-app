import Link from "next/link";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import React from "react";

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
}

export function SidebarItem({href, icon, title, isActive}: SidebarItemProps) {
    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-primary font-medium text-primary-foreground dark:text-white"
                )}
            >
                {icon}
                {title}
            </Button>
        </Link>
    );
}