"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    ChevronDown,
    ChevronUp,
    CircleDollarSign,
    FileText,
    Heart,
    Lock,
    Loader2,
    MapPin,
    RotateCcw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Star,
    TrendingUp,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVettedEntrepreneursQuery } from "@/hooks/repository/use-entrepreneurs";
import {
    DISTRICT_OPTIONS,
    INDUSTRY_OPTIONS,
    STAGE_OPTIONS,
    StageTone,
    VettedEntrepreneur,
    VettedEntrepreneursFilters,
} from "@/types/entrepreneurs";
import {ClothBorder} from "@/components/icons";

const STAGE_TONE: Record<StageTone, string> = {
    green: "bg-primary/15 text-primary",
    amber: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]",
    blue: "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]",
    gray: "bg-muted text-muted-foreground",
};

const HERO_STATS = [
    { icon: Users, num: "350+", label: "Vetted Entrepreneurs" },
    { icon: Briefcase, num: "25+", label: "Sectors Represented" },
    { icon: Heart, num: "150+", label: "Investor Connections" },
    { icon: CircleDollarSign, num: "Le 50M+", label: "Capital Raised" },
];

const WHY = [
    {
        icon: ShieldCheck,
        title: "Rigorous Vetting",
        body: "We verify identity, business information, traction, and market potential.",
    },
    {
        icon: BadgeCheck,
        title: "Trusted & Transparent",
        body: "Only credible and high-potential entrepreneurs make it to our platform.",
    },
    {
        icon: TrendingUp,
        title: "Investor Ready",
        body: "Entrepreneurs are equipped with the right tools and data to engage investors.",
    },
    {
        icon: Users,
        title: "Building Sierra Leone",
        body: "We focus on businesses creating economic and social impact.",
    },
];

const INVESTOR_FEATS = [
    { icon: ShieldCheck, label: "Verified Opportunities" },
    { icon: FileText, label: "Detailed Insights" },
    { icon: Users, label: "Direct Connections" },
    { icon: Lock, label: "Secure Engagement" },
];

export default function VettedEntrepreneursPage() {
    const [query, setQuery] = useState("");
    const [industry, setIndustry] = useState<string>(INDUSTRY_OPTIONS[0]);
    const [stage, setStage] = useState<string>(STAGE_OPTIONS[0]);
    const [district, setDistrict] = useState<string>(DISTRICT_OPTIONS[0]);
    const [showAllEntrepreneurs, setShowAllEntrepreneurs] = useState(false);

    const filters = useDeferredValue<VettedEntrepreneursFilters>({
        query,
        industry,
        stage,
        district,
    });

    const { data: entrepreneurs = [], isLoading, isError } = useVettedEntrepreneursQuery(filters);

    const featuredEntrepreneurs = entrepreneurs
        .filter((e) => e.featured)
        .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
    const otherEntrepreneurs = entrepreneurs.filter((e) => !e.featured);

    const clearAll = () => {
        setQuery("");
        setIndustry(INDUSTRY_OPTIONS[0]);
        setStage(STAGE_OPTIONS[0]);
        setDistrict(DISTRICT_OPTIONS[0]);
        setShowAllEntrepreneurs(false);
    };

    const hasActiveFilters =
        query.trim() !== "" ||
        industry !== INDUSTRY_OPTIONS[0] ||
        stage !== STAGE_OPTIONS[0] ||
        district !== DISTRICT_OPTIONS[0];

    return (
        <div>
            {/* Hero */}
            <section className="relative overflow-x-hidden bg-gradient-to-b from-primary-50 to-muted/40 pt-28 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto grid items-center gap-10 px-4 pb-0 lg:grid-cols-[1.04fr_1fr]">
                    <div>
                        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[56px]">
                            Sierra Leone&apos;s
                            <br />
                            <span className="text-primary">Vetted Entrepreneurs</span>
                        </h1>
                        <p className="mt-5 max-w-[480px] text-lg text-foreground/80">
                            Discover trusted, high-impact entrepreneurs vetted by NaWeHub. Start with
                            our featured spotlight profiles, then explore the full vetted directory.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Button asChild size="lg" className="rounded-full">
                                <Link href="#featured">
                                    Explore Featured <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full">
                                <Link href="#investor">
                                    <Users className="h-4 w-4" /> For Investors
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6 pb-14">
                            {HERO_STATS.map((s) => (
                                <div key={s.label} className="flex flex-col gap-0.5">
                                    <s.icon className="mb-2 h-5 w-5 text-primary" />
                                    <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                                        {s.num}
                                    </span>
                                    <span className="text-[13.5px] text-muted-foreground">
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative min-h-[320px] self-stretch lg:min-h-[460px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/vetted-entrepreneurs-hero.png"
                            alt="Two entrepreneurs reviewing business analytics on a laptop"
                            className="h-full w-full rounded-[20px] object-cover shadow-lg"
                        />
                        <div className="absolute -left-2 bottom-6 flex w-[290px] max-w-[85%] gap-3 rounded-2xl border bg-card p-4 shadow-xl sm:-left-9 sm:bottom-14">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div>
                                <h4 className="font-display text-[15px] font-bold text-foreground">
                                    NaWeHub Verified
                                </h4>
                                <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                                    All entrepreneurs go through a rigorous verification process
                                    covering identity, business, traction, and credibility.
                                </p>
                                <Link
                                    href="#vetting"
                                    className="mt-2.5 inline-flex items-center gap-1.5 font-display text-[12.5px] font-bold text-primary"
                                >
                                    Learn more about our vetting process <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search */}
            <div className="container relative z-20 mx-auto -mt-9 px-4 mb-5">
                <div className="rounded-2xl border bg-card p-5 shadow-md sm:p-6">
                    <div className="mb-3.5 flex items-center justify-between gap-3">
                        <h3 className="font-display text-base font-bold text-foreground">
                            Find the right entrepreneur or business to invest in
                        </h3>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-primary hover:text-primary/80"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Clear all
                        </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
                        <label className="flex min-w-0 flex-col sm:col-span-2 lg:col-span-1">
                            <FilterFieldLabel>Search</FilterFieldLabel>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name, business or keyword…"
                                    className="h-11 w-full rounded-[10px] border border-input bg-background pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </label>
                        <FilterSelect label="Industry" value={industry} onChange={setIndustry} options={[...INDUSTRY_OPTIONS]} />
                        <FilterSelect label="Stage" value={stage} onChange={setStage} options={[...STAGE_OPTIONS]} />
                        <FilterSelect label="Location" value={district} onChange={setDistrict} options={[...DISTRICT_OPTIONS]} />
                        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
                            <FilterFieldLabel className="invisible select-none" aria-hidden>
                                Apply
                            </FilterFieldLabel>
                            <Button
                                type="button"
                                className="h-11 w-full rounded-[10px] bg-[hsl(var(--color-neutral-900))] text-[hsl(var(--color-neutral-50))] hover:bg-[hsl(var(--color-neutral-800))] lg:w-auto lg:min-w-[108px]"
                            >
                                <SlidersHorizontal className="h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <ClothBorder />

            {/* Featured — default view */}
            <section id="featured" className="container mx-auto px-4 py-14">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                            <Star className="h-3.5 w-3.5 fill-current" /> Featured &amp; vetted
                        </div>
                        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            Featured Vetted Entrepreneurs
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Hand-picked profiles with the strongest vetting scores, traction, and
                            investor readiness — our premium spotlight cohort.
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-primary">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>{featuredEntrepreneurs.length} featured</>
                        )}
                    </span>
                </div>

                {isError ? (
                    <div className="rounded-2xl border bg-card p-12 text-center">
                        <p className="font-display text-lg font-bold text-foreground">
                            Couldn&apos;t load entrepreneurs
                        </p>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Something went wrong. Please try again in a moment.
                        </p>
                    </div>
                ) : isLoading ? (
                    <EntrepreneurCardSkeletonGrid />
                ) : featuredEntrepreneurs.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-12 text-center">
                        <p className="font-display text-lg font-bold text-neutral-900">
                            {hasActiveFilters
                                ? "No featured entrepreneurs match your filters"
                                : "No featured entrepreneurs yet"}
                        </p>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {otherEntrepreneurs.length > 0
                                ? "Browse all vetted entrepreneurs — every profile is verified by NaWeHub."
                                : "Try clearing some filters to see more results."}
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                            {otherEntrepreneurs.length > 0 && (
                                <Button
                                    onClick={() => setShowAllEntrepreneurs(true)}
                                    className="rounded-full"
                                >
                                    Show all vetted entrepreneurs
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                            {hasActiveFilters && (
                                <Button onClick={clearAll} variant="outline" className="rounded-full">
                                    <RotateCcw className="h-4 w-4" /> Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {featuredEntrepreneurs.map((e) => (
                            <EntrepreneurCard key={e.id} e={e} showFeaturedBadge />
                        ))}
                    </div>
                )}

                {/* Expand to full vetted directory */}
                {!isLoading && !isError && entrepreneurs.length > 0 && (
                    <div className="mt-10 flex flex-col items-center gap-4">
                        {!showAllEntrepreneurs && otherEntrepreneurs.length > 0 && (
                            <div className="w-full max-w-2xl rounded-2xl border bg-gradient-to-b from-muted/50 to-card p-6 text-center shadow-sm">
                                <p className="font-display text-base font-bold text-neutral-900">
                                    Looking for more vetted entrepreneurs?
                                </p>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Every NaWeHub profile is vetted. Featured entrepreneurs are our
                                    spotlight cohort — explore{" "}
                                    <strong className="font-semibold text-foreground">
                                        {otherEntrepreneurs.length} more
                                    </strong>{" "}
                                    verified founder{otherEntrepreneurs.length === 1 ? "" : "s"} in
                                    the full directory.
                                </p>
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="outline"
                                    className="mt-4 rounded-full border-primary-200 bg-card hover:bg-primary-50"
                                    onClick={() => {
                                        setShowAllEntrepreneurs(true);
                                        document.getElementById("all")?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                    }}
                                >
                                    Show all vetted entrepreneurs
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {showAllEntrepreneurs && (
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-full text-primary-600 hover:text-primary-700"
                                onClick={() => {
                                    setShowAllEntrepreneurs(false);
                                    document.getElementById("featured")?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }}
                            >
                                <ChevronUp className="h-4 w-4" />
                                Show featured only
                            </Button>
                        )}
                    </div>
                )}
            </section>

            {/* All vetted — revealed on demand */}
            {showAllEntrepreneurs && !isLoading && !isError && otherEntrepreneurs.length > 0 && (
                <section id="all" className="container mx-auto px-4 pb-14">
                    <div className="mb-6 flex flex-col gap-3 border-t pt-10 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-primary-700">
                                <BadgeCheck className="h-3.5 w-3.5" /> Vetted
                            </div>
                            <h2 className="font-display text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                                All Vetted Entrepreneurs
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                                The complete NaWeHub directory — every entrepreneur below has passed
                                our verification process.
                            </p>
                        </div>
                        <span className="font-display text-sm font-bold text-primary-600">
                            {otherEntrepreneurs.length} profile
                            {otherEntrepreneurs.length === 1 ? "" : "s"}
                        </span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {otherEntrepreneurs.map((e) => (
                            <EntrepreneurCard key={e.id} e={e} />
                        ))}
                    </div>
                </section>
            )}

            {!isLoading && !isError && entrepreneurs.length === 0 && (
                <section className="container mx-auto px-4 pb-14">
                    <div className="rounded-2xl border bg-card p-12 text-center">
                        <p className="font-display text-lg font-bold text-foreground">
                            No entrepreneurs match your filters
                        </p>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Try clearing some filters to see more results.
                        </p>
                        <Button onClick={clearAll} variant="outline" className="mt-4 rounded-full">
                            <RotateCcw className="h-4 w-4" /> Clear filters
                        </Button>
                    </div>
                </section>
            )}

            {/* Investor band - was below featured, keep placement */}
            <section id="investor" className="container mx-auto px-4 pb-14">
                <div className="grid items-center gap-8 rounded-3xl border bg-muted/40 p-8 sm:p-9 lg:grid-cols-[1.3fr_2fr]">
                    <div className="flex items-start gap-4">
                        <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                            <Users className="h-6 w-6" />
                        </span>
                        <div>
                            <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-[22px]">
                                Are you an investor?
                            </h3>
                            <p className="mt-2 text-[14.5px] text-muted-foreground">
                                Connect with vetted entrepreneurs, access detailed profiles and data,
                                and invest with confidence.
                            </p>
                            <Button asChild className="mt-4 rounded-full">
                                <Link href="/register">
                                    Join as an Investor <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 border-t pt-6 sm:grid-cols-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        {INVESTOR_FEATS.map((f) => (
                            <div key={f.label} className="text-center">
                                <span className="mx-auto mb-2.5 grid h-11 w-11 place-items-center rounded-xl border bg-card text-primary">
                                    <f.icon className="h-5 w-5" />
                                </span>
                                <span className="block font-display text-[13px] font-bold leading-tight text-foreground">
                                    {f.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why */}
            <section id="vetting" className="container mx-auto px-4 pb-16">
                <h2 className="mb-7 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    Why NaWeHub Vetted Entrepreneurs?
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {WHY.map((w) => (
                        <div key={w.title}>
                            <span className="mb-3.5 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                                <w.icon className="h-6 w-6" />
                            </span>
                            <h4 className="font-display text-[16.5px] font-bold text-foreground">
                                {w.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {w.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function FilterFieldLabel({
    children,
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                "mb-1 ml-0.5 block font-display text-[11px] font-bold uppercase tracking-wide text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

function FilterSelect({
                          label,
                          value,
                          onChange,
                          options,
                      }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <label className="flex min-w-0 flex-col">
            <FilterFieldLabel>{label}</FilterFieldLabel>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full cursor-pointer rounded-[10px] border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </label>
    );
}

function EntrepreneurCardSkeletonGrid() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                    <Skeleton className="h-[150px] w-full rounded-none" />
                    <div className="space-y-3 p-4 pt-8">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-12 w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EntrepreneurCard({
    e,
    showFeaturedBadge = false,
}: {
    e: VettedEntrepreneur;
    showFeaturedBadge?: boolean;
}) {
    return (
        <Link
            href={`/web/vetted-entrepreneurs/${e.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
        >
            <div className="relative h-[165px] bg-muted">
                <div className="h-full overflow-hidden">
                    {e.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={e.photo}
                            alt={e.name}
                            className="h-full w-full object-cover object-[center_22%] scale-[1.08]"
                        />
                    ) : (
                        <div
                            className="grid h-full w-full place-items-center font-display text-[40px] font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${e.c1}, ${e.c2})` }}
                        >
                            {e.initials}
                        </div>
                    )}
                </div>
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-neutral-900/55 px-2.5 py-1 font-display text-[12px] font-bold text-white backdrop-blur-sm">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
                {showFeaturedBadge && (
                    <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 px-2.5 py-1 font-display text-[11px] font-bold text-amber-950 shadow-sm">
                        Featured
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                <span className="relative z-10 -mt-5 mb-2 inline-flex h-[34px] max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-full border bg-card pl-2 pr-3 font-display text-[12.5px] font-bold text-foreground shadow-sm">
                    <span
                        className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md text-[11px] text-white"
                        style={{ background: e.c1 }}
                    >
                        {e.logoInitial}
                    </span>
                    <span className="truncate">{e.company}</span>
                </span>
                <h3 className="font-display text-[17px] font-bold text-foreground">{e.name}</h3>
                <div className="mt-0.5 font-display text-[13px] font-semibold text-primary">
                    {e.role}
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                    {e.short}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 font-display text-[12.5px] font-semibold text-primary">
                        {e.sector}
                    </span>
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[12.5px] font-semibold",
                            STAGE_TONE[e.stageTone]
                        )}
                    >
                        {e.stage}
                    </span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t pt-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {e.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-bold text-primary transition-all group-hover:gap-2.5">
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}