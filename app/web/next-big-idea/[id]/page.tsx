'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Layers,
    MapPin,
    Target,
    TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useBigIdeaQuery } from '@/hooks/repository/use-big-ideas'
import { toNextBigIdea } from '@/lib/services/big-ideas'
import { STAGE_COLORS } from '@/types/next-big-idea'
import { cn } from '@/lib/utils'

export default function NextBigIdeaDetailPage() {
    const params = useParams()
    const id = Array.isArray(params.id) ? params.id[0] : params.id
    const { data: gwIdea, isLoading, isError } = useBigIdeaQuery(id)
    const idea = gwIdea ? toNextBigIdea(gwIdea) : undefined

    if (isLoading) {
        return (
            <main className="container mx-auto max-w-4xl px-4 pb-8 pt-24">
                <Skeleton className="mb-8 h-56 w-full rounded-2xl sm:h-72" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="mt-3 h-4 w-1/3" />
                <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
            </main>
        )
    }

    if (isError || !idea) {
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
                        Promising Innovation
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
                    <span
                        className={cn(
                            'absolute right-4 top-4 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white',
                            STAGE_COLORS[idea.stageValue] ?? 'bg-primary',
                        )}
                    >
                        {idea.stage}
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
                            {idea.testedWithCustomers && (
                                <span className="inline-flex items-center gap-1 text-primary">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Tested with customers
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-base leading-relaxed text-foreground/80">
                    {idea.description}
                </p>

                <div className="mt-8 rounded-2xl border bg-card p-6">
                    <h2 className="font-semibold [font-family:var(--font-display)]">Idea Snapshot</h2>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Snapshot icon={<Layers />} label="Stage" value={idea.stage} />
                        <Snapshot icon={<Target />} label="Target customers" value={idea.targetCustomers} />
                        <Snapshot icon={<TrendingUp />} label="Market size" value={idea.marketSize} />
                        <Snapshot icon={<CheckCircle2 />} label="What makes it new" value={idea.innovationDescription} />
                    </div>

                    {idea.problemStatement && (
                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-sm font-semibold text-foreground">The problem</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea.problemStatement}</p>
                        </div>
                    )}
                    {idea.proposedSolution && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-foreground">The proposed solution</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea.proposedSolution}</p>
                        </div>
                    )}
                    {idea.growthPlan && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-foreground">Growth plan</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea.growthPlan}</p>
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

function Snapshot({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-4 [&_svg]:w-4">
                {icon}
            </span>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value || '—'}</p>
            </div>
        </div>
    )
}
