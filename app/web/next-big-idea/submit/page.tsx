'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Rocket, ShieldCheck, Sparkles } from 'lucide-react'
import SubmitIdeaForm from './_components/submit-form'

export default function SubmitIdeaPage() {
    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>

                <div className="container relative mx-auto px-4 py-16 text-center lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mx-auto max-w-2xl space-y-6"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                            <Lightbulb className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Submit Your Idea</span>
                        </div>

                        <h1 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                            Share Your <span className="text-primary">Next Big Idea</span>
                        </h1>

                        <p className="mx-auto max-w-lg text-[hsl(var(--color-neutral-300))]">
                            Tell us about the problem you&rsquo;ve spotted and the solution you&rsquo;re building. The
                            strongest ideas get featured, connected to funding, and paired with mentors across Sierra Leone.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                            {[
                                { icon: ShieldCheck, text: 'All submissions are reviewed' },
                                { icon: Rocket, text: 'Featured ideas gain visibility' },
                                { icon: Sparkles, text: 'Free to submit — always' },
                            ].map((f) => (
                                <div key={f.text} className="flex items-center gap-2 text-sm text-[hsl(var(--color-neutral-300))]">
                                    <f.icon className="h-4 w-4 text-primary" />
                                    {f.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Cloth border */}
                <div className="h-3 w-full overflow-hidden" aria-hidden="true">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <pattern id="submit-idea-cloth" width="24" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0 6 L12 0 L24 6 L12 12 Z" fill="hsl(60 9% 98%)" fillOpacity="0.55" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#submit-idea-cloth)" />
                    </svg>
                </div>
            </section>

            {/* ── FORM (wizard) ── */}
            <SubmitIdeaForm />
        </div>
    )
}
