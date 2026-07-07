import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { AppealRating } from '@/components/next-big-idea/appeal-rating'
import {
    formatSLE,
    isFullyFunded,
    type NextBigIdea,
} from '@/lib/data/next-big-idea'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
    AgriTech: 'bg-emerald-600',
    'Clean Energy': 'bg-amber-500',
    'Gara & Craft': 'bg-purple-600',
    EdTech: 'bg-blue-600',
    Health: 'bg-rose-600',
}

interface IdeaCardProps {
    idea: NextBigIdea
}

export function IdeaCard({ idea }: IdeaCardProps) {
    const pct = Math.min(100, Math.round((idea.raisedSLE / idea.goalSLE) * 100))
    const funded = isFullyFunded(idea)

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
                        CATEGORY_COLORS[idea.category] ?? 'bg-primary',
                    )}
                >
                    {idea.category}
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
                    {idea.description}
                </p>

                <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">by {idea.founder}</span>
                    <AppealRating rating={idea.appealRating} />
                </div>

                <div>
                    <div className="mb-1.5 flex items-baseline justify-between text-xs">
                        <span className="font-medium text-foreground">
                            {funded ? 'Fully funded' : `${pct}% funded`}
                        </span>
                        <span className="text-muted-foreground">
                            {formatSLE(idea.raisedSLE)} raised
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all',
                                funded ? 'bg-primary' : 'bg-accent',
                            )}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                <Link
                    href={`/web/next-big-idea/${idea.id}`}
                    className="mt-auto flex items-center justify-center gap-2 rounded-sm bg-[hsl(var(--color-neutral-900))] py-3 text-sm font-semibold text-[hsl(var(--color-neutral-50))] transition-colors hover:bg-[hsl(var(--color-neutral-800))]"
                >
                    {funded
                        ? 'Fully Funded Big Idea – See Outcome'
                        : 'Could Be the Next Big Idea'}
                    <ArrowUpRight className="h-4 w-4 shrink-0" />
                </Link>
            </div>
        </article>
    )
}
