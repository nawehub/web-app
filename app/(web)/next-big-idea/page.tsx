'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock,
    Coins,
    Eye,
    Landmark,
    Lightbulb,
    Loader2,
    Lock,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react'
import { PaymentMethod, paymentMethods } from '@/types/payment'
import { IdeaCard } from '@/components/next-big-idea/idea-card'
import { ClothBorder } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    PLATFORM_STATS,
    SUPPORT_AREAS,
    TRUST_INDICATORS,
    formatSLE,
} from '@/lib/data/next-big-idea'
import { IDEA_STAGES } from '@/lib/gateway-enums'
import { useBigIdeasQuery } from '@/hooks/repository/use-big-ideas'

const amountPresets = ['50', '100', '250', '500']

function ContributionCard() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        amount: '100',
        method: 'mobile-money' as PaymentMethod,
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log('Contribution submitted', form)
    }

    return (
        <div className="relative rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[var(--shadow-xl)] sm:p-7">
            <div className="absolute -top-4 -right-4 -rotate-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[hsl(var(--color-secondary-700)/0.6)] bg-card">
                    <Coins className="h-5 w-5 text-[hsl(var(--color-secondary-700))]" />
                </div>
            </div>

            <span className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Make a Contribution
            </span>
            <h3 className="mt-1 text-xl font-semibold [font-family:var(--font-display)]">
                Support the Next Big Idea pool
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your contribution supports vetted entrepreneurs and innovation projects
                across Sierra Leone — not a single idea directly.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <label
                            htmlFor="contribution-name"
                            className="mb-1.5 block text-xs font-medium text-muted-foreground"
                        >
                            Full name
                        </label>
                        <input
                            id="contribution-name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Your name"
                            className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="contribution-email"
                            className="mb-1.5 block text-xs font-medium text-muted-foreground"
                        >
                            Email address
                        </label>
                        <input
                            id="contribution-email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <span className="mb-2 block text-xs font-medium text-muted-foreground">
                        Choose amount (SLE)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                        {amountPresets.map((p) => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => setForm((f) => ({ ...f, amount: p }))}
                                className={`rounded-sm border px-2 py-2 [font-family:var(--font-mono)] text-xs transition-colors ${
                                    form.amount === p
                                        ? 'border-accent bg-accent text-accent-foreground'
                                        : 'border-border text-muted-foreground hover:border-accent'
                                }`}
                            >
                                SLE {p}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, amount: '' }))}
                            className={`rounded-sm border px-2 py-2 text-xs transition-colors ${
                                !amountPresets.includes(form.amount)
                                    ? 'border-accent bg-accent text-accent-foreground'
                                    : 'border-border text-muted-foreground hover:border-accent'
                            }`}
                        >
                            Custom
                        </button>
                    </div>
                    {!amountPresets.includes(form.amount) && (
                        <input
                            type="text"
                            inputMode="numeric"
                            value={form.amount}
                            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                            placeholder="Enter amount"
                            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm [font-family:var(--font-mono)] focus-visible:border-accent"
                        />
                    )}
                </div>

                <div>
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Payment method
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                        {paymentMethods.map(({ id, label, icon: Icon }) => (
                            <button
                                type="button"
                                key={id}
                                onClick={() => setForm((f) => ({ ...f, method: id }))}
                                className={`flex flex-col items-center gap-1.5 rounded-sm border px-2 py-3 text-center transition-colors ${
                                    form.method === id
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="text-[10px] leading-tight">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]"
                >
                    <Lock className="h-4 w-4" />
                    Contribute Securely
                </button>

                <p className="text-center text-[11px] text-muted-foreground/70">
                    Secured by NaWeHub&rsquo;s payment partners. No account needed.
                </p>
            </form>
        </div>
    )
}

function FundingProgressBar() {
    const pct = Math.min(
        100,
        Math.round((PLATFORM_STATS.raisedSLE / PLATFORM_STATS.targetSLE) * 100),
    )

    return (
        <section className="bg-[hsl(var(--color-neutral-900))] text-[hsl(var(--color-neutral-50))]">
            <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-10 lg:flex-row lg:justify-between">
                <div className="flex items-center gap-6">
                    <div
                        className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-accent"
                        aria-hidden="true"
                    >
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="hsl(var(--color-neutral-700))"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="hsl(var(--color-secondary-500))"
                                strokeWidth="8"
                                strokeDasharray={`${pct * 2.64} 264`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="text-center">
                            <span className="block [font-family:var(--font-mono)] text-xl font-bold">
                                {pct}%
                            </span>
                            <span className="text-[10px] text-[hsl(var(--color-neutral-300))]">
                                of target
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg font-semibold [font-family:var(--font-display)]">
                            {formatSLE(PLATFORM_STATS.raisedSLE)} Raised
                        </p>
                        <p className="text-sm text-[hsl(var(--color-neutral-300))]">
                            of {formatSLE(PLATFORM_STATS.targetSLE)} Target
                        </p>
                        <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[hsl(var(--color-neutral-700))]">
                            <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 lg:justify-end">
                    {[
                        { icon: Users, value: PLATFORM_STATS.contributors, label: 'Contributors' },
                        {
                            icon: Lightbulb,
                            value: PLATFORM_STATS.projectsSupported,
                            label: 'Projects Supported',
                        },
                        {
                            icon: Clock,
                            value: `${PLATFORM_STATS.daysLeft} Days`,
                            label: 'to go',
                        },
                    ].map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-accent" />
                            <div>
                                <span className="block [font-family:var(--font-mono)] text-lg font-semibold">
                                    {value}
                                </span>
                                <span className="text-xs text-[hsl(var(--color-neutral-300))]">
                                    {label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function NextBigIdeaPage() {
    const [activeStage, setActiveStage] = useState<string>('All')

    const { items, isLoading, isLoadingMore, isError, hasNextPage, loadMore } = useBigIdeasQuery({
        stage: activeStage === 'All' ? null : activeStage,
    })

    return (
        <div className="relative text-foreground transition-colors duration-300">
            {/* Hero — matches vetted-entrepreneurs layout */}
            <section className="relative overflow-x-hidden bg-gradient-to-b from-primary-50 to-muted/40 pt-28 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto grid items-start gap-10 px-4 pb-0 lg:grid-cols-[1.04fr_380px]">
                    <div>
                        <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase [font-family:var(--font-mono)] text-accent">
                            <Sparkles className="h-3.5 w-3.5" />
                            NaWeHub &middot; Next Big Idea
                        </div>

                        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[52px]">
                            Support Sierra Leone&rsquo;s
                            <br />
                            <span className="text-primary">Next Big Idea</span>
                        </h1>

                        <p className="mt-5 max-w-[520px] text-lg text-foreground/80">
                            Help innovative entrepreneurs transform bold ideas into sustainable
                            businesses, jobs, and community impact. Contributions go to the
                            innovation pool — featured ideas show what could become the Next Big
                            Idea at any time.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <a
                                href="#contribute"
                                className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]"
                            >
                               Explore ideas
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                            <Link
                                href="/next-big-idea/submit"
                                className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                            >
                                <Eye className="h-4 w-4" />
                                 Submit Your Ideas
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                            {TRUST_INDICATORS.map((label) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6 pb-14">
                            {[
                                { num: PLATFORM_STATS.totalRaisedDisplay, label: 'Total Raised' },
                                {
                                    num: PLATFORM_STATS.entrepreneursSupported,
                                    label: 'Entrepreneurs Supported',
                                },
                                {
                                    num: PLATFORM_STATS.districtsReached,
                                    label: 'Districts Reached',
                                },
                                {
                                    num: PLATFORM_STATS.womenLedStartups,
                                    label: 'Women-led Startups',
                                },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-col gap-0.5">
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

                    <div id="contribute" className="pb-14 lg:pb-20">
                        <ContributionCard />
                        <div className="mt-4 flex gap-3 rounded-2xl border border-white/10 bg-[hsl(var(--color-neutral-900))] p-4 text-[hsl(var(--color-neutral-50))] shadow-xl">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div>
                                <h4 className="font-display text-[15px] font-bold text-white">
                                    Pool-based funding
                                </h4>
                                <p className="mt-1 text-[13px] leading-snug text-[hsl(var(--color-neutral-300))]">
                                    Contributions support the broader innovation pool. Featured
                                    ideas are promising innovations — not direct funding targets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto max-w-5xl px-4 pb-10 lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/vetted-entrepreneurs-hero.png"
                        alt="Entrepreneurs collaborating on innovative projects"
                        className="h-56 w-full rounded-[20px] object-cover shadow-lg sm:h-72"
                    />
                </div>
            </section>

            <ClothBorder />

            <FundingProgressBar />

            {/* What your contribution supports */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-center text-2xl font-semibold [font-family:var(--font-display)] sm:text-3xl">
                    What Your Contribution Supports
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
                    Your support helps us build a strong innovation ecosystem across Sierra
                    Leone.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {SUPPORT_AREAS.map(({ icon: Icon, title, description, color, bg }) => (
                        <div
                            key={title}
                            className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center transition-colors"
                        >
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-full ${bg}`}
                            >
                                <Icon className={`h-6 w-6 ${color}`} />
                            </div>
                            <h3 className="mt-4 text-[15px] font-semibold leading-snug [font-family:var(--font-display)]">
                                {title}
                            </h3>
                            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured innovators */}
            <section id="innovators" className="bg-muted/50 transition-colors">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold [font-family:var(--font-display)] sm:text-3xl">
                                Featured Innovators
                            </h2>
                            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                                Promising innovations that could become the Next Big Idea at any
                                time. Explore their stories — contributions are made to the pool,
                                not to individual ideas.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['All', ...IDEA_STAGES] as const).map((stage) => (
                                <button
                                    key={stage}
                                    onClick={() => setActiveStage(stage)}
                                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                                        activeStage === stage
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground hover:border-primary'
                                    }`}
                                >
                                    {stage}
                                </button>
                            ))}
                        </div>
                    </div>

                    {isError ? (
                        <div className="mt-10 rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">
                                Couldn&apos;t load innovators
                            </p>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Something went wrong. Please try again in a moment.
                            </p>
                        </div>
                    ) : isLoading ? (
                        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                                    <Skeleton className="h-44 w-full rounded-none" />
                                    <div className="space-y-3 p-5">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-5 w-2/3" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="mt-10 rounded-2xl border bg-card p-12 text-center">
                            <p className="font-display text-lg font-bold text-foreground">
                                No innovations match this filter
                            </p>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Try a different stage, or check back soon for new ideas.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((idea) => (
                                    <IdeaCard key={idea.id} idea={idea} />
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
            </section>

            {/* Global stats */}
            <section className="bg-[hsl(var(--color-neutral-900))] text-[hsl(var(--color-neutral-50))]">
                <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4">
                    {[
                        { value: PLATFORM_STATS.totalRaisedDisplay, label: 'Total Raised' },
                        {
                            value: PLATFORM_STATS.entrepreneursSupported,
                            label: 'Entrepreneurs Supported',
                        },
                        { value: PLATFORM_STATS.districtsReached, label: 'Districts Reached' },
                        {
                            value: PLATFORM_STATS.womenLedStartups,
                            label: 'Women-led Startups',
                        },
                    ].map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <p className="[font-family:var(--font-mono)] text-xl font-bold sm:text-2xl">
                                {value}
                            </p>
                            <p className="mt-1 text-xs text-[hsl(var(--color-neutral-300))] sm:text-sm">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Who can contribute */}
            <section className="bg-muted transition-colors duration-300">
                <div className="container mx-auto px-4 py-16">
                    <h2 className="max-w-md text-2xl font-semibold [font-family:var(--font-display)] sm:text-3xl">
                        Built for every kind of contributor
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {[
                            {
                                icon: Users,
                                label: 'Individuals',
                                description:
                                    'Contribute to the innovation pool from Le 50. Follow platform-wide progress and see how funding creates impact.',
                            },
                            {
                                icon: Building2,
                                label: 'Organizations & businesses',
                                description:
                                    'Sponsor the Next Big Idea pool, fund a sector, or match community contributions as part of your CSR commitment.',
                            },
                            {
                                icon: Landmark,
                                label: 'Government & institutions',
                                description:
                                    'Channel grant or development funding with full visibility into disbursement and outcomes across verified ventures.',
                            },
                        ].map(({ icon: Icon, label, description }) => (
                            <div
                                key={label}
                                className="rounded-md border border-border bg-card p-7 text-card-foreground"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground">
                                    <Icon className="h-5 w-5 text-foreground" />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold [font-family:var(--font-display)]">
                                    {label}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="submit" className="bg-primary text-primary-foreground">
                <ClothBorder fillTone="hsl(60 9% 98%)" fillUrl="footer-cloth-border-nbi" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <Lightbulb className="mx-auto h-10 w-10 text-accent" />
                    <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold [font-family:var(--font-display)] sm:text-4xl">
                        Together, We Can Build Sierra Leone&rsquo;s Innovation Future
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-sm text-primary-foreground/80 sm:text-base">
                        Have an idea worth sharing? You must be a registered NaWeHub
                        user/entrepreneur to submit — vetting is not required to apply.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            href="#contribute"
                            className="inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]"
                        >
                            Become a Contributor
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <Link
                            href="/next-big-idea/submit"
                            className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/30 px-7 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                        >
                            Submit Your Idea
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
