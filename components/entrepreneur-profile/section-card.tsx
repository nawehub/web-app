"use client";

import { ReactNode } from "react";
import { Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
    title: ReactNode;
    /** Section visibility key — when provided shows the public/private toggle. */
    isPublic?: boolean;
    onToggleVisibility?: () => void;
    onEdit?: () => void;
    /** Hide the section entirely (used by public preview mode for private sections). */
    hidden?: boolean;
    /** Dim the card to signal it's private (owner editing view). */
    children: ReactNode;
    className?: string;
}

/**
 * Shared scaffold for every editable profile section: a header with the
 * title, an optional edit button and a public/private visibility toggle,
 * plus a body slot. Mirrors the `.sec` card from the design.
 */
export function SectionCard({
    title,
    isPublic,
    onToggleVisibility,
    onEdit,
    hidden,
    children,
    className,
}: SectionCardProps) {
    const showToggle = typeof isPublic === "boolean" && !!onToggleVisibility;

    return (
        <section
            className={cn(
                "rounded-xl border bg-card shadow-sm transition-opacity",
                showToggle && !isPublic && "opacity-70",
                hidden && "hidden",
                className
            )}
        >
            <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
                <h2 className="flex-1 text-lg font-bold font-display tracking-tight">{title}</h2>
                <div className="flex items-center gap-1.5">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            title="Edit section"
                            aria-label="Edit section"
                            className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground transition-colors hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                    {showToggle && (
                        <VisibilityToggle isPublic={!!isPublic} onToggleAction={onToggleVisibility!} />
                    )}
                </div>
            </div>
            <div className="px-5 pb-6 pt-4 sm:px-6">{children}</div>
        </section>
    );
}

export function VisibilityToggle({
    isPublic,
    onToggleAction,
}: {
    isPublic: boolean;
    onToggleAction: () => void;
}) {
    return (
        // A plain <button> wrapping a custom visual track — we deliberately avoid
        // the Radix <Switch> here because it renders its own <button>, and a
        // button-in-button is invalid HTML (hydration error).
        <button
            type="button"
            onClick={onToggleAction}
            role="switch"
            aria-checked={isPublic}
            aria-label="Section visibility"
            title="Toggle who can see this section"
            className="flex items-center gap-2 rounded-full py-1 pl-2.5 pr-1"
        >
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 font-display text-xs font-semibold",
                    isPublic ? "text-primary-700" : "text-muted-foreground"
                )}
            >
                {isPublic ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {isPublic ? "Public" : "Private"}
            </span>
            <span
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                    isPublic ? "bg-primary" : "bg-input"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-background shadow-lg transition-transform",
                        isPublic ? "translate-x-5" : "translate-x-0.5"
                    )}
                />
            </span>
        </button>
    );
}

/** Dashed "add" prompt shown when a section/list is empty (owner-only). */
export function AddPrompt({
    label,
    onClick,
    compact,
}: {
    label: string;
    onClick?: () => void;
    compact?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-dashed bg-muted/60 font-display text-sm font-semibold text-muted-foreground transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700",
                compact ? "p-3" : "p-4"
            )}
        >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border bg-card text-primary-600">
                <Plus className="h-4 w-4" />
            </span>
            {label}
        </button>
    );
}

/** Small uppercase sub-heading used inside grouped sections. */
export function SubHead({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p
            className={cn(
                "mb-2.5 mt-4 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground first:mt-0",
                className
            )}
        >
            {children}
        </p>
    );
}

/** Private flag pill shown on owner-only sections. */
export function PrivateFlag({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-display text-[11px] font-semibold text-muted-foreground">
            <EyeOff className="h-3 w-3" />
            {children}
        </span>
    );
}
