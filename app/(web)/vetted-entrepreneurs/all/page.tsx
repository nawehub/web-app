"use client";

import React, { useDeferredValue, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllEntrepreneursQuery } from "@/hooks/repository/use-entrepreneurs";
import { DISTRICT_OPTIONS, VettedEntrepreneursFilters } from "@/types/entrepreneurs";
import { GENDER_OPTIONS, SKILL_OPTIONS, genderToParam } from "@/lib/gateway-enums";
import { EntrepreneurCard } from "@/app/(web)/vetted-entrepreneurs/_components/entrepreneur-card";

const ALL_SKILLS = "All Skills";
const ALL_DISTRICTS = DISTRICT_OPTIONS[0];
const ALL_GENDERS = "All Genders";

export default function AllVettedEntrepreneursPage() {
    const [query, setQuery] = useState("");
    const [skill, setSkill] = useState<string>(ALL_SKILLS);
    const [district, setDistrict] = useState<string>(ALL_DISTRICTS);
    const [gender, setGender] = useState<string>(ALL_GENDERS);
    const [nationality, setNationality] = useState("");

    const filters = useDeferredValue<VettedEntrepreneursFilters>({
        query,
        skill: skill === ALL_SKILLS ? undefined : SKILL_OPTIONS.find((s) => s.label === skill)?.value,
        district: district === ALL_DISTRICTS ? undefined : district,
        gender: gender === ALL_GENDERS ? undefined : genderToParam(gender),
        nationality: nationality.trim() || undefined,
    });

    const { items, isLoading, isLoadingMore, isError, hasNextPage, loadMore } = useAllEntrepreneursQuery(filters);

    const clearAll = () => {
        setQuery("");
        setSkill(ALL_SKILLS);
        setDistrict(ALL_DISTRICTS);
        setGender(ALL_GENDERS);
        setNationality("");
    };

    const hasActiveFilters =
        query.trim() !== "" || skill !== ALL_SKILLS || district !== ALL_DISTRICTS ||
        gender !== ALL_GENDERS || nationality.trim() !== "";

    return (
        <div className="pt-24">
            <div className="container mx-auto px-4 pb-6">
                <Link
                    href="/vetted-entrepreneurs"
                    className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to vetted entrepreneurs
                </Link>
                <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    All Vetted Entrepreneurs
                </h1>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Every profile below has passed NaWeHub&apos;s verification process. Search and
                    filter the full directory.
                </p>
            </div>

            <div className="container mx-auto px-4 pb-8">
                <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                    <div className="mb-3.5 flex items-center justify-between gap-3">
                        <h3 className="font-display text-base font-bold text-foreground">Filters</h3>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-semibold text-primary hover:text-primary/80"
                        >
                            <RotateCcw className="h-3.5 w-3.5" /> Clear all
                        </button>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-5">
                        <div className="lg:col-span-2">
                            <Input
                                leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, business or keyword…"
                                className="h-11 w-full rounded-[10px] border border-input bg-background pl-10 pr-3 text-sm"
                            />
                        </div>
                        <FilterSelect label="Skills" value={skill} onChange={setSkill} options={[ALL_SKILLS, ...SKILL_OPTIONS.map((s) => s.label)]} />
                        <FilterSelect label="Location" value={district} onChange={setDistrict} options={[...DISTRICT_OPTIONS]} />
                        <FilterSelect label="Gender" value={gender} onChange={setGender} options={[ALL_GENDERS, ...GENDER_OPTIONS]} />
                        <div className="lg:col-span-5">
                            <Input
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                placeholder="Nationality (e.g. Sierra Leonean)"
                                className="h-11 w-full max-w-xs rounded-[10px] border border-input bg-background px-3 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-16">
                {isError ? (
                    <div className="rounded-2xl border bg-card p-12 text-center">
                        <p className="font-display text-lg font-bold text-foreground">Couldn&apos;t load entrepreneurs</p>
                        <p className="mt-1.5 text-sm text-muted-foreground">Something went wrong. Please try again in a moment.</p>
                    </div>
                ) : isLoading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                                <Skeleton className="h-[150px] w-full rounded-none" />
                                <div className="space-y-3 p-4 pt-8">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-12 text-center">
                        <p className="font-display text-lg font-bold text-foreground">No entrepreneurs match your filters</p>
                        <p className="mt-1.5 text-sm text-muted-foreground">Try clearing some filters to see more results.</p>
                        {hasActiveFilters && (
                            <Button onClick={clearAll} variant="outline" className="mt-4 rounded-full">
                                <RotateCcw className="h-4 w-4" /> Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((e) => (
                                <EntrepreneurCard key={e.id} e={e} showFeaturedBadge={e.featured} />
                            ))}
                        </div>
                        {hasNextPage && (
                            <div className="mt-10 flex justify-center">
                                <Button onClick={loadMore} disabled={isLoadingMore} variant="outline" className="rounded-full">
                                    {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
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
