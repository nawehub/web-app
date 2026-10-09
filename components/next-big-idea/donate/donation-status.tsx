'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle2, Clock, Copy, CreditCard, Heart, Loader2, PhoneCall, RotateCcw, Share2, Smartphone, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatAmount, type Donation } from '@/types/donation'

const FALLBACK_STEPS = [
    'Dial the code on the phone with your Orange Money or Africell Money account',
    'Check the amount and confirm with your PIN',
    'Keep this page open - it updates as soon as your payment arrives',
]

/** Seconds left until `iso`, ticking every second; null when there's no expiry. */
function useSecondsLeft(iso: string | null) {
    const [left, setLeft] = useState<number | null>(null)
    useEffect(() => {
        if (!iso) return
        const end = Date.parse(iso)
        const tick = () => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)))
        tick()
        const timer = setInterval(tick, 1000)
        return () => clearInterval(timer)
    }, [iso])
    return iso ? left : null
}

function Burst() {
    // A few dots flying out of the tick - a small celebration, not a light show.
    const dots = Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2
        return { x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, color: i % 3 === 0 ? 'bg-accent' : i % 3 === 1 ? 'bg-primary' : 'bg-[hsl(var(--color-secondary-400))]' }
    })
    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            {dots.map((d, i) => (
                <motion.span
                    key={i}
                    className={`absolute h-2 w-2 rounded-full ${d.color}`}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: d.x, y: d.y, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
                />
            ))}
        </div>
    )
}

/**
 * Big enough to read at a glance, small enough that the whole code fits on one line of the card:
 * a monospace character with wider tracking is about 0.66em, so share the box's width between them.
 */
function codeFontSize(code: string) {
    return `min(1.875rem, ${(100 / (code.length * 0.66)).toFixed(2)}cqi)`
}

/** A USSD code as a tel: link - "#" has to be escaped or the dialler drops everything after it. */
function telHref(code: string) {
    return `tel:${code.replace(/#/g, '%23')}`
}

/**
 * Where a donation is, and what the donor should do next. Used by the hero card and by the page
 * Monime's checkout returns to.
 */
export function DonationStatus({ donation, donorName, onRetry, onDonateAgain }: {
    donation: Donation
    donorName?: string
    onRetry?: () => void
    onDonateAgain?: () => void
}) {
    const seconds = useSecondsLeft(donation.status === 'PENDING' ? donation.expiresAt : null)
    const [copied, setCopied] = useState(false)
    const amount = formatAmount(donation.amount.value, donation.amount.currency)
    const firstName = donorName?.trim().split(/\s+/)[0]

    let key = donation.status as string
    if (donation.status === 'PENDING') key = !donation.ready ? 'preparing' : donation.method === 'CARD' ? 'redirecting' : 'dial'

    return (
        <div aria-live="polite">
            <AnimatePresence mode="wait">
                <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    {key === 'preparing' && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="font-semibold">Preparing your {donation.method === 'CARD' ? 'secure checkout' : 'payment code'}…</p>
                            <p className="text-xs text-muted-foreground">This usually takes a few seconds.</p>
                        </div>
                    )}

                    {key === 'redirecting' && (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <CreditCard className="h-8 w-8 text-primary" />
                            <p className="font-semibold">Taking you to secure checkout…</p>
                            {donation.checkoutUrl && (
                                <a href={donation.checkoutUrl} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                                    Continue to checkout
                                </a>
                            )}
                        </div>
                    )}

                    {key === 'dial' && donation.ussdCode && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Smartphone className="h-4 w-4 text-primary" /> Dial to pay {amount}
                            </div>
                            <div className="rounded-xl bg-[hsl(var(--color-neutral-900))] p-4 text-center [container-type:inline-size]">
                                <p className="select-all whitespace-nowrap font-mono font-bold tracking-wider text-white" aria-label="Payment code"
                                    style={{ fontSize: codeFontSize(donation.ussdCode) }}>
                                    {donation.ussdCode}
                                </p>
                                <div className="mt-3 flex justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard?.writeText(donation.ussdCode!)
                                            setCopied(true)
                                            toast('Code copied')
                                            setTimeout(() => setCopied(false), 2000)
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-sm border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy'}
                                    </button>
                                    <a href={telHref(donation.ussdCode)}
                                        className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:hidden">
                                        <PhoneCall className="h-3.5 w-3.5" /> Dial now
                                    </a>
                                </div>
                            </div>
                            <ol className="space-y-2">
                                {(donation.instructions?.steps.length ? donation.instructions.steps : FALLBACK_STEPS).map((step, i) => (
                                    <li key={i} className="flex gap-2.5 text-sm text-foreground/85">
                                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">{i + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                            <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5 text-xs">
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                                    </span>
                                    Waiting for your payment…
                                </span>
                                {seconds !== null && (
                                    <span className="flex items-center gap-1 font-mono text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {key === 'COMPLETED' && (
                        <div className="relative flex flex-col items-center gap-3 py-6 text-center">
                            <Burst />
                            <motion.span
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15 }}
                                className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary"
                            >
                                <CheckCircle2 className="h-9 w-9" />
                            </motion.span>
                            <p className="font-display text-xl font-bold">Thank you{firstName ? `, ${firstName}` : ''}!</p>
                            <p className="max-w-xs text-sm text-muted-foreground">
                                Your {amount} has reached the Next Big Idea fund - backing Sierra Leone&rsquo;s next generation of entrepreneurs.
                            </p>
                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const url = `${window.location.origin}/next-big-idea`
                                        const text = 'I just backed Sierra Leone’s Next Big Idea fund on NaWeHub.'
                                        if (navigator.share) await navigator.share({ title: 'NaWeHub Next Big Idea', text, url }).catch(() => undefined)
                                        else { navigator.clipboard?.writeText(`${text} ${url}`); toast('Link copied - share it!') }
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                                >
                                    <Share2 className="h-4 w-4" /> Share
                                </button>
                                {onDonateAgain && (
                                    <button type="button" onClick={onDonateAgain}
                                        className="inline-flex items-center gap-1.5 rounded-sm border border-border px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
                                        <Heart className="h-4 w-4" /> Donate again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {(key === 'FAILED' || key === 'CANCELLED' || key === 'EXPIRED') && (
                        <div className="flex flex-col items-center gap-3 py-6 text-center">
                            <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
                                {key === 'EXPIRED' ? <Clock className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
                            </span>
                            <p className="font-semibold">
                                {key === 'EXPIRED' ? 'The payment time ran out' : key === 'CANCELLED' ? 'Payment cancelled' : 'That payment didn’t go through'}
                            </p>
                            <p className="max-w-xs text-sm text-muted-foreground">
                                {key === 'EXPIRED' ? 'No money was taken. Get a new code and try again.'
                                    : key === 'CANCELLED' ? 'No money was taken.'
                                        : 'No money was taken. Please try again, or use another way to pay.'}
                            </p>
                            {onRetry && (
                                <button type="button" onClick={onRetry}
                                    className="mt-1 inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                                    <RotateCcw className="h-4 w-4" /> Try again
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
