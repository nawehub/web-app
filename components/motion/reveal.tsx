'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scroll reveals that are safe for server rendering: content is rendered visible, and only
 * after hydration is anything still below the fold hidden and then faded up as it scrolls
 * into view. Without JS (or for crawlers) nothing is ever hidden. Styles live in globals.css
 * ([data-reveal] / [data-reveal-group]); reduced motion shows everything immediately.
 */
function useReveal<T extends HTMLElement>() {
    const ref = useRef<T>(null)
    const [state, setState] = useState<'idle' | 'pending' | 'shown'>('idle')

    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') return
        const rect = el.getBoundingClientRect()
        const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
        // Deferred a frame so the hidden state paints before transitioning to shown.
        const frame = requestAnimationFrame(() => setState(inView ? 'shown' : 'pending'))
        if (inView) return () => cancelAnimationFrame(frame)

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState('shown')
                    observer.disconnect()
                }
            },
            { rootMargin: '0px 0px -10% 0px' },
        )
        observer.observe(el)
        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
        }
    }, [])

    return { ref, state: state === 'idle' ? undefined : state }
}

type RevealProps = {
    children: React.ReactNode
    className?: string
    /** Seconds to wait once in view - for staggering sibling blocks by hand. */
    delay?: number
    /** Distance (px) the content rises as it fades in. */
    y?: number
    as?: 'div' | 'section' | 'li' | 'article' | 'h2' | 'p'
    id?: string
}

export function Reveal({ children, className, delay = 0, y = 24, as: Tag = 'div', id }: RevealProps) {
    const { ref, state } = useReveal<HTMLElement>()
    return (
        <Tag
            ref={ref as React.Ref<never>}
            id={id}
            data-reveal={state}
            className={className}
            style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` } as React.CSSProperties}
        >
            {children}
        </Tag>
    )
}

/** A container whose direct children fade up one after another once it's in view. */
export function RevealGroup({ children, className }: { children: React.ReactNode; className?: string }) {
    const { ref, state } = useReveal<HTMLDivElement>()
    return (
        <div ref={ref} data-reveal-group={state} className={cn(className)}>
            {children}
        </div>
    )
}

/** A child of <RevealGroup> - staggered by its position (see globals.css). */
export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>
}
