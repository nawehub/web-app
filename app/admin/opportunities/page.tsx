"use client";

import { useMemo, useState } from "react";
import {
    Award,
    CalendarDays,
    Check,
    Clock,
    Eye,
    ExternalLink,
    Hourglass,
    Pencil,
    Plus,
    Rocket,
    Search,
    Sparkles,
    Star,
    Trash2,
    Trophy,
    X,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { daysLeft, deadlineText, deadlineTone, shadeColor } from "@/lib/opportunities";
import {
    Opportunity,
    OpportunityType,
    OPPORTUNITY_TYPES,
} from "@/types/opportunities";
import {
    OPPORTUNITY_ADMIN_FILTERS,
    OpportunityAdminFilter,
    useOpportunitiesAdmin,
} from "./_data/use-opportunities-admin";
import { OpportunityFormDialog } from "./_components/opportunity-form-dialog";

const TYPE_ICON: Record<OpportunityType, LucideIcon> = {
    grant: Sparkles,
    competition: Trophy,
    event: CalendarDays,
    accelerator: Rocket,
    fellowship: Award,
};

const DEADLINE_TEXT_CLASS: Record<ReturnType<typeof deadlineTone>, string> = {
    soon: "text-accent",
    ok: "text-muted-foreground",
    closed: "text-destructive",
};

export default function AdminOpportunitiesPage() {
    const {
        opps,
        hydrated,
        create,
        update,
        remove,
        toggleFeatured,
        approve,
        reject,
        reset,
    } = useOpportunitiesAdmin();

    const [filter, setFilter] = useState<OpportunityAdminFilter>("all");
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Opportunity | null>(null);

    const stats = useMemo(() => {
        const open = opps.filter((o) => o.open).length;
        const featured = opps.filter((o) => o.featured).length;
        const pending = opps.filter((o) => o.status === "pending").length;
        const soon = opps.filter((o) => o.open && daysLeft(o.deadline) <= 30).length;
        return { total: opps.length, open, featured, pending, soon };
    }, [opps]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return opps.filter((o) => {
            if (filter === "pending" && o.status !== "pending") return false;
            else if (filter === "featured" && !o.featured) return false;
            else if (filter === "closed" && o.open) return false;
            else if (
                !["all", "pending", "featured", "closed"].includes(filter) &&
                o.type !== filter
            )
                return false;
            if (q && !(o.title + o.org + o.summary).toLowerCase().includes(q))
                return false;
            return true;
        });
    }, [opps, filter, search]);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (o: Opportunity) => {
        setEditing(o);
        setDialogOpen(true);
    };

    const handleSubmit = (opp: Opportunity, mode: "create" | "edit") => {
        if (mode === "edit") {
            update(opp);
            toast.success("Opportunity updated");
        } else {
            create(opp);
            toast.success("Opportunity posted — now live");
        }
        setDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        const o = opps.find((x) => x.id === id);
        if (!o) return;
        if (
            !window.confirm(
                `Delete “${o.title}”? This removes it from the public Opportunities page.`
            )
        )
            return;
        remove(id);
        setDialogOpen(false);
        toast.success("Opportunity deleted");
    };

    const handleToggleFeatured = (id: string) => {
        const result = toggleFeatured(id);
        if (result === null) {
            toast.error("Re-open the listing before featuring");
            return;
        }
        toast.success(
            result ? "Featured on Opportunities page" : "Removed from featured"
        );
    };

    const handleApprove = (id: string) => {
        approve(id);
        toast.success("Approved — now live on the Opportunities page");
    };

    const handleReject = (id: string) => {
        const o = opps.find((x) => x.id === id);
        if (o && !window.confirm(`Reject “${o.title}”? It won't appear publicly.`)) return;
        reject(id);
        toast.success("Submission rejected");
    };

    const handleReset = () => {
        if (
            window.confirm(
                "Reset opportunities to the original sample listings? Your changes will be cleared."
            )
        ) {
            reset();
            setFilter("all");
            setSearch("");
            toast.success("Reset to sample listings");
        }
    };

    const statCards = [
        { value: stats.total, label: "Total listings", icon: Eye, tone: "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]" },
        { value: stats.pending, label: "Pending review", icon: Hourglass, tone: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]" },
        { value: stats.open, label: "Open now", icon: Clock, tone: "bg-primary/15 text-primary" },
        { value: stats.featured, label: "Featured", icon: Star, tone: "bg-[hsl(25_95%_53%/0.15)] text-accent" },
        { value: stats.soon, label: "Closing ≤30 days", icon: CalendarDays, tone: "bg-muted text-muted-foreground" },
    ];

    return (
        <div className="mx-auto max-w-[1440px] px-4 py-5 lg:px-6 lg:py-6">
            {/* Header */}
            <div className="flex flex-wrap items-start gap-4">
                <div>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]">
                        Opportunities
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Post and manage the grants, competitions, events and programmes shown to
                        entrepreneurs.
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2.5">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/web/opportunities" target="_blank">
                            <ExternalLink className="h-4 w-4" /> View public page
                        </Link>
                    </Button>
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Post opportunity
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-5">
                {statCards.map((c) => (
                    <div
                        key={c.label}
                        className="rounded-2xl border bg-card p-4 shadow-sm"
                    >
                        <span
                            className={cn(
                                "mb-3 grid h-[34px] w-[34px] place-items-center rounded-[9px]",
                                c.tone
                            )}
                        >
                            <c.icon className="h-[18px] w-[18px]" />
                        </span>
                        <div className="font-display text-[26px] font-extrabold tracking-tight text-foreground">
                            {hydrated ? c.value : "—"}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                            {c.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] max-w-[380px] flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title or organisation…"
                        className="h-11 w-full rounded-[10px] border border-input bg-card pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {OPPORTUNITY_ADMIN_FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setFilter(key)}
                            className={cn(
                                "rounded-full border px-3.5 py-2 font-display text-[12.5px] font-semibold transition-colors",
                                filter === key
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={handleReset}
                >
                    Reset to samples
                </Button>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
                {visible.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <span className="mx-auto mb-3 grid h-[52px] w-[52px] place-items-center rounded-[14px] bg-muted text-muted-foreground">
                            <CalendarDays className="h-6 w-6" />
                        </span>
                        <h3 className="font-display text-base font-bold text-foreground">
                            No opportunities here
                        </h3>
                        <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                            Try a different filter, or post a new opportunity.
                        </p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-muted/60">
                                <Th>Opportunity</Th>
                                <Th>Type</Th>
                                <Th className="hidden md:table-cell">Funding</Th>
                                <Th>Deadline</Th>
                                <Th>Status</Th>
                                <Th className="text-right">Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((o) => {
                                const Icon = TYPE_ICON[o.type];
                                const tone = deadlineTone(o);
                                return (
                                    <tr
                                        key={o.id}
                                        className="border-t transition-colors hover:bg-muted/40"
                                    >
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] font-display text-base font-extrabold text-white"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${o.c1}, ${shadeColor(o.c1)})`,
                                                    }}
                                                >
                                                    {o.logo || o.title.slice(0, 1)}
                                                </span>
                                                <div className="min-w-0">
                                                    <b className="block max-w-[260px] truncate font-display text-sm font-bold text-foreground">
                                                        {o.title}
                                                    </b>
                                                    <span className="text-xs text-muted-foreground">
                                                        {o.org}
                                                    </span>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td>
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11.5px] font-bold",
                                                    OPPORTUNITY_TYPES[o.type].chipClass
                                                )}
                                            >
                                                <Icon className="h-3.5 w-3.5" />
                                                {OPPORTUNITY_TYPES[o.type].label}
                                            </span>
                                        </Td>
                                        <Td className="hidden md:table-cell">
                                            {o.amount || "—"}
                                        </Td>
                                        <Td>
                                            <span className="font-display font-semibold text-foreground">
                                                {o.deadlineLabel || "—"}
                                            </span>
                                            <small
                                                className={cn(
                                                    "mt-0.5 block text-[11px] font-semibold",
                                                    DEADLINE_TEXT_CLASS[tone]
                                                )}
                                            >
                                                {deadlineText(o)}
                                            </small>
                                        </Td>
                                        <Td>
                                            <StatusPill opp={o} />
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end gap-1.5">
                                                {o.status === "pending" ? (
                                                    <>
                                                        <IconButton
                                                            title="Approve"
                                                            onClick={() => handleApprove(o.id)}
                                                            className="hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </IconButton>
                                                        <IconButton
                                                            title="Reject"
                                                            onClick={() => handleReject(o.id)}
                                                            className="hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </IconButton>
                                                    </>
                                                ) : (
                                                    <IconButton
                                                        title={o.featured ? "Unfeature" : "Feature"}
                                                        onClick={() => handleToggleFeatured(o.id)}
                                                        className={cn(
                                                            o.featured &&
                                                                "border-amber-300 bg-amber-50 text-amber-500 dark:bg-amber-950/30"
                                                        )}
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "h-4 w-4",
                                                                o.featured && "fill-current"
                                                            )}
                                                        />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    title="Edit"
                                                    onClick={() => openEdit(o)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </IconButton>
                                                <IconButton
                                                    title="Delete"
                                                    onClick={() => handleDelete(o.id)}
                                                    className="hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </IconButton>
                                            </div>
                                        </Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <OpportunityFormDialog
                open={dialogOpen}
                opportunity={editing}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            />
        </div>
    );
}

function StatusPill({ opp }: { opp: Opportunity }) {
    if (opp.status === "pending") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--warning)/0.15)] px-2.5 py-1 font-display text-[11.5px] font-bold text-[hsl(var(--warning))]">
                <Hourglass className="h-3 w-3" /> Pending
            </span>
        );
    }
    if (opp.status === "rejected") {
        return (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 font-display text-[11.5px] font-bold text-muted-foreground">
                Rejected
            </span>
        );
    }
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[11.5px] font-bold",
                opp.open
                    ? "bg-primary/15 text-primary-700"
                    : "bg-destructive/10 text-destructive"
            )}
        >
            {opp.open ? "Open" : "Closed"}
        </span>
    );
}

function Th({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={cn(
                "border-b px-4 py-3.5 text-left font-display text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
                className
            )}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <td className={cn("px-4 py-3.5 align-middle text-[13.5px] text-foreground/90", className)}>
            {children}
        </td>
    );
}

function IconButton({
    children,
    title,
    onClick,
    className,
}: {
    children: React.ReactNode;
    title: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={cn(
                "grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground",
                className
            )}
        >
            {children}
        </button>
    );
}
