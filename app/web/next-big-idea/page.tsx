'use client'

import React, {useState} from 'react'
import {
    Users,
    Building2,
    Landmark,
    Sprout,
    Zap,
    Palette,
    GraduationCap,
    HeartPulse,
    MapPin,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    Coins,
} from 'lucide-react'
import {PaymentMethod, paymentMethods} from "@/types/payment";

type Category = 'AgriTech' | 'Clean Energy' | 'Gara & Craft' | 'EdTech' | 'Health'

interface Campaign {
    id: string
    title: string
    founder: string
    district: string
    category: Category
    raisedSLE: number
    goalSLE: number
    contributors: number
    daysLeft: number
    verified: boolean
}

const CATEGORY_ICON: Record<Category, React.ComponentType<{ className?: string }>> = {
    AgriTech: Sprout,
    'Clean Energy': Zap,
    'Gara & Craft': Palette,
    EdTech: GraduationCap,
    Health: HeartPulse,
}

const campaigns: Campaign[] = [
    {
        id: 'agro-dry',
        title: 'Solar dryers for smallholder cassava farmers',
        founder: 'Adama Sesay',
        district: 'Bo',
        category: 'AgriTech',
        raisedSLE: 38_500_000,
        goalSLE: 45_000_000,
        contributors: 212,
        daysLeft: 9,
        verified: true,
    },
    {
        id: 'gara-coop',
        title: 'Gara dye cooperative for 30 women artisans',
        founder: 'Fatmata Koroma',
        district: 'Makeni',
        category: 'Gara & Craft',
        raisedSLE: 14_200_000,
        goalSLE: 20_000_000,
        contributors: 96,
        daysLeft: 16,
        verified: true,
    },
    {
        id: 'lite-grid',
        title: 'Pay-as-you-go solar kits for off-grid households',
        founder: 'Ibrahim Bangura',
        district: 'Kenema',
        category: 'Clean Energy',
        raisedSLE: 61_000_000,
        goalSLE: 60_000_000,
        contributors: 304,
        daysLeft: 0,
        verified: true,
    },
    {
        id: 'learnlocal',
        title: 'Offline tablets for rural primary schools',
        founder: 'Mariama Conteh',
        district: 'Kono',
        category: 'EdTech',
        raisedSLE: 9_800_000,
        goalSLE: 30_000_000,
        contributors: 58,
        daysLeft: 23,
        verified: false,
    },
    {
        id: 'mama-care',
        title: 'Mobile prenatal screening unit',
        founder: 'Hawa Turay',
        district: 'Port Loko',
        category: 'Health',
        raisedSLE: 27_600_000,
        goalSLE: 50_000_000,
        contributors: 171,
        daysLeft: 12,
        verified: true,
    },
    {
        id: 'agro-cold',
        title: 'Shared cold-storage hub for fish traders',
        founder: 'Mohamed Kargbo',
        district: 'Freetown',
        category: 'AgriTech',
        raisedSLE: 22_100_000,
        goalSLE: 35_000_000,
        contributors: 140,
        daysLeft: 18,
        verified: true,
    },
]

const categories: ('All' | Category)[] = [
    'All',
    'AgriTech',
    'Clean Energy',
    'Gara & Craft',
    'EdTech',
    'Health',
]

const contributorTypes = [
    {
        icon: Users,
        label: 'Individuals',
        description:
            'Back an idea directly from Le 5,000. Follow its progress and see exactly where your money goes.',
    },
    {
        icon: Building2,
        label: 'Organizations & businesses',
        description:
            'Sponsor a campaign, fund a category, or match contributions from your community as part of your CSR commitment.',
    },
    {
        icon: Landmark,
        label: 'Government & institutions',
        description:
            'Channel grant or development funding to verified entrepreneurs with full visibility into disbursement and outcomes.',
    },
]

const steps = [
    {
        n: '01',
        title: 'Browse verified ideas',
        body: 'Every campaign is reviewed and tagged by district, sector, and funding stage before it goes live.',
    },
    {
        n: '02',
        title: 'Choose an amount',
        body: 'Contribute any amount in Leones. There is no minimum that locks you out and no maximum that caps your impact.',
    },
    {
        n: '03',
        title: 'Fund securely',
        body: 'Payments are processed through NaWeHub\u2019s payment partners — the same rails used across the platform.',
    },
    {
        n: '04',
        title: 'Track the outcome',
        body: 'Founders post milestone updates. You see what was built, not just what was promised.',
    },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSLE(amount: number): string {
    if (amount >= 1_000_000) {
        const m = amount / 1_000_000
        return `SLE ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
    }
    if (amount >= 1_000) {
        return `SLE ${Math.round(amount / 1_000)}K`
    }
    return `SLE ${amount.toLocaleString()}`
}

function ClothBorder({tone}: { tone: string }) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id="cloth-border" width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={tone} fillOpacity="0.55"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#cloth-border)"/>
            </svg>
        </div>
    )
}

const amountPresets = ['5,000', '25,000', '100,000']

/** Floating contribution form — sits beside the hero copy on desktop, stacks below it on mobile. */
function ContributionCard() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        amount: '',
        method: 'mobile-money' as PaymentMethod,
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // TODO: wire up to your contribution/payment endpoint
        console.log('Contribution submitted', form)
    }

    return (
        <div
            className="relative rounded-md border border-border bg-card p-6 text-card-foreground shadow-[var(--shadow-xl)] transition-colors sm:p-7">
            <div className="absolute -top-4 -right-4 -rotate-6">
                <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[hsl(var(--color-secondary-700)/0.6)] bg-card transition-colors">
                    <Coins className="h-5 w-5 text-[hsl(var(--color-secondary-700))]"/>
                </div>
            </div>

            <span
                className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Make a contribution
            </span>
            <h3 className="mt-1 text-xl font-semibold [font-family:var(--font-display)]">
                Back an idea today
            </h3>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                <div>
                    <label htmlFor="donor-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                        Full name
                    </label>
                    <input
                        id="donor-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                        placeholder="Aminata Sesay"
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-accent"
                    />
                </div>

                <div>
                    <label htmlFor="donor-email" className="mb-1 block text-xs font-medium text-muted-foreground">
                        Email
                    </label>
                    <input
                        id="donor-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({...f, email: e.target.value}))}
                        placeholder="you@example.com"
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-accent"
                    />
                </div>

                <div>
                    <label htmlFor="donor-amount" className="mb-1 block text-xs font-medium text-muted-foreground">
                        Amount
                    </label>
                    <div className="relative">
                        <span
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 [font-family:var(--font-mono)] text-sm text-muted-foreground/70">
                          Le
                        </span>
                        <input
                            id="donor-amount"
                            type="text"
                            inputMode="numeric"
                            required
                            value={form.amount}
                            onChange={(e) => setForm((f) => ({...f, amount: e.target.value}))}
                            placeholder="25,000"
                            className="w-full rounded-sm border border-input bg-background py-2 pl-8 pr-3 text-sm [font-family:var(--font-mono)] text-foreground transition-colors placeholder:text-muted-foreground/70 focus-visible:border-accent"
                        />
                    </div>
                    <div className="mt-2 flex gap-2">
                        {amountPresets.map((p) => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => setForm((f) => ({...f, amount: p}))}
                                className="rounded-full border border-border px-3 py-1 [font-family:var(--font-mono)] text-[11px] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                            >
                                Le {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Payment method</span>
                    <div className="grid grid-cols-3 gap-2">
                        {paymentMethods.map(({id, label, icon: Icon}) => (
                            <button
                                type="button"
                                key={id}
                                onClick={() => setForm((f) => ({...f, method: id}))}
                                className={`flex flex-col items-center gap-1.5 rounded-sm border px-2 py-3 text-center transition-colors ${
                                    form.method === id
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary'
                                }`}
                            >
                                <Icon className="h-4 w-4"/>
                                <span className="text-[10px] leading-tight">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]"
                >
                    Contribute now
                    <ArrowUpRight className="h-4 w-4"/>
                </button>

                <p className="text-center text-[11px] text-muted-foreground/70">
                    Secured by NaWeHub&rsquo;s payment partners. No account needed.
                </p>
            </form>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NextBigIdeaPage() {
    const [activeCategory, setActiveCategory] = useState<'All' | Category>('All')

    const visibleCampaigns =
        activeCategory === 'All' ? campaigns : campaigns.filter((c) => c.category === activeCategory)

    return (
        <div
            className={`relative text-foreground transition-colors duration-300`}
        >

            {/* ---------------------------------------------------------------- */}
            {/* Hero — theme-adaptive, matches the vetted-entrepreneurs hero      */}
            {/* ---------------------------------------------------------------- */}
            <section
                className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background transition-colors duration-300">
                <div className="container mx-auto px-4 pt-20 pb-16">
                    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_360px] lg:gap-10">
                        <div>
                            <div
                                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase [font-family:var(--font-mono)] text-accent">
                                <Sparkles className="h-3.5 w-3.5"/>
                                NaWeHub &middot; Next Big Idea
                            </div>

                            <h1 className="mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl leading-[1.08] [font-family:var(--font-display)] font-semibold text-foreground">
                                Fund the idea that hasn&rsquo;t had its chance yet.
                            </h1>

                            <p className="mt-6 max-w-xl text-base sm:text-lg text-foreground/80 leading-relaxed">
                                Individuals, businesses, and government bodies pool funding behind
                                young entrepreneurs and innovators across Sierra Leone &mdash; from a
                                solar workshop in Kenema to a Gara dye cooperative in Makeni.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <a
                                    href="#campaigns"
                                    className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-[hsl(var(--color-secondary-400))] transition-colors"
                                >
                                    Explore ideas
                                    <ArrowUpRight className="h-4 w-4"/>
                                </a>
                                <a
                                    href="#submit"
                                    className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-accent hover:text-accent transition-colors"
                                >
                                    Submit your idea
                                </a>
                            </div>

                            {/* Ledger-style stat strip */}
                            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
                                {[
                                    ['Le 173M+', 'Raised through the platform'],
                                    ['62', 'Ideas funded to date'],
                                    ['16', 'Districts reached'],
                                    ['981', 'Contributors so far'],
                                ].map(([value, label]) => (
                                    <div key={label}>
                                        <dt className="[font-family:var(--font-mono)] text-2xl sm:text-3xl font-semibold text-foreground">
                                            {value}
                                        </dt>
                                        <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Floating contribution card */}
                        <div className="lg:mt-2">
                            <ContributionCard/>
                        </div>
                    </div>
                </div>
                <ClothBorder tone="hsl(25 95% 53%)"/>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Featured campaigns                                                */}
            {/* ---------------------------------------------------------------- */}
            <section id="campaigns" className="container mx-auto px-4 pb-16 pt-16">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl [font-family:var(--font-display)] font-semibold">
                            Ideas open for funding
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground max-w-md">
                            Every campaign below has passed NaWeHub&rsquo;s founder verification
                            before going live.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                                    activeCategory === cat
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleCampaigns.map((c) => {
                        const pct = Math.min(100, Math.round((c.raisedSLE / c.goalSLE) * 100))
                        const funded = pct >= 100
                        const Icon = CATEGORY_ICON[c.category]

                        return (
                            <article
                                key={c.id}
                                className="relative flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-[var(--shadow-sm)] transition-colors"
                            >
                                {/* Stamp-style category badge */}
                                <div className="absolute -top-3 -left-3 -rotate-6">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[hsl(var(--color-secondary-700)/0.6)] bg-card transition-colors">
                                        <Icon className="h-6 w-6 text-[hsl(var(--color-secondary-700))]"/>
                                    </div>
                                </div>

                                <div className="px-6 pt-10 pb-5">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                        <MapPin className="h-3.5 w-3.5"/>
                                        {c.district}
                                        <span className="mx-1">&middot;</span>
                                        {c.category}
                                    </div>

                                    <h3 className="mt-2 text-lg font-semibold leading-snug [font-family:var(--font-display)]">
                                        {c.title}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        by {c.founder}
                                        {c.verified && (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-primary"
                                                          aria-label="Verified founder"/>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                                className={`h-full rounded-full ${funded ? 'bg-primary' : 'bg-accent'}`}
                                                style={{width: `${pct}%`}}
                                            />
                                        </div>
                                        <div
                                            className="mt-2 flex items-baseline justify-between [font-family:var(--font-mono)] text-sm">
                                            <span className="font-semibold">{formatSLE(c.raisedSLE)}</span>
                                            <span
                                                className="text-muted-foreground/70">of {formatSLE(c.goalSLE)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="mt-auto flex items-center justify-between border-t border-dashed border-border/60 px-6 py-4 text-xs text-muted-foreground">
                                    <span>{c.contributors} contributors</span>
                                    <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5"/>
                                        {funded ? 'Fully funded' : `${c.daysLeft} days left`}
                  </span>
                                </div>

                                <button
                                    className="flex items-center justify-center gap-2 bg-[hsl(var(--color-neutral-900))] py-3 text-sm font-semibold text-[hsl(var(--color-neutral-50))] hover:bg-[hsl(var(--color-neutral-800))] transition-colors">
                                    {funded ? 'See the outcome' : 'Support this idea'}
                                    <ArrowUpRight className="h-4 w-4"/>
                                </button>
                            </article>
                        )
                    })}
                </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Who can contribute                                                */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-muted transition-colors duration-300">
                <div className="container mx-auto px-4 py-16">
                    <h2 className="text-2xl sm:text-3xl [font-family:var(--font-display)] font-semibold max-w-md">
                        Built for every kind of contributor
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {contributorTypes.map(({icon: Icon, label, description}) => (
                            <div
                                key={label}
                                className="rounded-md border border-border bg-card p-7 text-card-foreground transition-colors"
                            >
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground">
                                    <Icon className="h-5 w-5 text-foreground"/>
                                </div>
                                <h3 className="mt-5 font-semibold [font-family:var(--font-display)] text-lg">
                                    {label}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* How it works (real sequence — numbering earns its place here)    */}
            {/* ---------------------------------------------------------------- */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-2xl sm:text-3xl [font-family:var(--font-display)] font-semibold max-w-md">
                    How funding moves
                </h2>

                <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((s) => (
                        <div key={s.n} className="border-t-2 border-foreground pt-4">
                                <span
                                    className="[font-family:var(--font-mono)] text-xs text-[hsl(var(--color-secondary-700))]">{s.n}</span>
                            <h3 className="mt-2 font-semibold [font-family:var(--font-display)] text-base">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* Submit CTA — same fixed brand block as the hero                  */}
            {/* ---------------------------------------------------------------- */}
            <section id="submit" className="bg-[hsl(var(--color-neutral-900))] transition-colors duration-300">
                <ClothBorder tone="hsl(60 9% 98%)"/>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl sm:text-4xl [font-family:var(--font-display)] font-semibold text-[hsl(var(--color-neutral-50))] max-w-xl mx-auto">
                        Building something Sierra Leone needs?
                    </h2>
                    <p className="mt-4 text-[hsl(var(--color-neutral-200))] max-w-md mx-auto text-sm sm:text-base">
                        Submit your idea for review. Verified founders typically go live
                        within five working days.
                    </p>
                    <button
                        className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground hover:bg-[hsl(var(--color-secondary-400))] transition-colors">
                        Submit your idea
                        <ArrowUpRight className="h-4 w-4"/>
                    </button>
                </div>
            </section>
        </div>
    )
}