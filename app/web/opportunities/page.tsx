"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Award,
    Bookmark,
    CalendarDays,
    Check,
    CircleDollarSign,
    Clock,
    ExternalLink,
    Loader2,
    MapPin,
    Plus,
    Rocket,
    Search,
    Sparkles,
    Star,
    Trophy,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import { useOpportunitiesQuery } from "@/hooks/repository/use-opportunities";
import {
    daysLeft,
    deadlineText,
    deadlineTone,
    initials,
    isApproved,
    shadeColor,
} from "@/lib/opportunities";
import {
    Opportunity,
    OpportunityType,
    OPPORTUNITY_SECTOR_OPTIONS,
    OPPORTUNITY_STAGE_OPTIONS,
    OPPORTUNITY_TYPE_ORDER,
    OPPORTUNITY_TYPES,
} from "@/types/opportunities";

const TYPE_ICON: Record<OpportunityType, LucideIcon> = {
    grant: Sparkles,
    competition: Trophy,
    event: CalendarDays,
    accelerator: Rocket,
    fellowship: Award,
};

type TabKey = "all" | OpportunityType;
type SortKey = "deadline" | "featured" | "az";

const DEADLINE_CHIP: Record<ReturnType<typeof deadlineTone>, string> = {
    soon: "bg-[hsl(25_95%_53%/0.12)] text-accent",
    ok: "bg-muted text-muted-foreground",
    closed: "bg-destructive/10 text-destructive",
};

export default function OpportunitiesPage() {
    const { data: opportunities = [], isLoading, isError } = useOpportunitiesQuery();

    const [search, setSearch] = useState("");
    const [sector, setSector] = useState<string>(OPPORTUNITY_SECTOR_OPTIONS[0]);
    const [stage, setStage] = useState<string>(OPPORTUNITY_STAGE_OPTIONS[0]);
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [sortBy, setSortBy] = useState<SortKey>("deadline");
    const [activeId, setActiveId] = useState<string | null>(null);

    // Only approved listings are public. Seed data has no status (= approved).
    const live = useMemo(() => opportunities.filter(isApproved), [opportunities]);

    const counts = useMemo(() => {
        const c: Record<string, number> = { all: live.length };
        OPPORTUNITY_TYPE_ORDER.forEach((t) => {
            c[t] = live.filter((o) => o.type === t).length;
        });
        return c;
    }, [live]);

    const stats = useMemo(() => {
        const open = live.filter((o) => o.open);
        const soon = open.filter((o) => daysLeft(o.deadline) <= 37).length;
        return { open: open.length, soon };
    }, [live]);

    const list = useMemo(() => {
        const q = search.trim().toLowerCase();
        const filtered = live.filter((o) => {
            const sectors = o.sectors ?? [];
            const stageText = (o.stage ?? "").toLowerCase();
            if (activeTab !== "all" && o.type !== activeTab) return false;
            if (
                sector !== OPPORTUNITY_SECTOR_OPTIONS[0] &&
                !sectors.includes("All sectors") &&
                !sectors.some((s) => s.toLowerCase().includes(sector.toLowerCase()))
            )
                return false;
            if (
                stage !== OPPORTUNITY_STAGE_OPTIONS[0] &&
                !stageText.includes("all") &&
                !stageText.includes(stage.toLowerCase())
            )
                return false;
            if (
                q &&
                !(o.title + o.org + o.summary + (o.tags ?? []).join(" "))
                    .toLowerCase()
                    .includes(q)
            )
                return false;
            return true;
        });

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            if (sortBy === "featured")
                return (
                    Number(b.featured) - Number(a.featured) ||
                    daysLeft(a.deadline) - daysLeft(b.deadline)
                );
            if (sortBy === "az") return a.title.localeCompare(b.title);
            if (a.open !== b.open) return a.open ? -1 : 1;
            return daysLeft(a.deadline) - daysLeft(b.deadline);
        });
        return sorted;
    }, [live, search, sector, stage, activeTab, sortBy]);

    const tabs: { key: TabKey; label: string }[] = [
        { key: "all", label: "All Opportunities" },
        ...OPPORTUNITY_TYPE_ORDER.map((t) => ({
            key: t,
            label: `${OPPORTUNITY_TYPES[t].label}s`,
        })),
    ];

    const activeOpp = activeId ? live.find((o) => o.id === activeId) ?? null : null;

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-background pt-28 dark:from-primary/10">
                <div className="container mx-auto px-4">
                    <div className="font-display text-[13px] font-bold uppercase tracking-[0.08em] text-primary-600">
                        Opportunities Hub
                    </div>
                    <h1 className="mt-3.5 max-w-[760px] font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                        Discover grants, events &amp;{" "}
                        <span className="text-primary">competitions</span> for entrepreneurs
                    </h1>
                    <p className="mt-4 max-w-[560px] text-[17px] text-muted-foreground">
                        Every funding call, accelerator, fellowship and event relevant to Sierra
                        Leone&apos;s founders — curated and updated in one place.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/web/opportunities/submit">
                                <Plus className="h-4 w-4" /> Submit Opportunity
                            </Link>
                        </Button>
                        <span className="text-[13.5px] text-muted-foreground">
                            Are you a partner, hub or investor? Share an opportunity.
                        </span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
                        <HeroStat
                            value={isLoading ? "—" : String(stats.open)}
                            label="Open opportunities"
                        />
                        <HeroStat value="$1.2M+" label="Total funding available" />
                        <HeroStat
                            value={isLoading ? "—" : String(stats.soon)}
                            label="Closing this month"
                        />
                    </div>

                    {/* Toolbar */}
                    <div className="mt-9">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative min-w-[240px] flex-1">
                                <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search grants, competitions, events…"
                                    className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                            <ToolbarSelect
                                value={sector}
                                onChange={setSector}
                                options={[...OPPORTUNITY_SECTOR_OPTIONS]}
                            />
                            <ToolbarSelect
                                value={stage}
                                onChange={setStage}
                                options={[...OPPORTUNITY_STAGE_OPTIONS]}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="mt-5 flex flex-wrap gap-1 border-b">
                            {tabs.map((t) => {
                                const active = t.key === activeTab;
                                return (
                                    <button
                                        key={t.key}
                                        type="button"
                                        onClick={() => setActiveTab(t.key)}
                                        className={cn(
                                            "-mb-px inline-flex items-center gap-2 border-b-[2.5px] px-4 py-3 font-display text-[14.5px] font-bold transition-colors",
                                            active
                                                ? "border-primary text-primary-700"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {t.label}
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-0.5 text-[12px] font-bold",
                                                active
                                                    ? "bg-primary/15 text-primary-700"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {counts[t.key] ?? 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="container mx-auto px-4 pb-16 pt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                        <b className="font-display text-foreground">{list.length}</b>{" "}
                        opportunities found
                    </div>
                    <label className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
                        Sort by
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="h-9 cursor-pointer rounded-[9px] border border-input bg-card px-3 text-[13.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="deadline">Deadline (soonest)</option>
                            <option value="featured">Featured first</option>
                            <option value="az">A – Z</option>
                        </select>
                    </label>
                </div>

                {isError ? (
                    <EmptyState
                        title="Couldn't load opportunities"
                        body="Something went wrong. Please try again in a moment."
                    />
                ) : isLoading ? (
                    <CardSkeletonGrid />
                ) : list.length === 0 ? (
                    <EmptyState
                        title="No opportunities match your filters"
                        body="Try clearing the search or switching tabs."
                    />
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {list.map((o) => (
                            <OpportunityCard
                                key={o.id}
                                opp={o}
                                onOpen={() => setActiveId(o.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Detail drawer */}
            <Sheet open={!!activeOpp} onOpenChange={(open) => !open && setActiveId(null)}>
                <SheetContent
                    side="right"
                    className="w-[480px] max-w-[94vw] overflow-y-auto p-0"
                >
                    {activeOpp && <OpportunityDetail opp={activeOpp} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}

/* ------------------------------------------------------------ */

function HeroStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col">
            <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                {value}
            </span>
            <span className="text-[13px] text-muted-foreground">{label}</span>
        </div>
    );
}

function ToolbarSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 max-w-[190px] cursor-pointer rounded-xl border border-input bg-card px-4 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

function TypeChip({ type }: { type: OpportunityType }) {
    const meta = OPPORTUNITY_TYPES[type];
    const Icon = TYPE_ICON[type];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[12.5px] font-semibold",
                meta.chipClass
            )}
        >
            <Icon className="h-3.5 w-3.5" /> {meta.label}
        </span>
    );
}

function OpportunityCard({ opp, onOpen }: { opp: Opportunity; onOpen: () => void }) {
    const tone = deadlineTone(opp);
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                "group relative flex flex-col rounded-[18px] border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md",
                opp.featured && "border-amber-300 ring-1 ring-amber-300",
                !opp.open && "opacity-75"
            )}
        >
            {opp.featured && (
                <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 px-2.5 py-1 font-display text-[10.5px] font-bold text-amber-950">
                    <Star className="h-3 w-3 fill-current" /> Featured
                </span>
            )}
            {opp.coverImage && (
                <div
                    className="-mx-5 -mt-5 mb-4 h-32 overflow-hidden rounded-t-[18px]"
                    style={{ backgroundColor: opp.c1 }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={opp.coverImage}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
            <div className="flex items-start gap-3">
                <span
                    className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl font-display text-[19px] font-extrabold text-white"
                    style={{
                        background: `linear-gradient(135deg, ${opp.c1}, ${shadeColor(opp.c1)})`,
                    }}
                >
                    {opp.logo || initials(opp.org || opp.title)}
                </span>
                <div className="min-w-0 flex-1">
                    <TypeChip type={opp.type} />
                    <div className="mt-1.5 text-[12.5px] text-muted-foreground">{opp.org}</div>
                </div>
            </div>

            <h3 className="mt-3.5 font-display text-[17px] font-extrabold leading-snug text-foreground">
                {opp.title}
            </h3>
            <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
                {opp.summary}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
                {opp.amount && (
                    <MetaItem icon={CircleDollarSign} label="Funding" value={opp.amount} />
                )}
                <MetaItem
                    icon={MapPin}
                    label="Location"
                    value={opp.location ?? opp.coverage ?? "—"}
                />
            </div>

            {(opp.tags ?? []).length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {(opp.tags ?? []).map((x) => (
                        <span
                            key={x}
                            className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 font-display text-[12px] font-semibold text-muted-foreground"
                        >
                            {x}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t pt-3.5">
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[12px] font-bold",
                        DEADLINE_CHIP[tone]
                    )}
                >
                    {opp.open && <Clock className="h-3 w-3" />} {deadlineText(opp)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-bold text-primary transition-all group-hover:gap-2.5">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                </span>
            </div>
        </button>
    );
}

function MetaItem({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg bg-muted text-primary">
                <Icon className="h-[15px] w-[15px]" />
            </span>
            <span className="min-w-0">
                <span className="block text-[10.5px] leading-tight text-muted-foreground">
                    {label}
                </span>
                <span className="block truncate font-display text-[12.5px] font-bold text-foreground">
                    {value}
                </span>
            </span>
        </div>
    );
}

function OpportunityDetail({ opp }: { opp: Opportunity }) {
    const facts = (
        [
            opp.amount && { label: "Funding", value: opp.amount },
            opp.deadlineLabel && { label: "Deadline", value: opp.deadlineLabel },
            (opp.location || opp.coverage) && {
                label: "Location",
                value: (opp.location ?? opp.coverage) as string,
            },
            opp.stage && { label: "Stage", value: opp.stage },
            opp.orgType && { label: "Provider", value: opp.orgType },
            opp.sectors?.length && { label: "Sectors", value: opp.sectors.join(", ") },
            opp.beneficiaries?.length && {
                label: "For",
                value: opp.beneficiaries.join(", "),
            },
            opp.spots && { label: "Selection", value: opp.spots },
        ].filter(Boolean) as { label: string; value: string }[]
    ).slice(0, 6);

    const perks = opp.tags?.length ? opp.tags : opp.beneficiaries ?? [];
    // Guard against a missing / malformed accent so the header colour always renders.
    const accent = /^#[0-9a-fA-F]{6}$/.test(opp.c1 ?? "") ? opp.c1 : "#1B8E4A";

    return (
        <div className="flex h-full flex-col">
            <SheetTitle className="sr-only">{opp.title}</SheetTitle>
            <SheetDescription className="sr-only">
                {OPPORTUNITY_TYPES[opp.type].label} from {opp.org}
            </SheetDescription>
            <div
                className="relative flex min-h-[176px] flex-col justify-end overflow-hidden px-7 py-7 text-white"
                style={{
                    // Solid colour is the instant fallback (no flash while a cover image
                    // decodes); the gradient sits on top when there is no image.
                    backgroundColor: accent,
                    backgroundImage: `linear-gradient(135deg, ${accent}, ${shadeColor(accent)})`,
                }}
            >
                {opp.coverImage && (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={opp.coverImage}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Light, legible scrim — keeps the cover image visible while
                            white text stays readable. */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(160deg, ${accent}40 0%, rgba(12,10,8,0.45) 55%, rgba(12,10,8,0.72) 100%)`,
                            }}
                        />
                    </>
                )}
                <div className="relative">
                    <span
                        className="mb-4 grid h-[54px] w-[54px] place-items-center rounded-xl bg-black/25 font-display text-[22px] font-extrabold text-white ring-1 ring-white/35 backdrop-blur-md"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,.35)" }}
                    >
                        {opp.logo || initials(opp.org || opp.title)}
                    </span>
                    <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 font-display text-[12.5px] font-semibold text-white">
                            {OPPORTUNITY_TYPES[opp.type].label}
                        </span>
                    </div>
                    <h2 className="font-display text-[23px] font-extrabold leading-tight text-white">
                        {opp.title}
                    </h2>
                    <div className="mt-2 text-sm text-white/85">{opp.org}</div>
                </div>
            </div>

            <div className="flex-1 px-7 pb-7 pt-6">
                {facts.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {facts.map((f) => (
                            <div key={f.label} className="rounded-xl bg-muted px-4 py-3">
                                <div className="font-display text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                                    {f.label}
                                </div>
                                <div className="mt-1 font-display text-[14.5px] font-bold text-foreground">
                                    {f.value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DetailSection title="About this opportunity">
                    <p className="text-[14.5px] leading-relaxed text-foreground/90">
                        {opp.summary}
                    </p>
                </DetailSection>

                {perks.length > 0 && (
                    <DetailSection title="What you get">
                        <CheckList items={perks} />
                    </DetailSection>
                )}

                <DetailSection title="Eligibility">
                    {opp.eligibilityCriteria ? (
                        <p className="text-[14.5px] leading-relaxed text-foreground/90">
                            {opp.eligibilityCriteria}
                        </p>
                    ) : (
                        <CheckList
                            items={[
                                "Registered or registrable business in Sierra Leone",
                                ...(opp.stage ? [`Stage: ${opp.stage}`] : []),
                                "A complete NaWeHub profile strengthens your application",
                            ]}
                        />
                    )}
                </DetailSection>
            </div>

            <div className="sticky bottom-0 flex gap-2.5 border-t bg-card px-7 py-4">
                {!opp.open ? (
                    <Button className="flex-1 rounded-full" disabled>
                        Applications closed
                    </Button>
                ) : opp.applicationLink ? (
                    <Button asChild className="flex-1 rounded-full">
                        <a href={opp.applicationLink} target="_blank" rel="noreferrer">
                            Apply Now <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                ) : (
                    <Button className="flex-1 rounded-full">
                        Apply Now <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
                <Button variant="outline" size="icon" className="rounded-full" title="Save">
                    <Bookmark className="h-[18px] w-[18px]" />
                    <span className="sr-only">Save</span>
                </Button>
            </div>
        </div>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-6">
            <h4 className="mb-2.5 font-display text-sm font-bold text-foreground">{title}</h4>
            {children}
        </div>
    );
}

function CheckList({ items }: { items: string[] }) {
    return (
        <div className="flex flex-col gap-2.5">
            {items.map((x) => (
                <div key={x} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                        <Check className="h-3.5 w-3.5" />
                    </span>
                    {x}
                </div>
            ))}
        </div>
    );
}

function EmptyState({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-2xl border bg-card px-5 py-16 text-center">
            <span className="mx-auto mb-3.5 grid h-14 w-14 place-items-center rounded-[15px] bg-muted text-muted-foreground">
                <Search className="h-6 w-6" />
            </span>
            <h3 className="font-display text-[17px] font-bold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
        </div>
    );
}

function CardSkeletonGrid() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[18px] border bg-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="h-[46px] w-[46px] animate-pulse rounded-xl bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                    <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="mt-3 h-12 w-full animate-pulse rounded bg-muted" />
                    <div className="mt-4 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                </div>
            ))}
        </div>
    );
}
