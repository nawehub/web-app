'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Loader2, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { locations } from '@/types/opportunities'
import { GEOGRAPHIC_SCOPE_PARAM } from '@/lib/gateway-enums'
import { useOpportunitiesQuery } from '@/hooks/repository/use-opportunities'
import { OpportunityCard } from '@/app/(web)/opportunities/_components/opportunity-card'
import { DeadlineFilter, DeadlineRange } from '@/app/(web)/opportunities/_components/deadline-filter'
import SelectFilter from '@/app/(web)/opportunities/_components/select-filter'

const ALL_LOCATIONS = 'All locations'

export default function OpportunityEventsPage() {
    const [activeLocation, setActiveLocation] = useState(ALL_LOCATIONS)
    const [searchInput, setSearchInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [eventDate, setEventDate] = useState<DeadlineRange>({ preset: 'anytime', from: '', to: '' })
    const [sort, setSort] = useState('Newest First')

    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 350)
        return () => clearTimeout(t)
    }, [searchInput])

    const { items, isLoading, isLoadingMore, isError, hasNextPage, loadMore } = useOpportunitiesQuery(
        {
            searchQuery,
            category: 'EVENTS',
            geographicScope: activeLocation !== ALL_LOCATIONS ? GEOGRAPHIC_SCOPE_PARAM[activeLocation] : null,
        },
        sort === 'Oldest First',
    )

    const visibleEvents = React.useMemo(() => {
        if (eventDate.preset === 'anytime') return items
        const from = eventDate.from ? new Date(eventDate.from) : null
        const to = eventDate.to ? new Date(eventDate.to) : null
        return items.filter((opp) => {
            if (!opp.deadlineISO) return true
            const d = new Date(opp.deadlineISO)
            if (from && d < from) return false
            if (to && d > to) return false
            return true
        })
    }, [items, eventDate])

    const hasActiveFilters = searchInput.trim() !== '' || activeLocation !== ALL_LOCATIONS || eventDate.preset !== 'anytime'

    const clearAll = () => {
        setSearchInput('')
        setActiveLocation(ALL_LOCATIONS)
        setEventDate({ preset: 'anytime', from: '', to: '' })
    }

    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-[hsl(var(--color-info))]/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>
                <div className="container relative mx-auto px-4 py-14 sm:py-16">
                    <Link
                        href="/opportunities"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--color-neutral-300))] transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
                    </Link>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-info))]/30 bg-[hsl(var(--color-info))]/10 px-4 py-1.5">
                        <Calendar className="h-4 w-4 text-[hsl(var(--color-info))]" />
                        <span className="text-sm font-medium text-[hsl(var(--color-info))]">Events &amp; Conferences</span>
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl">
                        All Upcoming Events
                    </h1>
                    <p className="mt-2 max-w-lg text-[hsl(var(--color-neutral-300))]">
                        Conferences, workshops, pitch nights and meetups for entrepreneurs and innovators across
                        Sierra Leone and beyond.
                    </p>
                </div>
            </section>

            {/* ── FILTERS ── */}
            <section className="border-b border-border bg-muted/40 py-6">
                <div className="container mx-auto px-4">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="flex items-center gap-2 font-semibold text-foreground [font-family:var(--font-display)]">
                                <Calendar className="h-4 w-4 text-primary" /> Filter Events
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
                                    placeholder="Search events, conferences, workshops..."
                                    className="h-10 bg-background"
                                />
                            </div>

                            <SelectFilter
                                items={locations}
                                label="Location"
                                defaultValue={ALL_LOCATIONS}
                                value={activeLocation}
                                setValue={setActiveLocation}
                            />

                            <DeadlineFilter value={eventDate} onChange={setEventDate} />

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
                            <p className="font-display text-lg font-bold text-foreground">Couldn&apos;t load events</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Something went wrong. Please try again in a moment.</p>
                        </div>
                    ) : isLoading ? (
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
                    ) : visibleEvents.length === 0 ? (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">No events match your filters</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Try clearing some filters, or check back soon for new events.</p>
                            {hasActiveFilters && (
                                <Button onClick={clearAll} variant="outline" className="mt-4 rounded-full">
                                    <RotateCcw className="h-4 w-4" /> Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{visibleEvents.length}</span> event{visibleEvents.length === 1 ? '' : 's'}
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {visibleEvents.map((opp) => (
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
