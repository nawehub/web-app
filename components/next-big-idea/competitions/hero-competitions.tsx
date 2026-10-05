'use client'

import Link from 'next/link'
import { ArrowUpRight, CalendarClock, Trophy } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompetitionEntrantsQuery, useCompetitionsQuery, PAST_STATES, RUNNING_STATES } from '@/hooks/repository/use-competitions'
import { useNow } from '@/hooks/use-now'
import { PORTAL_COMPETITIONS_URL, type Competition, type CompetitionEntrant } from '@/types/competition'
import { formatWhen, hasResults, PHASE_CLASSES, phaseOf } from './phase'

function names(list: CompetitionEntrant[], max = 3) {
    const shown = list.slice(0, max).map((e) => e.idea.ideaName).join(', ')
    return list.length > max ? `${shown} +${list.length - max}` : shown
}

/** One line under the competition's title: its deadline, or whatever has been announced. */
function Detail({ c, now }: { c: Competition; now: number }) {
    const { data } = useCompetitionEntrantsQuery(c.id, hasResults(c))
    if (data?.winners.length) return <>Winners: {names(data.winners)}</>
    if (data?.finalists.length) return <>Finalists: {names(data.finalists)}</>
    if (data?.shortlisted.length) return <>Shortlisted: {names(data.shortlisted)}</>
    if (c.state === 'PUBLISHED') {
        return now < Date.parse(c.applicationOpensAt)
            ? <>Applications open {formatWhen(c.applicationOpensAt)}</>
            : <>Apply by {formatWhen(c.applicationClosesAt, true)}</>
    }
    return <>Applications closed {formatWhen(c.applicationClosesAt)}</>
}

/**
 * Competitions on the Next Big Idea hero: the running ones (or, when none is running, the latest
 * finished one), each with its stage and the announced shortlist, finalists or winners.
 */
export function HeroCompetitions() {
    const now = useNow()
    const running = useCompetitionsQuery(RUNNING_STATES, 3)
    const past = useCompetitionsQuery(PAST_STATES, 1)
    const live = running.data?.items ?? []
    const shown = live.length ? live : (past.data?.items ?? []).filter((c) => c.state === 'COMPLETED')

    if (running.isLoading) return <Skeleton className="h-24 w-full max-w-[560px] rounded-2xl" />
    if (shown.length === 0) return null

    return (
        <div id="competitions" className="max-w-[560px]">
            <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent [font-family:var(--font-mono)]">
                    <Trophy className="h-3.5 w-3.5" /> {live.length ? 'Competitions' : 'Latest competition'}
                </span>
                <Link href="/next-big-idea/competitions" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    All competitions <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>
            <ul className="mt-3 space-y-2.5">
                {shown.map((c) => {
                    const phase = phaseOf(c, now)
                    return (
                        <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-3.5 backdrop-blur-sm">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                <Trophy className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <Link href={`/next-big-idea/competitions/${c.id}`} className="truncate font-display text-[15px] font-bold text-foreground hover:text-primary">
                                        {c.title}
                                    </Link>
                                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${PHASE_CLASSES[phase.tone]}`}>{phase.label}</span>
                                </div>
                                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate"><Detail c={c} now={now} /></span>
                                </p>
                            </div>
                            {phase.tone === 'open' ? (
                                <a href={`${PORTAL_COMPETITIONS_URL}/${c.id}`}
                                    className="shrink-0 rounded-sm bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:-translate-y-0.5">
                                    Apply
                                </a>
                            ) : (
                                <Link href={`/next-big-idea/competitions/${c.id}`}
                                    className="shrink-0 rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent">
                                    {hasResults(c) ? 'Results' : 'Details'}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
