'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Award, CalendarClock, CheckCircle2, Crown, Lightbulb, MapPin, Medal, Mic, Trophy, Video } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCompetitionEntrantsQuery, useCompetitionQuery } from '@/hooks/repository/use-competitions'
import { useNow } from '@/hooks/use-now'
import { PORTAL_COMPETITIONS_URL, type Competition } from '@/types/competition'
import { EntrantsList } from '@/components/next-big-idea/competitions/entrants-list'
import { formatWhen, hasResults, ordinal, PHASE_CLASSES, phaseOf } from '@/components/next-big-idea/competitions/phase'

const JOURNEY = [
    { icon: Lightbulb, title: 'Apply', body: 'Enter one of your saved ideas from the Entrepreneur Portal, with a pitch deck.' },
    { icon: CheckCircle2, title: 'Shortlisting', body: 'The judges score every application against the criteria below.' },
    { icon: Video, title: 'Pitch video', body: 'Shortlisted entrepreneurs send a pitch video of up to 3 minutes.' },
    { icon: Mic, title: 'Live final', body: 'The top finalists pitch live and answer the panel’s questions.' },
    { icon: Crown, title: 'Winners', body: 'Three winners are declared and receive their prizes.' },
]

function Results({ c }: { c: Competition }) {
    const { data, isLoading } = useCompetitionEntrantsQuery(c.id, hasResults(c))
    if (!hasResults(c)) return null
    if (isLoading || !data) return <Skeleton className="h-48 rounded-2xl" />
    const block = (title: string, list: typeof data.shortlisted, ranked = false) =>
        list.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-2 font-display text-lg font-semibold">{title} <span className="text-muted-foreground">({list.length})</span></h3>
                <EntrantsList entrants={list} ranked={ranked} />
            </div>
        )
    return (
        <section aria-labelledby="results" className="space-y-4">
            <h2 id="results" className="font-display text-2xl font-semibold">Results</h2>
            {block('Winners', data.winners, true)}
            {block('Finalists', data.finalists)}
            {block('Shortlisted entrepreneurs', data.shortlisted)}
        </section>
    )
}

export default function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const now = useNow()
    const { data: c, isLoading, isError } = useCompetitionQuery(id)

    if (isLoading) return <div className="container mx-auto space-y-6 px-4 pt-32 pb-16"><Skeleton className="h-56 rounded-3xl" /><Skeleton className="h-72 rounded-2xl" /></div>
    if (isError || !c) {
        return (
            <div className="container mx-auto px-4 pt-32 pb-16 text-center">
                <Trophy className="mx-auto h-10 w-10 text-muted-foreground" />
                <h1 className="mt-4 font-display text-2xl font-semibold">Competition not found</h1>
                <Link href="/next-big-idea/competitions" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">See all competitions</Link>
            </div>
        )
    }
    const phase = phaseOf(c, now)
    const weights = c.evaluationCriteria.reduce((s, x) => s + x.weight, 0)

    return (
        <div>
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))] pt-28 text-[hsl(var(--color-neutral-50))]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>
                <div className="container relative mx-auto px-4 pb-14">
                    <Link href="/next-big-idea/competitions" className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--color-neutral-300))] hover:text-white">
                        <ArrowLeft className="h-4 w-4" /> All competitions
                    </Link>
                    <div className="mt-6">
                        <span className={`inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold ring-1 ${PHASE_CLASSES[phase.tone]}`}>{phase.label}</span>
                    </div>
                    <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold sm:text-5xl">{c.title}</h1>
                    {c.tagline && <p className="mt-3 max-w-2xl text-lg text-[hsl(var(--color-neutral-300))]">{c.tagline}</p>}
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[hsl(var(--color-neutral-300))]">
                        <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" /> Apply {formatWhen(c.applicationOpensAt)} – {formatWhen(c.applicationClosesAt, true)}</span>
                        <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> {c.totalFinalists} finalists · 3 winners</span>
                    </div>
                    {phase.tone === 'open' && (
                        <a href={`${PORTAL_COMPETITIONS_URL}/${c.id}`}
                            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5">
                            Apply in the Entrepreneur Portal <ArrowUpRight className="h-4 w-4" />
                        </a>
                    )}
                    {c.state === 'CANCELLED' && c.cancelReason && <p className="mt-6 max-w-2xl text-sm">This competition was cancelled: {c.cancelReason}</p>}
                </div>
            </section>

            <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <Results c={c} />
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-display text-xl font-semibold">About the competition</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{c.description}</p>
                    </section>
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-display text-xl font-semibold">Who can enter</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{c.eligibilityRequirements}</p>
                    </section>
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-display text-xl font-semibold">How it works</h2>
                        <ol className="mt-5 grid gap-4 sm:grid-cols-5">
                            {JOURNEY.map((s, i) => (
                                <li key={s.title} className="rounded-xl bg-muted/50 p-4">
                                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary"><s.icon className="h-4 w-4" /></span>
                                    <p className="mt-3 text-sm font-semibold">{i + 1}. {s.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{s.body}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
                <aside className="space-y-6">
                    {c.prizes.length > 0 && (
                        <section className="rounded-2xl border border-border bg-card p-6">
                            <h2 className="font-display text-lg font-semibold">Prizes</h2>
                            <ul className="mt-4 space-y-3">
                                {c.prizes.map((p) => (
                                    <li key={p.rank} className="flex gap-3 text-sm">
                                        <Medal className={`mt-0.5 h-5 w-5 shrink-0 ${p.rank === 1 ? 'text-accent' : 'text-muted-foreground'}`} />
                                        <span><span className="font-semibold">{ordinal(p.rank)}: {p.title}</span>{p.description && <><br /><span className="text-muted-foreground">{p.description}</span></>}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-display text-lg font-semibold">Key dates</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            <li><span className="text-muted-foreground">Applications open</span><br />{formatWhen(c.applicationOpensAt, true)}</li>
                            <li><span className="text-muted-foreground">Application deadline</span><br />{formatWhen(c.applicationClosesAt, true)}</li>
                            <li><span className="text-muted-foreground">Pitch videos due</span><br />{formatWhen(c.pitchVideoDeadline, true)}</li>
                            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <span><span className="text-muted-foreground">Live final{c.finalPitch?.format ? ` · ${c.finalPitch.format === 'PHYSICAL' ? 'in person' : 'online'}` : ''}</span><br />
                                    {c.finalPitch?.scheduledAt ? formatWhen(c.finalPitch.scheduledAt, true) : 'To be announced'}
                                    {c.finalPitch?.venue && <><br />{c.finalPitch.venue}</>}</span>
                            </li>
                        </ul>
                    </section>
                    <section className="rounded-2xl border border-border bg-card p-6">
                        <h2 className="font-display text-lg font-semibold">How entries are judged</h2>
                        <ul className="mt-4 space-y-3">
                            {c.evaluationCriteria.map((x) => (
                                <li key={x.id} className="text-sm">
                                    <div className="flex justify-between gap-2"><span className="font-medium">{x.name}</span><span className="text-xs text-muted-foreground">{Math.round((x.weight / weights) * 100)}%</span></div>
                                    {x.description && <p className="text-xs text-muted-foreground">{x.description}</p>}
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    )
}
