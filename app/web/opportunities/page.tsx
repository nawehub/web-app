'use client'

import React, {useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import {
    Search, SlidersHorizontal, Calendar,
    LayoutGrid, List, Bookmark, Share2, Bell, ArrowUpRight, BadgeCheck,
    Mail, MessageCircle, Send, Trophy, DollarSign, Zap, Loader2,
} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Skeleton} from '@/components/ui/skeleton'
import {cn} from '@/lib/utils'
import {CATEGORIES, STATS} from "@/lib/database/opportunities";
import {ClothBorder} from "@/components/icons";
import {OpportunityCard} from "@/app/web/opportunities/_components/opportunity-card";
import {EventCard} from "@/app/web/opportunities/_components/event-card";
import {CustomCombobox} from "@/components/ui/combobox";
import {locations, TARGET_BENEFICIARIES} from "@/types/opportunities";
import {DeadlineFilter, DeadlineRange} from "@/app/web/opportunities/_components/deadline-filter";
import SelectFilter from "@/app/web/opportunities/_components/select-filter";
import {ValuePositionBanner} from "@/app/web/opportunities/_components/value-position-banner";
import {NewsletterWhatsapp} from "@/app/web/opportunities/_components/newsletter-whatsapp";
import {useOpportunitiesQuery, useOpportunityCategoriesQuery, useUpcomingEventsQuery} from "@/hooks/repository/use-opportunities";
import {GEOGRAPHIC_SCOPE_PARAM, toEnumParam} from "@/lib/gateway-enums";

const HERO_CARDS = [
    {label: 'Funding Opportunities', value: '120+', color: 'bg-primary text-primary-foreground', icon: DollarSign},
    {label: 'Events & Workshops', value: '35+', color: 'bg-accent text-accent-foreground', icon: Calendar},
    {label: 'Competitions & Challenges', value: '45+', color: 'bg-[hsl(var(--color-info))] text-white', icon: Trophy},
]

const FEATURES = [
    {
        icon: BadgeCheck,
        title: 'Verified Opportunities',
        desc: 'All opportunities are reviewed and verified by NaWeHub.',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600'
    },
    {
        icon: Bell,
        title: 'Never Miss Out',
        desc: 'Enable alerts and get notified about new opportunities.',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600'
    },
    {
        icon: Bookmark,
        title: 'Save & Track',
        desc: 'Bookmark opportunities and track application deadlines.',
        iconBg: 'bg-red-100',
        iconText: 'text-red-500'
    },
    {
        icon: Share2,
        title: 'Share Opportunities',
        desc: 'Share opportunities with your network in one click.',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600'
    },
]

export default function OpportunitiesPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [activeLocation, setActiveLocation] = useState<string>("")
    const [activeBeneficiary, setActiveBeneficiary] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [email, setEmail] = useState('')
    const [deadline, setDeadline] = useState<DeadlineRange>({ preset: 'anytime', from: '', to: '' })
    const [sort, setSort] = useState<string>("Newest First")

    useEffect(() => {
        const t = setTimeout(() => setSearchQuery(searchInput), 350)
        return () => clearTimeout(t)
    }, [searchInput])

    const {items, isLoading, isLoadingMore, isError, hasNextPage, loadMore} = useOpportunitiesQuery({
        searchQuery,
        category: activeCategory ? toEnumParam(activeCategory) : null,
        targetBeneficiary: activeBeneficiary && activeBeneficiary !== 'All beneficiaries' ? toEnumParam(activeBeneficiary) : null,
        geographicScope: activeLocation && activeLocation !== 'All locations' ? GEOGRAPHIC_SCOPE_PARAM[activeLocation] : null,
    }, sort === 'Oldest First')

    const {data: categoryTiles = [], isLoading: isLoadingCategories, isError: isErrorCategories} = useOpportunityCategoriesQuery()
    const {data: events = [], isLoading: isLoadingEvents, isError: isErrorEvents} = useUpcomingEventsQuery(10)

    const visibleOpportunities = useMemo(() => {
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

    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                {/* Background glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div
                        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"/>
                    <div
                        className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]"/>
                </div>

                <div className="container relative mx-auto px-4 py-16 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left copy */}
                        <div className="space-y-6">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                                <BadgeCheck className="h-4 w-4 text-primary"/>
                                <span className="text-sm font-medium text-primary">Verified Opportunities</span>
                            </div>

                            <h1 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-4xl">
                                Discover Grants, Events,{' '}
                                <span className="text-primary">Competitions &amp; Opportunities</span><br/>{' '}
                                for Entrepreneurs
                            </h1>

                            <p className="max-w-lg text-[hsl(var(--color-neutral-300))]">
                                Explore verified funding calls, innovation challenges, trainings, fellowships, startup
                                events,
                                and entrepreneurship opportunities across Sierra Leone, Africa, and the world.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <Link href="#featured">
                                    <Button
                                        className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                                        <LayoutGrid className="h-4 w-4"/> Browse Opportunities
                                    </Button>
                                </Link>
                                <Link href="/web/opportunities/submit">
                                    <Button variant="outline"
                                            className="border-[hsl(var(--color-neutral-600))] text-[hsl(var(--color-neutral-50))] hover:border-primary">
                                        <Send className="h-4 w-4"/> Submit Opportunity
                                    </Button>
                                </Link>
                                <Link href="#events">
                                    <Button variant="outline"
                                            className="border-[hsl(var(--color-neutral-600))] text-[hsl(var(--color-neutral-50))] hover:border-primary">
                                        <Calendar className="h-4 w-4"/> Upcoming Events
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-6 pt-2">
                                {STATS.map((s) => (
                                    <div key={s.label}>
                                        <div
                                            className="text-2xl font-bold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-mono)]">{s.value}</div>
                                        <div className="text-xs text-[hsl(var(--color-neutral-400))]">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — floating cards */}
                        <div className="relative hidden justify-center lg:flex">
                            <div className="relative h-[420px] w-full max-w-sm">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent"/>
                                <div className={'w-80 h-96 lg:w-96 lg:h-[420px] lg:pr-16'}>
                                    <img
                                        src="/images/opportunities/hero-person.png"
                                        alt="Entrepreneur"
                                        className="w-full h-full object-cover opacity-90"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.opacity = '0'
                                        }}
                                    />
                                </div>
                                {HERO_CARDS.map((card, i) => {
                                    const Icon = card.icon
                                    return (
                                        <div
                                            key={card.label}
                                            className={cn(
                                                'absolute rounded-2xl p-4 shadow-[var(--shadow-lg)]',
                                                card.color,
                                                i === 0 && 'left-0 top-0 w-32',
                                                i === 1 && 'bottom-24 right-0 w-44',
                                                i === 2 && 'bottom-4 left-4 w-44',
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div
                                                        className="text-2xl font-bold [font-family:var(--font-mono)]">{card.value}</div>
                                                    <div
                                                        className="mt-0.5 text-xs font-medium opacity-90">{card.label}</div>
                                                </div>
                                                <Icon className="h-6 w-6 shrink-0 opacity-70"/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <ClothBorder fillUrl="opp-hero-bottom" fillTone="hsl(60 9% 98%)"/>
            </section>

            {/* ── CATEGORIES ── */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground [font-family:var(--font-display)]">
                            Explore by Category
                        </h2>
                        <Link href="/opportunities/categories"
                              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View All Categories <ArrowUpRight className="h-4 w-4"/>
                        </Link>
                    </div>
                    {isErrorCategories ? (
                        <p className="text-sm text-muted-foreground">Couldn&apos;t load categories.</p>
                    ) : isLoadingCategories ? (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
                            {Array.from({length: 11}).map((_, i) => (
                                <Skeleton key={i} className="h-[92px] rounded-2xl"/>
                            ))}
                        </div>
                    ) : categoryTiles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No categories yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
                            {categoryTiles.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                    className={cn(
                                        'flex flex-col items-center gap-2 rounded-2xl border p-3 text-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                                        activeCategory === cat.id
                                            ? 'border-primary bg-primary/10 shadow-[var(--shadow-sm)]'
                                            : 'border-border bg-card hover:border-primary/50'
                                    )}
                                >
                                    <span className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-xl',
                                        activeCategory === cat.id ? 'bg-primary/20 text-primary' : cn(cat.iconBg, cat.iconText)
                                    )}>
                                        <cat.icon size={22}/>
                                    </span>
                                    <span
                                        className="text-[11px] font-medium leading-tight text-foreground">{cat.label}</span>
                                    <span className={cn(
                                        'text-[10px] font-semibold [font-family:var(--font-mono)]',
                                        activeCategory === cat.id ? 'text-primary' : cat.countColor
                                    )}>{cat.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── SEARCH / FILTER ── */}
            <section className="border-y border-border bg-muted/40 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        {/* Search + filters row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Input
                                    leftIcon={<Search className="h-4 w-4 text-muted-foreground"/>}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search opportunities, events, grants..."
                                    className="h-10 bg-background"
                                />
                            </div>

                            {/* Category */}
                            <CustomCombobox
                                className={"w-44 border transition-colors border-primary/15"}
                                placeholder="Category"
                                searchPlaceholder="Search categories..."
                                data={CATEGORIES}
                                searchField="label"
                                displayField="label"
                                valueField="id"
                                value={activeCategory || ""}
                                onSelectAction={(value) => setActiveCategory(value)}
                            />

                            {/* Location */}
                            <SelectFilter items={locations} label={'Location'} defaultValue={'All locations'}
                                          value={activeLocation}
                                          setValue={setActiveLocation} />

                            {/* Deadline */}
                            <DeadlineFilter value={deadline} onChange={setDeadline} />

                            {/* Beneficiaries */}
                            <SelectFilter items={TARGET_BENEFICIARIES} label={'Beneficiaries'} defaultValue={'All beneficiaries'}
                                          value={activeBeneficiary}
                                          setValue={setActiveBeneficiary} />

                            <Button variant="outline" className="h-10 gap-2 rounded-xl">
                                <SlidersHorizontal className="h-4 w-4"/> More Filters
                            </Button>

                            <Button variant="ghost"
                                    className="h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground">
                                Clear All
                            </Button>
                        </div>

                        {/* Sort + view toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Sort by:</span>
                                <SelectFilter items={['Newest First', 'Oldest First']} label={'Sort by'} defaultValue={'Newest First'}
                                              value={sort}
                                              setValue={setSort} />

                            </div>
                            <div className="flex overflow-hidden rounded-xl border border-border">
                                <button
                                    onClick={() => setView('grid')}
                                    className={cn('flex h-9 items-center gap-1.5 px-3 text-sm transition-colors', view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
                                    aria-label="Grid view"
                                >
                                    <LayoutGrid className="h-4 w-4"/> Grid View
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={cn('flex h-9 items-center gap-1.5 px-3 text-sm transition-colors', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
                                    aria-label="List view"
                                >
                                    <List className="h-4 w-4"/> List View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURED OPPORTUNITIES ── */}
            <section id="featured" className="py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Featured Opportunities
                            </h2>
                            <Badge className="bg-primary/15 text-primary text-xs">Handpicked opportunities for you</Badge>
                        </div>
                        <Link href="/opportunities/all"
                              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View All Opportunities <ArrowUpRight className="h-4 w-4"/>
                        </Link>
                    </div>

                    {isError ? (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">Couldn&apos;t load opportunities</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Something went wrong. Please try again in a moment.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({length: 4}).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                                    <Skeleton className="h-44 w-full rounded-none"/>
                                    <div className="space-y-3 p-4">
                                        <Skeleton className="h-4 w-1/3"/>
                                        <Skeleton className="h-5 w-2/3"/>
                                        <Skeleton className="h-10 w-full"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : visibleOpportunities.length === 0 ? (
                        <div className="rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">No opportunities match your filters</p>
                            <p className="mt-1.5 text-sm text-muted-foreground">Try clearing some filters to see more results.</p>
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {visibleOpportunities.map((opp) => (
                                        <OpportunityCard key={opp.id} opp={opp}/>
                                    ))}
                                </div>
                            </div>
                            {hasNextPage && (
                                <div className="mt-8 flex justify-center">
                                    <Button onClick={loadMore} disabled={isLoadingMore} variant="outline" className="rounded-xl">
                                        {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin"/>}
                                        Load More
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ── UPCOMING EVENTS ── */}
            <section id="events" className="bg-muted/40 py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground [font-family:var(--font-display)]">
                            Upcoming Events
                        </h2>
                        <Link href="/opportunities/events"
                              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            See all events <ArrowUpRight className="h-4 w-4"/>
                        </Link>
                    </div>

                    {isErrorEvents ? (
                        <div className="rounded-2xl border bg-card p-8 text-center">
                            <p className="text-sm text-muted-foreground">Couldn&apos;t load upcoming events.</p>
                        </div>
                    ) : isLoadingEvents ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Array.from({length: 5}).map((_, i) => (
                                <Skeleton key={i} className="h-[132px] rounded-xl"/>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="rounded-2xl border bg-card p-8 text-center">
                            <p className="text-sm text-muted-foreground">No upcoming events right now — check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {events.map((ev) => (
                                <EventCard key={ev.id} ev={ev}/>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── FEATURE CALLOUTS ── */}
            <ValuePositionBanner />

            {/* ── NEWSLETTER + WHATSAPP ── */}
            <NewsletterWhatsapp />

            {/* ── SUBMIT OPPORTUNITY CTA ── */}
            <section className="bg-primary py-6">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                    <div className="flex items-center gap-3 text-primary-foreground">
                        <div className="p-2 rounded-lg opacity-80"><Zap size={20} /></div>
                        <div>
                            <h4 className="font-semibold [font-family:var(--font-display)]">Do you have an opportunity to share?</h4>
                            <p className="text-sm opacity-80">Submit funding opportunities, events or tracks to reach thousands of micro-businesses.</p>
                        </div>
                    </div>
                    <Link href="/opportunities/submit">
                        <Button
                            className="shrink-0 gap-2 bg-accent hover:bg-[hsl(var(--color-secondary-400))] font-semibold text-[hsl(var(--color-neutral-50))]">
                            <Send className="h-4 w-4"/> Submit Opportunity
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
