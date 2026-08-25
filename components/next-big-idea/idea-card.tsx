import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, MapPin } from 'lucide-react'
import type { NextBigIdea } from '@/types/next-big-idea'
import { STAGE_COLORS } from '@/types/next-big-idea'
import { cn } from '@/lib/utils'

interface IdeaCardProps {
    idea: NextBigIdea
}

export function IdeaCard({ idea }: IdeaCardProps) {
    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
            <div className="relative h-44 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={idea.coverImage}
                    alt={idea.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/placeholder.jpg'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span
                    className={cn(
                        'absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white',
                        STAGE_COLORS[idea.stageValue] ?? 'bg-primary',
                    )}
                >
                    {idea.stage}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {idea.district}
                </div>

                <h3 className="line-clamp-2 text-lg font-semibold leading-snug [font-family:var(--font-display)]">
                    {idea.title}
                </h3>

                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {idea.oneLineDescription}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">by {idea.founder}</span>
                    {idea.testedWithCustomers && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Tested with customers
                        </span>
                    )}
                </div>

                <Link
                    href={`/next-big-idea/${idea.id}`}
                    className="mt-auto flex items-center justify-center gap-2 rounded-sm bg-[hsl(var(--color-neutral-900))] py-3 text-sm font-semibold text-[hsl(var(--color-neutral-50))] transition-colors hover:bg-[hsl(var(--color-neutral-800))]"
                >
                    View This Idea
                    <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
            </div>
        </article>
    )
}
