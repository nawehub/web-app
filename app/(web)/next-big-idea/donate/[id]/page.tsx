'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Heart, Loader2 } from 'lucide-react'
import { useDonationWatch } from '@/hooks/repository/use-donations'
import { DonationStatus } from '@/components/next-big-idea/donate/donation-status'
import { forgetActiveDonation } from '@/components/next-big-idea/donate/donation-card'

/**
 * Where Monime's checkout sends a card donor back to. Shows the donation's status live - the
 * payment confirmation can take a few seconds to arrive after the redirect.
 */
export default function DonationReturnPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const result = useSearchParams().get('result')
    const { donation, notFound } = useDonationWatch(id)
    const cancelledAtCheckout = result === 'cancelled' && donation?.status === 'PENDING'

    useEffect(() => {
        if (donation && (donation.status !== 'PENDING' || cancelledAtCheckout)) forgetActiveDonation(id)
    }, [donation, cancelledAtCheckout, id])

    return (
        <div className="bg-gradient-to-b from-primary-50 to-muted/40 pt-28 dark:from-primary/10 dark:to-background">
            <div className="container mx-auto max-w-lg px-4 pb-20">
                <Link href="/next-big-idea" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Next Big Idea
                </Link>
                <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-xl)] sm:p-8">
                    <span className="[font-family:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                        Your donation
                    </span>
                    {notFound ? (
                        <p className="mt-4 text-sm text-muted-foreground">We couldn&rsquo;t find that donation.</p>
                    ) : !donation ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-center">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Checking your payment…</p>
                        </div>
                    ) : cancelledAtCheckout ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <p className="font-semibold">You left the checkout</p>
                            <p className="text-sm text-muted-foreground">No money was taken.</p>
                            <Link href="/next-big-idea#donate" className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
                                <Heart className="h-4 w-4" /> Try again
                            </Link>
                        </div>
                    ) : donation.status === 'PENDING' && donation.method === 'CARD' ? (
                        <div className="flex flex-col items-center gap-3 py-10 text-center">
                            <Loader2 className="h-7 w-7 animate-spin text-primary" />
                            <p className="font-semibold">Confirming your payment…</p>
                            <p className="text-xs text-muted-foreground">This page updates by itself.</p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <DonationStatus donation={donation}
                                onRetry={() => window.location.assign('/next-big-idea#donate')}
                                onDonateAgain={() => window.location.assign('/next-big-idea#donate')} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
