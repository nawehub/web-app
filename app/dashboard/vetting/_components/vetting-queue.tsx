"use client";

import { Star } from "lucide-react";
import { EntrepreneurProfile } from "@/app/dashboard/user-settings/_data/profile";
import { VettingCase, VettingFilter } from "@/types/vetting-admin";
import {
    AVATAR_COLORS,
    STATUS_META,
    VETTING_FILTERS,
    initials,
    trustOverall,
} from "../_data/vetting";
import { cn } from "@/lib/utils";

interface VettingQueueProps {
    cases: VettingCase[];
    profiles: Record<string, EntrepreneurProfile>;
    selectedId: string | null;
    filter: VettingFilter;
    /** IDs in landing-page featured slots; defaults to [] when omitted. */
    featuredIds?: string[];
    onFilterChange: (filter: VettingFilter) => void;
    onSelect: (id: string) => void;
}

export function VettingQueue({
    cases,
    profiles,
    selectedId,
    filter,
    featuredIds = [],
    onFilterChange,
    onSelect,
}: VettingQueueProps) {
    return (
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="border-b px-[18px] pb-3 pt-4">
                <h3 className="font-display text-[15px] font-extrabold text-foreground">
                    Vetting queue
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {VETTING_FILTERS.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => onFilterChange(f.key)}
                            className={cn(
                                "rounded-full border px-3 py-1 font-display text-[12.5px] font-semibold transition-colors",
                                filter === f.key
                                    ? "border-primary-600 bg-primary-600 text-white"
                                    : "border-transparent bg-muted/60 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-h-[calc(100vh-280px)] overflow-y-auto lg:max-h-[calc(100vh-230px)]">
                {cases.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                        No cases in this view.
                    </p>
                ) : (
                    cases.map((c) => {
                        const profile = profiles[c.id];
                        const venture = profile?.ventures?.[0];
                        const av = AVATAR_COLORS[c.id] ?? ["#78716b", "#44403a"];
                        const meta = STATUS_META[c.status];
                        const score = trustOverall(c.trust);
                        const isFeatured = featuredIds.includes(c.id);

                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => onSelect(c.id)}
                                className={cn(
                                    "relative flex w-full gap-3 border-b px-[18px] py-3.5 text-left transition-colors hover:bg-muted/40",
                                    selectedId === c.id && "bg-primary/10 hover:bg-primary/10 dark:bg-primary/15"
                                )}
                            >
                                {selectedId === c.id && (
                                    <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-primary-600" />
                                )}
                                <span
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                                    style={{
                                        background: `linear-gradient(135deg, ${av[0]}, ${av[1]})`,
                                    }}
                                >
                                    {initials(profile?.name ?? c.id)}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-1.5 font-display text-sm font-bold text-foreground">
                                        {profile?.name ?? c.id}
                                        {isFeatured && (
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        )}
                                        {c.priority && !isFeatured && (
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        )}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[12.5px] text-muted-foreground">
                                        {venture?.name ?? "—"} · {venture?.sector ?? ""}
                                    </span>
                                    <span className="mt-1.5 flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-0.5 font-display text-[10.5px] font-bold",
                                                meta.pillClass
                                            )}
                                        >
                                            {meta.label}
                                        </span>
                                        <span className="font-display text-[13px] font-extrabold text-primary-700 dark:text-primary-400">
                                            {score}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
