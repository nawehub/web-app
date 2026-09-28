'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts the numeric part of a stat ("1,000+", "SLE 10M+", "16") up from zero when it scrolls
 * into view, keeping its prefix/suffix. The real value is rendered until the count starts, so
 * server HTML, crawlers and no-JS visitors see it. Ratios like "24/7" and values without a
 * number are shown as-is.
 */
export function CountUp({ value, duration = 1400, className }: { value: string; duration?: number; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
    const reduce = useReducedMotion()
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/)
    const countable = match !== null && !match[3].startsWith('/')
    const target = countable ? Number(match![2].replace(/,/g, '')) : NaN
    const decimals = countable && match![2].includes('.') ? match![2].split('.')[1].length : 0
    // null = not counting (show the real value)
    const [current, setCurrent] = useState<number | null>(null)

    useEffect(() => {
        if (!inView || Number.isNaN(target) || reduce) return
        let frame = 0
        const start = performance.now()
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            setCurrent(target * (1 - Math.pow(1 - t, 3)))
            if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [inView, target, duration, reduce])

    if (!countable || Number.isNaN(target) || current === null) {
        return <span ref={ref} className={className}>{value}</span>
    }
    const formatted = current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    return (
        <span ref={ref} className={className} aria-label={value}>
            {match![1]}
            {formatted}
            {match![3]}
        </span>
    )
}
