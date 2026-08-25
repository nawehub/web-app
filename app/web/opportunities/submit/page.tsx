'use client'

import { Globe, ShieldCheck, Handshake, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import SubmitOpportunityForm from './_components/submit-form'

export default function SubmitOpportunityPage() {
    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>

                <div className="container relative mx-auto px-4 py-16 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        {/* Left copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Submit an Opportunity</span>
                            </div>

                            <h1 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                Share an Opportunity<br />
                                <span className="text-primary">with Thousands of</span><br />
                                Entrepreneurs
                            </h1>

                            <p className="max-w-lg text-[hsl(var(--color-neutral-300))]">
                                Submit funding calls, grants, competitions, events, training programs, and any other
                                opportunities that support entrepreneurs, innovators, SME owners, and other
                                impact-driven individuals across Sierra Leone and beyond.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                {[
                                    { icon: ShieldCheck, text: 'All submissions are reviewed & verified' },
                                    { icon: Globe, text: 'Reach entrepreneurs across Sierra Leone' },
                                    { icon: Handshake, text: 'Free to submit — always' },
                                ].map(f => (
                                    <div key={f.text} className="flex items-center gap-2 text-sm text-[hsl(var(--color-neutral-300))]">
                                        <f.icon className="h-4 w-4 text-primary" />
                                        {f.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — person filling form illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="relative hidden justify-center lg:flex"
                        >
                            <div className="relative h-[380px] w-full max-w-md">
                                <div className="absolute inset-0 rounded-3xl" />
                                {/* Replace src with your own asset */}
                                <img
                                    src="/images/opportunities/person-fill-form.png"
                                    alt="Person filling out an opportunity submission form"
                                    className="h-full w-full object-cover drop-shadow-2xl"
                                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                                />
                                {/* Decorative floating card */}
                                <div className="absolute -left-6 bottom-16 rounded-2xl bg-card px-5 py-4 shadow-[var(--shadow-lg)]">
                                    <p className="text-xs text-muted-foreground">Opportunities submitted</p>
                                    <p className="mt-0.5 text-2xl font-bold text-foreground [font-family:var(--font-mono)]">1,240+</p>
                                    <p className="mt-1 text-xs text-primary">↑ 34 this week</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Cloth border */}
                <div className="h-3 w-full overflow-hidden" aria-hidden="true">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <pattern id="submit-cloth" width="24" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0 6 L12 0 L24 6 L12 12 Z" fill="hsl(60 9% 98%)" fillOpacity="0.55" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#submit-cloth)" />
                    </svg>
                </div>
            </section>

            {/* ── FORM (wizard) ── */}
            <SubmitOpportunityForm />
        </div>
    )
}
