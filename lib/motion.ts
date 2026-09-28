import type { CSSProperties } from 'react'

/**
 * Inline delay for `.animate-stagger-in` list items. Uses the item's position within its page
 * (capped), so a freshly loaded page staggers in on its own rather than waiting behind the rest.
 */
export function staggerStyle(index: number, pageSize = 12): CSSProperties {
    return { animationDelay: `${Math.min(index % pageSize, 11) * 60}ms` }
}
