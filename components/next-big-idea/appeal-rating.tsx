import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppealRatingProps {
    rating: number
    className?: string
    size?: 'sm' | 'md'
}

export function AppealRating({ rating, className, size = 'sm' }: AppealRatingProps) {
    const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

    return (
        <div
            className={cn('inline-flex items-center gap-1', className)}
            aria-label={`Appeal rating: ${rating} out of 5`}
        >
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = rating >= i + 1
                const half = !filled && rating > i && rating < i + 1

                return (
                    <Star
                        key={i}
                        className={cn(
                            iconSize,
                            filled
                                ? 'fill-amber-400 text-amber-400'
                                : half
                                  ? 'fill-amber-400/50 text-amber-400'
                                  : 'fill-muted text-muted-foreground/30',
                        )}
                    />
                )
            })}
            <span className={cn(textSize, 'ml-0.5 font-medium text-muted-foreground')}>
                {rating.toFixed(1)}
            </span>
        </div>
    )
}
