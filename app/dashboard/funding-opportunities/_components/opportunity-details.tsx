// OpportunityDetails.tsx
import React from "react";
import type { FundingOpportunityDto } from "@/lib/types/funding"; // adjust import path
import { motion } from "framer-motion";
import { CalendarDays, Landmark, Star, ExternalLink, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import clsx from "clsx";

type BadgeVariant = "success" | "warning" | "error" | "neutral" | "featured";

function Badge(
    props: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }
) {
    const { variant = "neutral", className, ...rest } = props;
    return (
        <span
            {...rest}
            className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                // light
                variant === "success" && "bg-green-50 text-green-700 border-green-200",
                variant === "warning" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                variant === "error" && "bg-red-50 text-red-700 border-red-200",
                variant === "neutral" && "bg-slate-50 text-slate-700 border-slate-200",
                variant === "featured" && "bg-amber-50 text-amber-800 border-amber-200",
                // dark
                variant === "success" && "dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                variant === "warning" && "dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                variant === "error" && "dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                variant === "neutral" && "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                variant === "featured" && "dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                className
            )}
        />
    );
}

function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "outline" | "ghost" | "danger";
        size?: "sm" | "md";
    }
) {
    const { variant = "primary", size = "md", className, ...rest } = props;
    return (
        <button
            {...rest}
            className={clsx(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                "focus:ring-emerald-600 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                variant === "primary" && "bg-emerald-600 text-white hover:bg-emerald-700",
                variant === "outline" && "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-slate-800",
                variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
                size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4",
                className
            )}
        />
    );
}

function formatCurrencyRange(min: number, max: number, currency = "USD") {
    const fmt = (v: number) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(v);
    if (min && max && min !== max) return `${fmt(min)} - ${fmt(max)}`;
    return fmt(max || min || 0);
}

function daysUntil(date: Date | string) {
    const d = new Date(date);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return Math.ceil((d.getTime() - startOfToday) / (1000 * 60 * 60 * 24));
}

function statusVariant(state?: string): Exclude<BadgeVariant, "featured"> {
    const s = (state || "").toLowerCase();
    if (["approved", "active", "open"].includes(s)) return "success";
    if (["pending", "review", "awaiting"].includes(s)) return "warning";
    if (["rejected", "closed"].includes(s)) return "error";
    return "neutral";
}

export type OpportunityDetailsProps = {
    opportunity: FundingOpportunityDto;
    onApply?: (opportunity: FundingOpportunityDto) => void;
    onApprove?: (opportunity: FundingOpportunityDto) => void;
    onReject?: (opportunity: FundingOpportunityDto) => void;
    // If you want to control how "about" HTML is rendered, pass sanitized HTML here
    sanitizedAboutHTML?: string;
};

export function OpportunityDetails({
                                       opportunity,
                                       onApply,
                                       onApprove,
                                       onReject,
                                       sanitizedAboutHTML,
                                   }: OpportunityDetailsProps) {
    const variant = statusVariant(opportunity.status?.state);
    const deadlineDays = daysUntil(opportunity.applicationDeadline);

    // Fallback: if sanitizedAboutHTML not provided, we render raw.
    // Prefer to sanitize HTML upstream.
    const aboutHTML = sanitizedAboutHTML ?? opportunity.about;

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border-2 border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            {opportunity.isFeatured && (
                                <Badge variant="featured" title="Featured opportunity">
                                    <Star className="h-3.5 w-3.5" /> Featured
                                </Badge>
                            )}
                            <Badge variant={variant}>
                                <span className="capitalize">{opportunity.status?.state || "Status"}</span>
                            </Badge>
                        </div>
                        <h1 className="mt-2 truncate text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {opportunity.title}
                        </h1>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-4 w-4" />
                  {opportunity.provider?.name ?? "Unknown provider"}
              </span>
                            <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                                {deadlineDays > 0
                                    ? `${deadlineDays} day${deadlineDays === 1 ? "" : "s"} left`
                                    : deadlineDays === 0
                                        ? "Deadline today"
                                        : "Closed"}
              </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() =>
                                onApply
                                    ? onApply(opportunity)
                                    : window.open(opportunity.applyLink, "_blank", "noopener")
                            }
                            title="Apply on provider site"
                        >
                            Apply
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => onApprove?.(opportunity)}
                            title="Approve"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => onReject?.(opportunity)}
                            title="Reject"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                    </div>
                </div>

                {/* Quick facts */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-3 text-sm dark:border-slate-800">
                        <div className="text-slate-500 dark:text-slate-400">Funding Range</div>
                        <div className="mt-1 font-semibold">
                            {formatCurrencyRange(opportunity.amountMin, opportunity.amountMax)}
                        </div>
                    </div>
                    <div className="rounded-lg border p-3 text-sm dark:border-slate-800">
                        <div className="text-slate-500 dark:text-slate-400">Deadline</div>
                        <div className="mt-1 font-semibold">
                            {new Date(opportunity.applicationDeadline).toLocaleString()}
                        </div>
                    </div>
                    <div className="rounded-lg border p-3 text-sm dark:border-slate-800">
                        <div className="text-slate-500 dark:text-slate-400">Provider</div>
                        <div className="mt-1 font-semibold">{opportunity.provider?.name ?? "N/A"}</div>
                    </div>
                </div>
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="rounded-xl border-2 border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Overview</h2>
                <p className="mt-2 text-slate-700 dark:text-slate-200">{opportunity.description}</p>
            </motion.div>

            {/* Rich text About */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="rounded-xl border-2 border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">About</h2>

                {/* Render rich text (sanitize upstream if needed) */}
                <div
                    className="prose prose-slate mt-3 max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: aboutHTML }}
                />
            </motion.div>
        </div>
    );
}