'use client'

import Link from 'next/link'
import { ArrowUpRight, CalendarClock, Medal, Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompetitionEntrantsQuery, useCompetitionsQuery, PAST_STATES, RUNNING_STATES } from '@/hooks/repository/use-competitions'
import { useNow } from '@/hooks/use-now'
import { staggerStyle } from '@/lib/motion'
import { PORTAL_COMPETITIONS_URL, type Competition } from '@/types/competition'
import { EntrantsList } from './entrants-list'
import { formatWhen, hasResults, PHASE_CLASSES, phaseOf } from './phase'

/** One competition on the Next Big Idea page: what it is, and whatever has been announced. */
function CompetitionFeature({ c, now, index }: { c: Competition; now: number; index: number }) {
    const phase = phaseOf(c, now)
    const results = useCompetitionEntrantsQuery(c.id, hasResults(c))
    const open = phase.tone === 'open'
    const first = c.prizes.find((p) => p.rank === 1)
    const winners = results.data?.winners ?? []
    const finalists = results.data?.finalists ?? []
    const shortlisted = results.data?.shortlisted ?? []
    const [listTitle, list, ranked] = winners.length
        ? ['Winners', winners, true]
        : finalists.length
            ? ['Finalists', finalists, false]
            : ['Shortlisted entrepreneurs', shortlisted, false]

    return (
        <article
            className="animate-stagger-in grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-[1.1fr_1fr]"
            style={staggerStyle(index, 4)}
        >
            <div className="relative p-6 sm:p-8">
                <Trophy className="absolute right-6 top-6 h-16 w-16 text-primary/10" aria-hidden />
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ring-1 ${PHASE_CLASSES[phase.tone]}`}>{phase.label}</span>
                <h3 className="mt-4 font-display text-2xl font-bold text-foreground sm:text-3xl">{c.title}</h3>
                {c.tagline && <p className="mt-2 text-muted-foreground">{c.tagline}</p>}
                <ul className="mt-5 space-y-2 text-sm text-foreground/80">
                    {c.state === 'PUBLISHED' && (
                        <li className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            {now < Date.parse(c.applicationOpensAt)
                                ? `Applications open ${formatWhen(c.applicationOpensAt)}`
                                : `Apply by ${formatWhen(c.applicationClosesAt, true)}`}
                        </li>
                    )}
                    {first && (
                        <li className="flex items-center gap-2">
                            <Medal className="h-4 w-4 text-accent" /> 1st prize: {first.title}
                        </li>
                    )}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                    {open && (
                        <a
                            href={`${PORTAL_COMPETITIONS_URL}/${c.id}`}
                            className="inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5"
                        >
                            Apply in the Entrepreneur Portal <ArrowUpRight className="h-4 w-4" />
                        </a>
                    )}
                    <Link
                        href={`/next-big-idea/competitions/${c.id}`}
                        className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                        Competition details
                    </Link>
                </div>
            </div>
            <div className="border-t border-border bg-muted/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
                {hasResults(c) ? (
                    results.isLoading ? (
                        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                    ) : (
                        <>
                            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground [font-family:var(--font-mono)]">
                                {listTitle} ({list.length})
                            </p>
                            <EntrantsList entrants={list.slice(0, 6)} ranked={ranked} compact />
                            {list.length > 6 && (
                                <Link href={`/next-big-idea/competitions/${c.id}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
                                    See all {list.length}
                                </Link>
                            )}
                        </>
                    )
                ) : (
                    <>
                        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground [font-family:var(--font-mono)]">How it works</p>
                        <ol className="space-y-2.5 text-sm text-foreground/80">
                            {['Apply with one of your saved ideas', 'Get shortlisted by the judges', 'Send a pitch video of up to 3 minutes', 'Pitch live as a finalist', 'Three winners are declared'].map((step, i) => (
                                <li key={step} className="flex items-center gap-3">
                                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </>
                )}
            </div>
        </article>
    )
}

/**
 * The Next Big Idea page's competition section: running competitions (with their announced
 * shortlist, finalists or winners), or the most recent finished one when none is running.
 */
export function CompetitionsSection() {
    const now = useNow()
    const running = useCompetitionsQuery(RUNNING_STATES, 3)
    const past = useCompetitionsQuery(PAST_STATES, 1)
    const live = running.data?.items ?? []
    const recent = (past.data?.items ?? []).filter((c) => c.state === 'COMPLETED')
    const shown = live.length ? live : recent

    if (running.isLoading) {
        return (
            <section className="container mx-auto px-4 py-16">
                <Skeleton className="h-72 w-full rounded-3xl" />
            </section>
        )
    }
    if (shown.length === 0) return null

    return (
        <section id="competitions" className="container mx-auto px-4 py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent [font-family:var(--font-mono)]">
                        <Trophy className="h-3.5 w-3.5" /> Competitions
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold [font-family:var(--font-display)] sm:text-3xl">
                        {live.length ? 'Compete for the Next Big Idea' : 'Our latest winners'}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                        Entrepreneurs enter a saved idea, the judges shortlist the strongest, shortlisted entrants pitch on video, and the
                        finalists pitch live for one of three prizes.
                    </p>
                </div>
                <Link href="/next-big-idea/competitions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    All competitions <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="mt-8 space-y-6">
                {shown.map((c, i) => <CompetitionFeature key={c.id} c={c} now={now} index={i} />)}
            </div>
        </section>
    )
}
