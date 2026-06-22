'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    Search, SlidersHorizontal, MapPin, Calendar, Clock,
    LayoutGrid, List, Bookmark, Share2, Bell, ChevronRight,
    ChevronLeft, ArrowUpRight, BadgeCheck, Filter, X, Mail,
    MessageCircle, Send, Trophy, Briefcase, GraduationCap,
    Zap, Leaf, Globe2, BookOpen, FlaskConical, Users2, Rocket,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const STATS = [
    { value: '250+', label: 'Active Opportunities' },
    { value: '35+', label: 'Upcoming Events' },
    { value: '120+', label: 'Funding Programs' },
    { value: '50+', label: 'Partners & Donors' },
]

const HERO_CARDS = [
    { label: 'Funding Opportunities', value: '120+', color: 'bg-primary text-primary-foreground' },
    { label: 'Events & Workshops', value: '35+', color: 'bg-accent text-accent-foreground' },
    { label: 'Competitions & Challenges', value: '45+', color: 'bg-[hsl(var(--color-info))] text-white' },
]

type Category = { id: string; label: string; count: number; icon: React.ElementType }
const CATEGORIES: Category[] = [
    { id: 'grants', label: 'Grants & Funding', count: 120, icon: Trophy },
    { id: 'competitions', label: 'Competitions', count: 45, icon: Zap },
    { id: 'events', label: 'Events & Conferences', count: 35, icon: Calendar },
    { id: 'training', label: 'Training & Workshops', count: 60, icon: BookOpen },
    { id: 'fellowships', label: 'Fellowships', count: 25, icon: Users2 },
    { id: 'scholarships', label: 'Scholarships', count: 30, icon: GraduationCap },
    { id: 'incubators', label: 'Incubators & Accelerators', count: 20, icon: FlaskConical },
    { id: 'jobs', label: 'Jobs & Internships', count: 40, icon: Briefcase },
    { id: 'climate', label: 'Climate & Circular Economy', count: 25, icon: Leaf },
    { id: 'women', label: 'Women Opportunities', count: 35, icon: Globe2 },
    { id: 'youth', label: 'Youth Innovation', count: 50, icon: Rocket },
]

type Opportunity = {
    id: string; title: string; type: string; location: string
    description: string; funding?: string; deadline: string
    badge?: string; badgeColor?: string; image: string
    daysLeft?: string; isNew?: boolean; isFeatured?: boolean
    applyLabel: string
}

const OPPORTUNITIES: Opportunity[] = [
    {
        id: '1', title: 'African Climate Innovation Grant 2026',
        type: 'Grant', location: 'Africa',
        description: 'Supporting innovative solutions to climate change across Africa.',
        funding: '$25,000', deadline: '30 Jun 2026',
        badge: 'FEATURED', badgeColor: 'bg-primary',
        image: '/images/opportunities/climate.jpg',
        isNew: true, isFeatured: true, applyLabel: 'Apply Now',
    },
    {
        id: '2', title: 'Tony Elumelu Foundation Entrepreneurship Programme',
        type: 'Program', location: 'Africa',
        description: 'Empowering African entrepreneurs through funding, mentorship and training.',
        funding: '$5,000', deadline: '15 May 2026',
        badge: 'FEATURED', badgeColor: 'bg-primary',
        image: '/images/opportunities/tony.jpg',
        isNew: true, isFeatured: true, applyLabel: 'Apply Now',
    },
    {
        id: '3', title: 'Women in Tech Conference 2026',
        type: 'Event', location: 'Sierra Leone',
        description: 'A conference celebrating women innovating in technology.',
        deadline: '20 – 22 Jun 2026',
        badge: '5 DAYS LEFT', badgeColor: 'bg-[hsl(var(--color-error))]',
        image: '/images/opportunities/women-tech.jpg',
        isFeatured: true, applyLabel: 'Register Now',
    },
    {
        id: '4', title: 'Green Innovation Challenge 2026',
        type: 'Competition', location: 'Global',
        description: 'Innovate for a sustainable future. Open to youth and startups.',
        funding: '$10,000', deadline: '10 Jun 2026',
        badge: '4 WEEKS LEFT', badgeColor: 'bg-[hsl(var(--color-warning))]',
        image: '/images/opportunities/green.jpg',
        isFeatured: true, applyLabel: 'Apply Now',
    },
]

type EventItem = {
    id: string; month: string; day: number; title: string
    time: string; format: string; location: string
}
const EVENTS: EventItem[] = [
    { id: 'e1', month: 'MAY', day: 24, title: 'Startup Pitch Night', time: '5:00 PM – 8:00 PM', format: '', location: 'Freetown, Sierra Leone' },
    { id: 'e2', month: 'MAY', day: 28, title: 'Plastic Circularity Summit', time: '9:00 AM – 4:00 PM', format: 'Hybrid Event', location: '' },
    { id: 'e3', month: 'JUN', day: 2, title: 'AI for Entrepreneurs Workshop', time: '10:00 AM – 1:00 PM', format: '', location: '' },
    { id: 'e4', month: 'JUN', day: 12, title: 'Women in Business Networking Mixer', time: '6:00 PM – 9:00 PM', format: '', location: 'Freetown, Sierra Leone' },
    { id: 'e5', month: 'JUN', day: 20, title: 'Climate Innovation Bootcamp', time: '9:00 AM – 5:00 PM', format: '', location: 'Freetown, Sierra Leone' },
]

const FEATURES = [
    { icon: BadgeCheck, title: 'Verified Opportunities', desc: 'All opportunities are reviewed and verified by NaWeHub.' },
    { icon: Bell, title: 'Never Miss Out', desc: 'Enable alerts and get notified about new opportunities.' },
    { icon: Bookmark, title: 'Save & Track', desc: 'Bookmark opportunities and track application deadlines.' },
    { icon: Share2, title: 'Share Opportunities', desc: 'Share opportunities with your network in one click.' },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ClothBorder({ id, tone }: { id: string; tone: string }) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={tone} fillOpacity="0.55" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#${id})`} />
            </svg>
        </div>
    )
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
    return (
        <div className="flex w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
            {/* Image */}
            <div className="relative h-40 bg-muted">
                <img src={opp.image} alt={opp.title} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute left-3 top-3 flex gap-1.5">
                    {opp.isFeatured && <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Featured</span>}
                    {opp.isNew && <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">New</span>}
                </div>
                {opp.badge && !opp.isFeatured && (
                    <span className={cn('absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white', opp.badgeColor)}>
            {opp.badge}
          </span>
                )}
                {opp.daysLeft && (
                    <span className="absolute right-3 top-3 rounded-md bg-[hsl(var(--color-error))] px-2 py-0.5 text-[10px] font-bold text-white">
            {opp.daysLeft}
          </span>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{opp.type}</Badge>
                    <span>→</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>
                </div>
                <h3 className="line-clamp-2 font-semibold text-foreground [font-family:var(--font-display)]">{opp.title}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{opp.description}</p>

                <div className="mt-auto space-y-1.5 text-xs">
                    {opp.funding && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Funding</span>
                            <span className="font-semibold text-primary">{opp.funding}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline</span>
                        <span className="font-semibold text-[hsl(var(--color-error))]">{opp.deadline}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href={`/opportunities/${opp.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
                    </Link>
                    <Link href={`/opportunities/${opp.id}/apply`} className="flex-1">
                        <Button size="sm" className="w-full text-xs">{opp.applyLabel}</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-2">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                        <Bookmark className="h-3.5 w-3.5" /> Save
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                        <Share2 className="h-3.5 w-3.5" /> Share
                    </button>
                </div>
            </div>
        </div>
    )
}

function EventRow({ ev }: { ev: EventItem }) {
    const isJune = ev.month === 'JUN'
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
            <div className={cn('flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white', isJune ? 'bg-primary' : 'bg-[hsl(var(--color-secondary-700))]')}>
                <span className="text-[10px] font-bold uppercase leading-none">{ev.month}</span>
                <span className="text-2xl font-bold [font-family:var(--font-mono)] leading-none">{ev.day}</span>
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-foreground">{ev.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                    {ev.format && <Badge variant="secondary" className="text-[10px]">{ev.format}</Badge>}
                    {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                </div>
                <Button size="sm" variant="outline" className="mt-3 h-7 rounded-lg px-3 text-xs">Register</Button>
            </div>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OpportunitiesPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [email, setEmail] = useState('')

    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                {/*<ClothBorder id="opp-hero-top" tone="hsl(25 95% 53%)" />*/}

                {/* Background glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
                </div>

                <div className="container relative mx-auto px-4 py-16 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left copy */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                                <BadgeCheck className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Verified Opportunities</span>
                            </div>

                            <h1 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                Discover Grants, Events,{' '}
                                <span className="text-primary">Competitions &amp; Opportunities</span>{' '}
                                for Entrepreneurs
                            </h1>

                            <p className="max-w-lg text-[hsl(var(--color-neutral-300))]">
                                Explore verified funding calls, innovation challenges, trainings, fellowships, startup events,
                                and entrepreneurship opportunities across Sierra Leone, Africa, and the world.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Link href="#featured">
                                    <Button className="gap-2 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                                        <LayoutGrid className="h-4 w-4" /> Browse Opportunities
                                    </Button>
                                </Link>
                                <Link href="/opportunities/submit">
                                    <Button variant="outline" className="gap-2 rounded-xl border-[hsl(var(--color-neutral-600))] text-[hsl(var(--color-neutral-50))] hover:border-primary hover:text-primary">
                                        <Send className="h-4 w-4" /> Submit Opportunity
                                    </Button>
                                </Link>
                                <Link href="#events">
                                    <Button variant="outline" className="gap-2 rounded-xl border-[hsl(var(--color-neutral-600))] text-[hsl(var(--color-neutral-50))] hover:border-primary hover:text-primary">
                                        <Calendar className="h-4 w-4" /> Upcoming Events
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-6 pt-2">
                                {STATS.map((s) => (
                                    <div key={s.label}>
                                        <div className="text-2xl font-bold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-mono)]">{s.value}</div>
                                        <div className="text-xs text-[hsl(var(--color-neutral-400))]">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — floating cards */}
                        <div className="relative hidden justify-center lg:flex">
                            {/* Woman image placeholder — replace with <Image> when asset exists */}
                            <div className="relative h-[420px] w-full max-w-sm">
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent" />
                                <img
                                    src="/images/opportunities/hero-person.png"
                                    alt="Entrepreneur"
                                    className="h-full w-full object-contain drop-shadow-2xl"
                                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }}
                                />
                                {/* Floating stat cards */}
                                {HERO_CARDS.map((card, i) => (
                                    <div
                                        key={card.label}
                                        className={cn(
                                            'absolute rounded-2xl p-4 shadow-[var(--shadow-lg)]',
                                            card.color,
                                            i === 0 && 'right-0 top-8 w-44',
                                            i === 1 && 'bottom-24 right-0 w-44',
                                            i === 2 && 'bottom-4 left-4 w-44',
                                        )}
                                    >
                                        <div className="text-2xl font-bold [font-family:var(--font-mono)]">{card.value}</div>
                                        <div className="mt-0.5 text-xs font-medium opacity-90">{card.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <ClothBorder id="opp-hero-bottom" tone="hsl(60 9% 98%)" />
            </section>

            {/* ── CATEGORIES ── */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground [font-family:var(--font-display)]">
                            Explore by Category
                        </h2>
                        <Link href="/opportunities/categories" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View All Categories <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                className={cn(
                                    'flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]',
                                    activeCategory === cat.id
                                        ? 'border-primary bg-primary/10 text-primary shadow-[var(--shadow-sm)]'
                                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                )}
                            >
                <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', activeCategory === cat.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>
                  <cat.icon className="h-4 w-4" />
                </span>
                                <span className="text-[11px] font-medium leading-tight">{cat.label}</span>
                                <span className="text-[10px] font-semibold text-primary [font-family:var(--font-mono)]">{cat.count}+</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SEARCH / FILTER ── */}
            <section className="border-y border-border bg-muted/40 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        {/* Search + filters row */}
                        <div className="flex flex-wrap gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search opportunities, events, grants..."
                                    className="h-10 rounded-xl pl-10 bg-background"
                                />
                            </div>
                            {(['All Categories', 'All Locations', 'Anytime', 'All Types'] as const).map((label) => (
                                <select
                                    key={label}
                                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option>{label}</option>
                                </select>
                            ))}
                            <Button variant="outline" className="h-10 gap-2 rounded-xl">
                                <SlidersHorizontal className="h-4 w-4" /> More Filters
                            </Button>
                            <Button variant="ghost" className="h-10 rounded-xl text-sm text-muted-foreground hover:text-foreground">
                                Clear All
                            </Button>
                        </div>

                        {/* Sort + view toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Sort by:</span>
                                <select className="rounded-lg border-0 bg-transparent font-medium text-foreground focus-visible:outline-none">
                                    <option>Newest First</option>
                                    <option>Deadline Soon</option>
                                    <option>Highest Funding</option>
                                </select>
                            </div>
                            <div className="flex overflow-hidden rounded-lg border border-border">
                                <button
                                    onClick={() => setView('grid')}
                                    className={cn('flex h-9 w-9 items-center justify-center transition-colors', view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
                                    aria-label="Grid view"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={cn('flex h-9 w-9 items-center justify-center transition-colors', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}
                                    aria-label="List view"
                                >
                                    <List className="h-4 w-4" />
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
                            <Badge className="bg-primary/15 text-primary text-xs">Handpicked for you</Badge>
                        </div>
                        <Link href="/opportunities/all" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            View All Opportunities <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {OPPORTUNITIES.map((opp) => (
                                <OpportunityCard key={opp.id} opp={opp} />
                            ))}
                        </div>
                        {/* Scroll hint arrow */}
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent" />
                    </div>
                </div>
            </section>

            {/* ── UPCOMING EVENTS ── */}
            <section id="events" className="bg-muted/40 py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-foreground [font-family:var(--font-display)]">
                            Upcoming Events
                        </h2>
                        <Link href="/opportunities/events" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            See all events <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {EVENTS.map((ev) => (
                            <EventRow key={ev.id} ev={ev} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURE CALLOUTS ── */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                                <div>
                                    <h3 className="font-semibold text-foreground [font-family:var(--font-display)]">{f.title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── NEWSLETTER + WHATSAPP ── */}
            <section className="bg-[hsl(var(--color-neutral-900))] py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Newsletter */}
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                                <div>
                                    <h3 className="font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)]">
                                        Stay Updated with New Opportunities
                                    </h3>
                                    <p className="text-sm text-[hsl(var(--color-neutral-400))]">
                                        Subscribe to our newsletter and get the latest grants, events, and opportunities straight to your inbox.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="h-11 rounded-xl border-[hsl(var(--color-neutral-700))] bg-[hsl(var(--color-neutral-800))] text-[hsl(var(--color-neutral-50))] placeholder:text-[hsl(var(--color-neutral-400))] focus-visible:ring-primary"
                                />
                                <Button className="h-11 shrink-0 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                                    Subscribe
                                </Button>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center gap-4 rounded-2xl border border-[hsl(var(--color-neutral-700))] bg-[hsl(var(--color-neutral-800))] p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[hsl(142_71%_45%)/15] text-[hsl(142_71%_45%)]">
                <MessageCircle className="h-6 w-6" />
              </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)]">
                                    Join our WhatsApp Channel
                                </h3>
                                <p className="text-sm text-[hsl(var(--color-neutral-400))]">
                                    Get instant updates on opportunities and events.
                                </p>
                            </div>
                            <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                                <Button className="shrink-0 gap-2 rounded-xl bg-[hsl(142_71%_45%)] font-semibold text-white hover:bg-[hsl(142_71%_38%)]">
                                    <MessageCircle className="h-4 w-4" /> Join
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SUBMIT OPPORTUNITY CTA ── */}
            <section className="bg-primary py-6">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
                    <div className="flex items-center gap-3 text-primary-foreground">
                        <Send className="h-5 w-5 opacity-80" />
                        <div>
                            <p className="font-semibold [font-family:var(--font-display)]">Do you have an opportunity to share?</p>
                            <p className="text-sm opacity-80">Submit funding opportunities, events or programs to reach thousands of entrepreneurs.</p>
                        </div>
                    </div>
                    <Link href="/opportunities/submit">
                        <Button className="shrink-0 gap-2 rounded-xl bg-[hsl(var(--color-neutral-900))] font-semibold text-[hsl(var(--color-neutral-50))] hover:bg-[hsl(var(--color-neutral-800))]">
                            <Send className="h-4 w-4" /> Submit Opportunity
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}