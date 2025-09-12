// OpportunitiesGrid.tsx
import React from "react";
import type {FundingOpportunityDto} from "@/types/funding"; // adjust import to your path
import {AnimatePresence, motion} from "framer-motion";
import {ArrowRight, CalendarDays, Eye, Landmark, Star,} from "lucide-react";
import clsx from "clsx";
import {useListOpportunitiesQuery} from "@/hooks/repository/use-funding";
import {filterType} from "@/lib/services/funding";

/* Lightweight local UI primitives (replace with your design system if desired) */
function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "outline" | "ghost";
        size?: "sm" | "md";
    }
) {
    const {variant = "primary", size = "md", className, ...rest} = props;
    return (
        <button
            {...rest}
            className={clsx(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                "focus:ring-emerald-600 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                variant === "primary" &&
                "bg-emerald-600 text-white hover:bg-emerald-700",
                variant === "outline" &&
                "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-slate-800",
                size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4",
                className
            )}
        />
    );
}

function Badge(
    props: React.HTMLAttributes<HTMLSpanElement> & {
        variant?: "success" | "warning" | "error" | "neutral" | "featured";
    }
) {
    const {variant = "neutral", className, ...rest} = props;
    return (
        <span
            {...rest}
            className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                // light
                variant === "success" && "bg-green-50 text-green-700 border-green-200",
                variant === "warning" &&
                "bg-yellow-50 text-yellow-700 border-yellow-200",
                variant === "error" && "bg-red-50 text-red-700 border-red-200",
                variant === "neutral" &&
                "bg-slate-50 text-slate-700 border-slate-200",
                variant === "featured" &&
                "bg-amber-50 text-amber-800 border-amber-200",
                // dark
                variant === "success" &&
                "dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                variant === "warning" &&
                "dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                variant === "error" &&
                "dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                variant === "neutral" &&
                "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                variant === "featured" &&
                "dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                className
            )}
        />
    );
}

/* Helpers */
function formatCurrencyRange(min: number, max: number) {
    const fmt = (v: number) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(v);
    if (min && max && min !== max) return `${fmt(min)} - ${fmt(max)}`;
    return fmt(max || min || 0);
}

function daysUntil(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    return Math.ceil(
        (d.getTime() - new Date(now.toDateString()).getTime()) / (1000 * 60 * 60 * 24)
    );
}

function statusVariant(state?: string) {
    const s = (state || "").toLowerCase();
    if (["approved", "active", "open"].includes(s)) return "success" as const;
    if (["pending", "review", "awaiting"].includes(s)) return "warning" as const;
    if (["rejected", "closed"].includes(s)) return "error" as const;
    return "neutral" as const;
}

export type OpportunitiesGridProps = {
    viewType: filterType;
    onView?: (opportunity: FundingOpportunityDto) => void;
    onApply?: (opportunity: FundingOpportunityDto) => void;
    showApply?: boolean;
    emptyState?: React.ReactNode;
    titles?: {
        featured?: string;
        others?: string;
    };
    // Show/hide sections explicitly
    showSections?: {
        featured?: boolean;
        others?: boolean;
    };

};

export function OpportunitiesGrid({
                                      viewType, onView, onApply, showApply = false, emptyState,
                                      titles = {
                                          featured: "Featured Opportunities",
                                          others: "All Opportunities",
                                      },
                                      showSections = {
                                          featured: true,
                                          others: true,
                                      },

                                  }: OpportunitiesGridProps) {
    const {data, isLoading: loading} = useListOpportunitiesQuery(viewType)
    const featured = (data?.opportunities || []).filter((o) => o.isFeatured);
    const others = (data?.opportunities || [])
        .filter((o) => !o.isFeatured)
        .sort(
            (a, b) =>
                new Date(a.applicationDeadline).getTime() -
                new Date(b.applicationDeadline).getTime()
        );

    const renderCard = (opp: FundingOpportunityDto, idx: number) => {
        const deadlineDays = daysUntil(opp.applicationDeadline);
        const statusV = statusVariant(opp.status?.state);

        return (
            <motion.div
                key={opp.id}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.2, delay: idx * 0.02}}
                whileHover={{y: -4}}
                className={clsx(
                    "group relative flex h-full flex-col overflow-hidden rounded-xl border-2 p-5",
                    "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-lg",
                    "dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900/40"
                )}
            >
                {/* Featured glyph */}
                {opp.isFeatured && (
                    <div className="absolute right-3 top-3">
                        <Badge variant="featured">
                            <Star className="h-3.5 w-3.5"/>
                            Featured
                        </Badge>
                    </div>
                )}

                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                            {opp.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Landmark className="h-3.5 w-3.5"/>
                            <span className="truncate">
                {opp.provider?.name ?? "Unknown provider"}
              </span>
                        </div>
                    </div>

                    <Badge variant={statusV}>
                        <span className="capitalize">{opp.status?.state || "Status"}</span>
                    </Badge>
                </div>

                {/* Body */}
                <div className="space-y-3">
                    <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-200">
                        {opp.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md border px-2 py-1 text-slate-700 dark:text-slate-200 dark:border-slate-700">
              {formatCurrencyRange(opp.amountMin, opp.amountMax)}
            </span>
                        <span
                            className={clsx(
                                "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-slate-700 dark:text-slate-200 dark:border-slate-700",
                                deadlineDays <= 7 &&
                                "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                            )}
                            title={new Date(opp.applicationDeadline).toLocaleString()}
                        >
              <CalendarDays className="h-4 w-4"/>
                            {deadlineDays > 0
                                ? `${deadlineDays} day${deadlineDays === 1 ? "" : "s"} left`
                                : deadlineDays === 0
                                    ? "Deadline today"
                                    : "Closed"}
            </span>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView?.(opp)}>
                        <Eye className="mr-1 h-4 w-4"/>
                        View Opportunity
                    </Button>
                    {showApply && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                                onApply ? onApply(opp) : window.open(opp.applyLink, "_blank", "noopener")
                            }
                        >
                            Apply
                            <ArrowRight className="ml-1 h-4 w-4"/>
                        </Button>
                    )}
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({length: 3}).map((_, i) => (
                    <div
                        key={i}
                        className="h-44 animate-pulse rounded-xl border-2 border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40"
                    />
                ))}
            </div>
        );
    }

    if (!loading && data?.count === 0) {
        return (
            (emptyState ?? (
                <div
                    className="rounded-lg border p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    No funding opportunities found
                </div>
            ))
        );
    }

    return (
        <div className="space-y-8">
            {/* Featured Section */}
            {showSections.featured && featured.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {titles.featured}
                        </h2>
                        <Badge variant="featured" className="hidden sm:inline-flex">
                            <Star className="h-3.5 w-3.5"/>
                            {featured.length} Featured
                        </Badge>
                    </div>
                    <AnimatePresence>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured
                                .sort(
                                    (a, b) =>
                                        new Date(a.applicationDeadline).getTime() -
                                        new Date(b.applicationDeadline).getTime()
                                )
                                .map((opp, idx) => renderCard(opp, idx))}
                        </div>
                    </AnimatePresence>
                </section>
            )}

            {/* Others Section */}
            {showSections.others && others.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {titles.others}
                        </h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
              {others.length} items
            </span>
                    </div>
                    <AnimatePresence>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {others.map((opp, idx) => renderCard(opp, idx))}
                        </div>
                    </AnimatePresence>
                </section>
            )}
        </div>
    );

}