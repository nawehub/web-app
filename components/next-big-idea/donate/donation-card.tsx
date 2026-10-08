'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import { Coins, CreditCard, Heart, Loader2, Lock, Smartphone } from 'lucide-react'
import { donationsService } from '@/lib/services/donations'
import { useDonationWatch } from '@/hooks/repository/use-donations'
import { DONATION_OPTIONS, formatAmount, type Donation, type DonationMethod } from '@/types/donation'
import { DonationStatus } from './donation-status'

const ACTIVE_KEY = 'nwh-active-donation'

interface FormState {
    amount: string
    method: DonationMethod
    fullName: string
    contact: string
    anonymous: boolean
}

const EMPTY: FormState = { amount: DONATION_OPTIONS.MOBILE_MONEY.initial, method: 'MOBILE_MONEY', fullName: '', contact: '', anonymous: false }

function readActive(): { id: string; name: string } | null {
    try {
        const raw = localStorage.getItem(ACTIVE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function writeActive(value: { id: string; name: string } | null) {
    try {
        if (value) localStorage.setItem(ACTIVE_KEY, JSON.stringify(value))
        else localStorage.removeItem(ACTIVE_KEY)
    } catch {
        /* private browsing - resuming after a reload just won't work */
    }
}

/** The return page has shown the outcome - don't show it again when the donor goes back to the card. */
export function forgetActiveDonation(id: string) {
    if (readActive()?.id === id) writeActive(null)
}

/** Email if it looks like one, otherwise treated as a phone number. */
function splitContact(contact: string) {
    const value = contact.trim()
    return value.includes('@') ? { email: value, phone: undefined } : { email: undefined, phone: value }
}

function validate(f: FormState): string | null {
    const amount = Number(f.amount)
    const { currency, min, max } = DONATION_OPTIONS[f.method]
    if (!f.amount || Number.isNaN(amount)) return 'Choose an amount'
    if (amount < min) return `The smallest donation is ${formatAmount(min, currency)}`
    if (amount > max) return 'For very large donations, please contact us'
    if (!/^\d+(\.\d{1,2})?$/.test(f.amount)) return 'Use at most 2 decimal places'
    if (f.fullName.trim().length < 2) return 'Enter your name'
    const contact = f.contact.trim()
    if (!contact) return 'Enter your email or phone number so we can send a receipt'
    if (contact.includes('@') ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : !/^\+?[0-9\s\-()]{7,20}$/.test(contact))
        return 'Enter a valid email or phone number'
    return null
}

/**
 * Donate to the Next Big Idea fund without leaving the page: pick an amount, say who you are, and
 * pay by mobile money (a code to dial, confirmed live) or card (Monime's secure checkout).
 */
export function DonationCard() {
    const queryClient = useQueryClient()
    const [form, setForm] = useState<FormState>(EMPTY)
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [active, setActive] = useState<{ id: string; name: string; initial?: Donation } | null>(null)
    const { donation } = useDonationWatch(active?.id ?? null, active?.initial ?? null)
    const options = DONATION_OPTIONS[form.method]
    const custom = !options.presets.map(String).includes(form.amount)

    // Pick up a donation still in progress (e.g. after a reload while waiting for mobile money).
    useEffect(() => {
        const saved = readActive()
        if (saved) setActive(saved)
    }, [])

    useEffect(() => {
        if (!donation) return
        if (donation.status !== 'PENDING') {
            writeActive(null)
            if (donation.status === 'COMPLETED') queryClient.invalidateQueries({ queryKey: ['fund-summary'] })
        } else if (donation.method === 'CARD' && donation.ready && donation.checkoutUrl) {
            window.location.assign(donation.checkoutUrl)
        }
    }, [donation, queryClient])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        const problem = validate(form)
        setError(problem)
        if (problem) return
        setSubmitting(true)
        try {
            const started = await donationsService().start({
                fullName: form.fullName.trim(),
                ...splitContact(form.contact),
                anonymous: form.anonymous,
                amount: Number(form.amount),
                method: form.method,
                returnUrl: form.method === 'CARD' ? `${window.location.origin}/next-big-idea/donate/{donationId}` : undefined,
            })
            writeActive({ id: started.id, name: form.fullName.trim() })
            setActive({ id: started.id, name: form.fullName.trim(), initial: started })
            // Card: straight on to Monime's checkout when it's ready (otherwise the watch picks it up).
            if (started.method === 'CARD' && started.ready && started.checkoutUrl) window.location.assign(started.checkoutUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'We couldn’t start your donation. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    function reset(keepDetails: boolean) {
        // After a reload the form starts empty - the resumed donation still knows who's giving.
        const name = active?.name ?? ''
        writeActive(null)
        setActive(null)
        setError(null)
        if (!keepDetails) setForm((f) => ({ ...EMPTY, fullName: f.fullName || name, contact: f.contact }))
        else setForm((f) => (f.fullName ? f : { ...f, fullName: name }))
    }

    const current = donation ?? active?.initial ?? null

    return (
        <div id="donate" className="relative rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-[var(--shadow-xl)] sm:p-7">
            <div className="absolute -right-4 -top-4 -rotate-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[hsl(var(--color-secondary-700)/0.6)] bg-card">
                    <Coins className="h-5 w-5 text-[hsl(var(--color-secondary-700))]" />
                </div>
            </div>

            <span className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Make a Contribution
            </span>
            <h3 className="mt-1 text-xl font-semibold [font-family:var(--font-display)]">Support the Next Big Idea pool</h3>

            <AnimatePresence mode="wait">
                {active && current ? (
                    <motion.div key="status" className="mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DonationStatus
                            donation={current}
                            donorName={active.name}
                            onRetry={() => reset(true)}
                            onDonateAgain={() => reset(false)}
                        />
                        {current.status === 'PENDING' && current.method === 'MOBILE_MONEY' && (
                            <button type="button" onClick={() => reset(true)} className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground">
                                Start over
                            </button>
                        )}
                    </motion.div>
                ) : active ? (
                    <motion.div key="loading" className="mt-5 flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></motion.div>
                ) : (
                    <motion.form key="form" onSubmit={submit} noValidate className="mt-4 flex flex-col gap-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            Your contribution supports vetted entrepreneurs and innovation projects across Sierra Leone - not a single idea directly.
                        </p>

                        <fieldset>
                            <legend className="mb-2 block text-xs font-medium text-muted-foreground">Amount ({options.currency})</legend>
                            <div className="grid grid-cols-5 gap-2">
                                {options.presets.map((p) => (
                                    <button type="button" key={p} aria-pressed={form.amount === String(p)}
                                        onClick={() => setForm((f) => ({ ...f, amount: String(p) }))}
                                        className={`rounded-sm border px-1 py-2 [font-family:var(--font-mono)] text-xs transition-colors ${
                                            form.amount === String(p) ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground hover:border-accent'}`}>
                                        {options.currency === 'USD' ? `$${p}` : p}
                                    </button>
                                ))}
                                <button type="button" aria-pressed={custom} onClick={() => setForm((f) => ({ ...f, amount: '' }))}
                                    className={`rounded-sm border px-1 py-2 text-xs transition-colors ${
                                        custom ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-muted-foreground hover:border-accent'}`}>
                                    Other
                                </button>
                            </div>
                            {custom && (
                                <input type="text" inputMode="decimal" autoFocus aria-label={`Amount in ${options.currency}`} value={form.amount}
                                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^\d.]/g, '') }))}
                                    placeholder={`At least ${options.min}`}
                                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm [font-family:var(--font-mono)] focus-visible:border-accent focus-visible:outline-none" />
                            )}
                        </fieldset>

                        <fieldset>
                            <legend className="mb-1.5 block text-xs font-medium text-muted-foreground">Pay with</legend>
                            <div className="grid grid-cols-2 gap-2">
                                {([['MOBILE_MONEY', Smartphone, 'Mobile money', 'Orange · Africell'], ['CARD', CreditCard, 'Card', 'In US dollars']] as const).map(([id, Icon, label, hint]) => (
                                    <button type="button" key={id} aria-pressed={form.method === id} onClick={() => setForm((f) => (f.method === id ? f : { ...f, method: id, amount: DONATION_OPTIONS[id].initial }))}
                                        className={`flex items-center gap-2 rounded-sm border px-3 py-2.5 text-left transition-colors ${
                                            form.method === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary'}`}>
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span className="leading-tight">
                                            <span className="block text-xs font-semibold">{label}</span>
                                            <span className="block text-[10px] opacity-80">{hint}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        <div className="grid gap-3">
                            <div>
                                <label htmlFor="donor-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Your name</label>
                                <input id="donor-name" type="text" autoComplete="name" value={form.fullName} maxLength={150}
                                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Full name"
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none" />
                            </div>
                            <div>
                                <label htmlFor="donor-contact" className="mb-1.5 block text-xs font-medium text-muted-foreground">Email or phone (for your receipt)</label>
                                <input id="donor-contact" type="text" autoComplete="email" value={form.contact} maxLength={200}
                                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="you@example.com or 076 123456"
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus-visible:border-accent focus-visible:outline-none" />
                            </div>
                            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                                <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
                                    className="h-4 w-4 accent-[hsl(var(--color-primary-500))]" />
                                Don&rsquo;t show my name with my donation
                            </label>
                        </div>

                        {error && <p role="alert" className="text-sm text-error">{error}</p>}

                        <button type="submit" disabled={submitting}
                            className="mt-1 inline-flex items-center justify-center gap-2 rounded-sm bg-accent py-3 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--color-secondary-400))] disabled:translate-y-0 disabled:opacity-70">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                            {submitting ? 'Starting…' : `Donate ${Number(form.amount) >= options.min ? formatAmount(Number(form.amount), options.currency) : ''}`.trim()}
                        </button>
                        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground/80">
                            <Lock className="h-3 w-3" /> Payments are processed securely by Monime.
                        </p>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
