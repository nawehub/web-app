'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompetitionsQuery, PAST_STATES, RUNNING_STATES } from '@/hooks/repository/use-competitions'
import { useNow } from '@/hooks/use-now'
import { staggerStyle } from '@/lib/motion'
import type { Competition } from '@/types/competition'
import { formatWhen, PHASE_CLASSES, phaseOf } from '@/components/next-big-idea/competitions/phase'

function Card({ c, now, index }: { c: Competition; now: number; index: number }) {
    const phase = phaseOf(c, now)
    return (
        <Link
            href={`/next-big-idea/competitions/${c.id}`}
            className="animate-stagger-in group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={staggerStyle(index, 9)}
        >
            <div className="flex items-start justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${PHASE_CLASSES[phase.tone]}`}>{phase.label}</span>
                <Trophy className="h-6 w-6 text-primary/40 transition-transform group-hover:scale-110" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">{c.title}</h3>
            {c.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>}
            <p className="mt-auto pt-5 text-xs text-muted-foreground">
                {c.state === 'PUBLISHED' ? `Apply by ${formatWhen(c.applicationClosesAt)}` : `Applications closed ${formatWhen(c.applicationClosesAt)}`}
            </p>
        </Link>
    )
}

function Grid({ states, empty }: { states: string[]; empty: string }) {
    const now = useNow()
    const { data, isLoading, isError } = useCompetitionsQuery(states, 30)
    if (isLoading) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
    if (isError) return <p className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">Couldn&apos;t load competitions. Please try again in a moment.</p>
    const items = data?.items ?? []
    if (items.length === 0) return <p className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">{empty}</p>
    return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((c, i) => <Card key={c.id} c={c} now={now} index={i} />)}</div>
}

export default function CompetitionsPage() {
    return (
        <div>
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 pt-28 dark:from-primary/10 dark:to-background">
                <Reveal className="container mx-auto px-4 pb-14 text-center">
                    <div className="mx-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent [font-family:var(--font-mono)]">
                        <Trophy className="h-3.5 w-3.5" /> Next Big Idea
                    </div>
                    <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-semibold text-foreground sm:text-5xl">
                        Competitions
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Enter a saved idea from the Entrepreneur Portal, pitch to our judges, and compete for one of three prizes.
                    </p>
                </Reveal>
            </section>
            <section className="container mx-auto space-y-12 px-4 py-14">
                <div>
                    <h2 className="mb-5 font-display text-2xl font-semibold">Running now</h2>
                    <Grid states={RUNNING_STATES} empty="No competition is running right now - check back soon." />
                </div>
                <div>
                    <h2 className="mb-5 font-display text-2xl font-semibold">Past competitions</h2>
                    <Grid states={PAST_STATES} empty="Finished competitions and their winners will appear here." />
                </div>
            </section>
        </div>
    )
}
