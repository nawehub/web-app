'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    MapPin,
    Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppealRating } from '@/components/next-big-idea/appeal-rating'
import {
    formatSLE,
    getIdeaById,
    isFullyFunded,
} from '@/lib/data/next-big-idea'

export default function NextBigIdeaDetailPage() {
    const params = useParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const idea = id ? getIdeaById(id) : undefined

    if (!idea) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-4 pt-20">
                <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center shadow-sm">
                    <h1 className="font-display text-xl font-bold">Idea not found</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This innovation profile doesn&apos;t exist or is no longer available.
                    </p>
                    <Button asChild className="mt-5 rounded-full">
                        <Link href="/web/next-big-idea">
                            <ArrowLeft className="h-4 w-4" /> Back to Next Big Idea
                        </Link>
                    </Button>
                </div>
            </main>
        )
    }

    const pct = Math.min(100, Math.round((idea.raisedSLE / idea.goalSLE) * 100))
    const funded = isFullyFunded(idea)

    return (
        <div>
            <div className="border-b bg-card pt-16">
                <div className="container mx-auto flex max-w-4xl items-center gap-3 px-4 py-3.5">
                    <Link
                        href="/web/next-big-idea"
                        className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" /> All innovators
                    </Link>
                    <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 font-display text-xs font-semibold text-primary">
                        {funded ? 'Fully Funded Big Idea' : 'Promising Innovation'}
                    </span>
                </div>
            </div>

            <main className="container mx-auto max-w-4xl px-4 py-8">
                <div className="relative mb-8 h-56 overflow-hidden rounded-2xl bg-muted sm:h-72">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={idea.coverImage}
                        alt={idea.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/placeholder.jpg'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute right-4 top-4 rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                        {idea.category}
                    </span>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold [font-family:var(--font-display)] sm:text-3xl">
                            {idea.title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {idea.district}
                            </span>
                            <span>by {idea.founder}</span>
                            {idea.verified && (
                                <span className="inline-flex items-center gap-1 text-primary">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Verified founder
                                </span>
                            )}
                        </div>
                    </div>
                    <AppealRating rating={idea.appealRating} size="md" />
                </div>

                <p className="mt-6 text-base leading-relaxed text-foreground/80">
                    {idea.description}
                </p>

                <div className="mt-8 rounded-2xl border bg-card p-6">
                    <h2 className="font-semibold [font-family:var(--font-display)]">
                        {funded ? 'Funding outcome' : 'Funding progress'}
                    </h2>
                    <div className="mt-4">
                        <div className="flex items-baseline justify-between [font-family:var(--font-mono)] text-sm">
                            <span className="text-lg font-semibold">
                                {formatSLE(idea.raisedSLE)}
                            </span>
                            <span className="text-muted-foreground">
                                of {formatSLE(idea.goalSLE)} goal
                            </span>
                        </div>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full rounded-full ${funded ? 'bg-primary' : 'bg-accent'}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {funded ? 'Fully funded' : `${pct}% funded`}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {idea.contributors} contributors
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {funded ? 'Campaign complete' : `${idea.daysLeft} days remaining`}
                        </span>
                    </div>

                    {funded && idea.outcome && (
                        <div className="mt-6 rounded-xl bg-primary/5 p-4">
                            <h3 className="text-sm font-semibold text-primary">Outcome</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {idea.outcome}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        This is a promising innovation showcased on NaWeHub. Contributions are
                        made to the Next Big Idea pool — not directly to individual ideas.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <Button asChild>
                            <Link href="/web/next-big-idea#contribute">
                                Contribute to the Pool
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/web/next-big-idea">
                                <ArrowLeft className="h-4 w-4" /> Back to all innovators
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
