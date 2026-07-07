"use client";

import { Check, Clock, Shield, Star, X } from "lucide-react";
import { VettingCase } from "@/types/vetting-admin";
import { trustOverall } from "../_data/vetting";
import { cn } from "@/lib/utils";

interface VettingStatsProps {
    cases: VettingCase[];
    /** Featured landing-page slot count; defaults to 0 when omitted. */
    featuredCount?: number;
}

export function VettingStats({ cases, featuredCount = 0 }: VettingStatsProps) {
    const count = (status: VettingCase["status"]) =>
        cases.filter((c) => c.status === status).length;

    const avg =
        cases.length > 0
            ? Math.round(
                  cases.reduce((sum, c) => sum + trustOverall(c.trust), 0) / cases.length
              )
            : 0;

    const cards = [
        {
            value: count("pending"),
            label: "Pending review",
            icon: Clock,
            iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        },
        {
            value: count("review"),
            label: "In review",
            icon: Shield,
            iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
            value: count("approved"),
            label: "Approved · live",
            icon: Check,
            iconClass: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
        },
        {
            value: featuredCount,
            label: "Auto-featured (85%+)",
            icon: Star,
            iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        },
        {
            value: count("changes") + count("rejected"),
            label: "Changes / rejected",
            icon: X,
            iconClass: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
        },
        {
            value: avg,
            label: "Avg trust score",
            icon: Star,
            iconClass: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-[14px] border bg-card px-[18px] py-4 shadow-sm"
                >
                    <div
                        className={cn(
                            "mb-2.5 grid h-[34px] w-[34px] place-items-center rounded-[9px]",
                            card.iconClass
                        )}
                    >
                        <card.icon className="h-4 w-4" />
                    </div>
                    <div className="font-display text-[26px] font-extrabold leading-none text-foreground">
                        {card.value}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-muted-foreground">{card.label}</div>
                </div>
            ))}
        </div>
    );
}
