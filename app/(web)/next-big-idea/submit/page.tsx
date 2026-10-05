'use client'

import { Lightbulb, PenLine, Rocket, SearchCheck, Send, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from '@/components/motion/reveal'

const PORTAL = 'https://app.nawehub.com'

const STEPS = [
    { icon: UserPlus, title: 'Create your free account', body: 'Sign up on the Entrepreneur Portal and complete your profile - it’s who your idea is submitted by.' },
    { icon: PenLine, title: 'Save your idea as a draft', body: 'Describe the problem, your solution and your market. Add a pitch deck or photos whenever you’re ready.' },
    { icon: Send, title: 'Publish it - or enter a competition', body: 'Send it to our team for review, or enter it into a Next Big Idea competition.' },
]

/** Ideas are created by signed-in entrepreneurs in the Entrepreneur Portal - this explains how to get there. */
function HowToSubmit() {
    return (
        <section className="container mx-auto max-w-4xl px-4 py-14">
            <Reveal className="rounded-3xl border bg-card p-6 text-center shadow-[var(--shadow-sm)] sm:p-10">
                <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Submit your idea from your NaWeHub account</h2>
                <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                    Ideas are submitted by entrepreneurs in the Entrepreneur Portal, so you can keep drafts, add materials,
                    follow the review and enter competitions - all in one place.
                </p>

                <ol className="mt-8 grid gap-4 text-left sm:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <li key={step.title} className="rounded-2xl bg-muted/50 p-5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <step.icon className="h-5 w-5" />
                            </span>
                            <p className="mt-3 text-sm font-semibold text-foreground">{i + 1}. {step.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                        </li>
                    ))}
                </ol>

                <div className="mt-8 flex flex-col items-center gap-3">
                    <a
                        href={`${PORTAL}/register`}
                        className="inline-flex items-center gap-2 rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--color-secondary-400))]"
                    >
                        <UserPlus className="h-4 w-4" /> Create an account to submit your idea
                    </a>
                    <a href={`${PORTAL}/login?next=${encodeURIComponent('/big-ideas/new')}`} className="text-sm text-muted-foreground hover:text-accent">
                        Already have an account? <span className="font-semibold text-foreground underline-offset-4 hover:underline">Sign in</span>
                    </a>
                </div>
            </Reveal>

            <Link
                href="/next-big-idea/track"
                className="hover-lift mx-auto mt-6 flex max-w-md items-center gap-3 rounded-2xl border bg-card p-4 text-sm"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <SearchCheck className="h-5 w-5" />
                </span>
                <span>
                    <span className="block font-semibold text-foreground">Submitted an idea on this site before?</span>
                    <span className="text-muted-foreground">Check its status with your tracking ID.</span>
                </span>
            </Link>
        </section>
    )
}

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
                    <Reveal
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
                    </Reveal>
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

            <HowToSubmit />
        </div>
    )
}
