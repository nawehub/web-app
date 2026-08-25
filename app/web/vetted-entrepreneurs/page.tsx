"use client";

import React, { useDeferredValue, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    CircleDollarSign,
    FileText,
    Heart,
    Lock,
    RotateCcw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Star,
    TrendingUp,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedEntrepreneursQuery, useVettedEntrepreneursPreviewQuery } from "@/hooks/repository/use-entrepreneurs";
import { DISTRICT_OPTIONS, VettedEntrepreneursFilters } from "@/types/entrepreneurs";
import { SKILL_OPTIONS } from "@/lib/gateway-enums";
import { Input } from "@/components/ui/input";
import { ClothBorder } from "@/components/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EntrepreneurCard } from "@/app/web/vetted-entrepreneurs/_components/entrepreneur-card";

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

const ALL_SKILLS = "All Skills";
const ALL_DISTRICTS = DISTRICT_OPTIONS[0];

export default function VettedEntrepreneursPage() {
    const [query, setQuery] = useState("");
    const [skill, setSkill] = useState<string>(ALL_SKILLS);
    const [district, setDistrict] = useState<string>(ALL_DISTRICTS);

    const filters = useDeferredValue<VettedEntrepreneursFilters>({
        query,
        skill: skill === ALL_SKILLS ? undefined : SKILL_OPTIONS.find((s) => s.label === skill)?.value,
        district: district === ALL_DISTRICTS ? undefined : district,
    });

    const { data: featuredEntrepreneurs = [], isLoading: isLoadingFeatured, isError: isErrorFeatured } =
        useFeaturedEntrepreneursQuery(filters);
    const { data: otherEntrepreneurs = [], isLoading: isLoadingOthers, isError: isErrorOthers } =
        useVettedEntrepreneursPreviewQuery(filters);

    const isLoading = isLoadingFeatured || isLoadingOthers;
    const isError = isErrorFeatured || isErrorOthers;
    const hasResults = featuredEntrepreneurs.length > 0 || otherEntrepreneurs.length > 0;

    const clearAll = () => {
        setQuery("");
        setSkill(ALL_SKILLS);
        setDistrict(ALL_DISTRICTS);
    };

    const hasActiveFilters = query.trim() !== "" || skill !== ALL_SKILLS || district !== ALL_DISTRICTS;

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
                            <Button asChild size="lg">
                                <Link href="#featured">
                                    Explore Featured <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
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
                                    Learn more about our vetting process{" "}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search */}
            <div className="container relative z-20 mx-auto -mt-9 mb-5 px-4">
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
                    <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto]">
                        <div className="mt-5">
                            <Input
                                leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, business or keyword…"
                                className="h-11 w-full rounded-[10px] border border-input bg-background pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <FilterSelect
                            label="Skills"
                            value={skill}
                            onChange={setSkill}
                            options={[ALL_SKILLS, ...SKILL_OPTIONS.map((s) => s.label)]}
                        />
                        <FilterSelect
                            label="Location"
                            value={district}
                            onChange={setDistrict}
                            options={[...DISTRICT_OPTIONS]}
                        />
                        <Button
                            type="button"
                            className="h-11 self-end rounded-[10px] bg-[hsl(var(--color-neutral-900))] text-[hsl(var(--color-neutral-50))] hover:bg-[hsl(var(--color-neutral-800))]"
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Filter
                        </Button>
                    </div>
                </div>
            </div>

            <ClothBorder />

            {/* Featured */}
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
                    {!isLoading && !isError && hasResults && (
                        <Button asChild variant="outline" className="shrink-0 rounded-full">
                            <Link href="/web/vetted-entrepreneurs/all">
                                View All Entrepreneurs
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
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
                        <p className="font-display text-lg font-bold text-foreground">
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
                                <Button asChild className="rounded-full">
                                    <Link href="/web/vetted-entrepreneurs/all">
                                        View All Entrepreneurs
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
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
            </section>

            {/* Vetted preview — featured entrepreneurs excluded, capped, links out to the full directory */}
            {!isLoading && !isError && otherEntrepreneurs.length > 0 && (
                <section id="all" className="container mx-auto px-4 pb-14">
                    <div className="mb-6 flex flex-col gap-3 border-t pt-10 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                <BadgeCheck className="h-3.5 w-3.5" /> Vetted
                            </div>
                            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                More Vetted Entrepreneurs
                            </h2>
                            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                                Every profile below has passed our verification process — explore
                                the full directory for the complete, filterable list.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="shrink-0 rounded-full">
                            <Link href="/web/vetted-entrepreneurs/all">
                                View All Entrepreneurs
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {otherEntrepreneurs.map((e) => (
                            <EntrepreneurCard key={e.id} e={e} />
                        ))}
                    </div>
                </section>
            )}

            {!isLoading && !isError && !hasResults && (
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

            {/* Investor band */}
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
                                <Link href="/web/next-big-idea">
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
        <label className="flex flex-col">
            <span className="mb-1 ml-0.5 font-display text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {label}
            </span>
            <div className="bg-background">
                <Select value={value} onValueChange={(v) => onChange(v)}>
                    <SelectTrigger>
                        <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((item, index) => (
                            <SelectItem key={index} value={item}>
                                {item}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
