'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CustomCombobox } from '@/components/ui/combobox'
import { CATEGORIES } from '@/lib/database/opportunities'
import { locations, TARGET_BENEFICIARIES } from '@/types/opportunities'
import { GEOGRAPHIC_SCOPE_PARAM, toEnumParam } from '@/lib/gateway-enums'
import { useOpportunitiesQuery } from '@/hooks/repository/use-opportunities'
import { OpportunityCard } from '@/app/(web)/opportunities/_components/opportunity-card'
import { DeadlineFilter, DeadlineRange } from '@/app/(web)/opportunities/_components/deadline-filter'
import SelectFilter from '@/app/(web)/opportunities/_components/select-filter'

// The main directory covers every category except Events & Conferences -
// that gets its own dedicated /opportunities/events page instead.
const NON_EVENT_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'events')

const ALL_LOCATIONS = 'All locations'
const ALL_BENEFICIARIES = 'All beneficiaries'

export default function AllOpportunitiesPage() {
    const [activeCategory, setActiveCategory] = useState('')
    const [activeLocation, setActiveLocation] = useState(ALL_LOCATIONS)
    const [activeBeneficiary, setActiveBeneficiary] = useState(ALL_BENEFICIARIES)
    const [searchInput, setSearchInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [deadline, setDeadline] = useState<DeadlineRange>({ preset: 'anytime', from: '', to: '' })
    const [sort, setSort] = useState('Newest First')

    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 350)
        return () => clearTimeout(t)
    }, [searchInput])

    const { items, isLoading, isLoadingMore, isError, hasNextPage, loadMore } = useOpportunitiesQuery(
        {
            searchQuery,
            category: activeCategory ? toEnumParam(activeCategory) : null,
            targetBeneficiary: activeBeneficiary !== ALL_BENEFICIARIES ? toEnumParam(activeBeneficiary) : null,
            geographicScope: activeLocation !== ALL_LOCATIONS ? GEOGRAPHIC_SCOPE_PARAM[activeLocation] : null,
            excludeCategory: 'EVENTS',
        },
        sort === 'Oldest First',
    )

    // excludeCategory is a client-side post-filter (the gateway can only include
    // categories, not exclude one) - a whole server page can come back as 100%
    // events and get filtered down to zero. Keep fetching automatically until a
    // page yields at least one visible result or we genuinely run out, so a run
    // of same-category items doesn't look like an empty result set.
    const autoLoadCount = useRef(0)
    useEffect(() => {
        // A fresh (non-loadMore) fetch just landed - give this filter combination
        // a full fresh budget of auto-continues.
        if (isLoading) autoLoadCount.current = 0
        if (items.length === 0 && hasNextPage && !isLoading && !isLoadingMore && autoLoadCount.current < 15) {
            autoLoadCount.current += 1
            loadMore()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length, hasNextPage, isLoading, isLoadingMore])

    const visibleOpportunities = React.useMemo(() => {
        if (deadline.preset === 'anytime') return items
        const from = deadline.from ? new Date(deadline.from) : null
        const to = deadline.to ? new Date(deadline.to) : null
        return items.filter((opp) => {
            if (!opp.deadlineISO) return true
            const d = new Date(opp.deadlineISO)
            if (from && d < from) return false
            if (to && d > to) return false
            return true
        })
    }, [items, deadline])

    const hasActiveFilters =
        searchInput.trim() !== '' || activeCategory !== '' || activeLocation !== ALL_LOCATIONS ||
        activeBeneficiary !== ALL_BENEFICIARIES || deadline.preset !== 'anytime'

    const clearAll = () => {
        setSearchInput('')
        setActiveCategory('')
        setActiveLocation(ALL_LOCATIONS)
        setActiveBeneficiary(ALL_BENEFICIARIES)
        setDeadline({ preset: 'anytime', from: '', to: '' })
    }

    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>
                <div className="container relative mx-auto px-4 py-14 sm:py-16">
                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--color-neutral-300))] transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
                    </Link>
                    <h1 className="mt-4 text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl">
                        All Opportunities
                    </h1>
                    <p className="mt-2 max-w-lg text-[hsl(var(--color-neutral-300))]">
                        Browse every verified grant, competition, fellowship, training and funding call — everything
                        except events, which get their own space.
                    </p>
                </div>
            </section>

            {/* ── FILTERS ── */}
            <section className="border-b border-border bg-muted/40 py-6">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="flex items-center gap-2 font-semibold text-foreground [font-family:var(--font-display)]">
                                <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
                            </h3>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Clear all
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[220px] flex-1">
                                <Input
                                    leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search opportunities, grants, competitions..."
                                    className="h-10 bg-background"
                                />
                            </div>

                            <CustomCombobox
                                className="w-48 border border-primary/15 transition-colors"
                                placeholder="Category"
                                searchPlaceholder="Search categories..."
                                data={NON_EVENT_CATEGORIES}
                                searchField="label"
                                displayField="label"
                                valueField="id"
                                value={activeCategory}
                                onSelectAction={(value) => setActiveCategory(value)}
                            />

                            <SelectFilter
                                items={locations}
                                label="Location"
                                defaultValue={ALL_LOCATIONS}
                                value={activeLocation}
                                setValue={setActiveLocation}
                            />

                            <DeadlineFilter value={deadline} onChange={setDeadline} />

                            <SelectFilter
                                items={TARGET_BENEFICIARIES}
                                label="Beneficiaries"
                                defaultValue={ALL_BENEFICIARIES}
                                value={activeBeneficiary}
                                setValue={setActiveBeneficiary}
                            />

                            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="hidden sm:inline">Sort by:</span>
                                <SelectFilter
                                    items={['Newest First', 'Oldest First']}
                                    label="Sort by"
                                    defaultValue="Newest First"
                                    value={sort}
                                    setValue={setSort}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RESULTS ── */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {isError ? (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">Couldn&apos;t load opportunities</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Something went wrong. Please try again in a moment.</p>
                        </div>
                    ) : isLoading || (visibleOpportunities.length === 0 && isLoadingMore && hasNextPage) ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                                    <Skeleton className="h-44 w-full rounded-none" />
                                    <div className="space-y-3 p-4">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-5 w-2/3" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : visibleOpportunities.length === 0 ? (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">No opportunities match your filters</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Try clearing some filters to see more results.</p>
                            {hasActiveFilters && (
                                <Button onClick={clearAll} variant="outline" className="mt-4 rounded-full">
                                    <RotateCcw className="h-4 w-4" /> Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{visibleOpportunities.length}</span> opportunit{visibleOpportunities.length === 1 ? 'y' : 'ies'}
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {visibleOpportunities.map((opp) => (
                                    <OpportunityCard key={opp.id} opp={opp} />
                                ))}
                            </div>
                            {hasNextPage && (
                                <div className="mt-10 flex justify-center">
                                    <Button onClick={loadMore} disabled={isLoadingMore} variant="outline" className="rounded-xl">
                                        {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Load More
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
