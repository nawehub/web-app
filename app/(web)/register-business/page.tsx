'use client'

import RegisterForm from "@/app/(web)/register-business/_components/register-form";
import { Briefcase, Shield, CheckCircle, Clock, IdCard, Building2, FileText, UserCheck, Sparkles } from "lucide-react";

const trustIndicators = [
    { icon: Shield, text: "Secure & Private" },
    { icon: CheckCircle, text: "Free Registration" },
    { icon: Clock, text: "Quick Process" },
]

const requirements = [
    {
        icon: Building2,
        title: "Business details",
        description: "Name, address, category, entity type, and a short description of your activities.",
    },
    {
        icon: UserCheck,
        title: "Owner details",
        description: "Full name, date and place of birth, nationality, mother\u2019s name, and contact information.",
    },
    {
        icon: IdCard,
        title: "Identity document",
        description: "A clear photo or scan of your National ID (Sierra Leonean citizens) or Passport (foreign nationals).",
    },
]

const benefits = [
    {
        icon: FileText,
        title: "Official recognition",
        description: "A registered business is one the law, banks, and partners recognize.",
    },
    {
        icon: Sparkles,
        title: "Access to funding",
        description: "Registered businesses can apply for grants and be featured on Next Big Idea.",
    },
    {
        icon: Shield,
        title: "Legal protection",
        description: "Operate with the protections and obligations of a formally recognized business.",
    },
]

export default function BusinessRegistrationPage() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="mx-auto inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                        <Briefcase className="h-3.5 w-3.5" />
                        Business Registration
                    </div>

                    <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl">
                        Register Your Business
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Join thousands of entrepreneurs on Sierra Leone&rsquo;s leading business
                        platform. Get access to funding, resources, and community support.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        {trustIndicators.map(({ icon: Icon, text }) => (
                            <span
                                key={text}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/80"
                            >
                                <Icon className="h-3.5 w-3.5 text-primary" />
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* What you'll need */}
            <section className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-center text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                        What You&rsquo;ll Need
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
                        Have these ready before you start — it makes the form much faster to
                        complete.
                    </p>

                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {requirements.map((req) => (
                            <div key={req.title} className="rounded-2xl border border-border bg-card p-6">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                    <req.icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-4 font-semibold text-foreground [font-family:var(--font-display)]">
                                    {req.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {req.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5">
                        <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <p className="text-sm leading-relaxed text-foreground/80">
                            <span className="font-semibold text-foreground">A note on identity documents:</span>{' '}
                            Sierra Leonean citizens upload a National ID; foreign nationals upload a
                            Passport. Make sure the photo or scan is clear and all corners are
                            visible — this is the most common reason a submission gets delayed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why register */}
            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="text-center">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                                    <benefit.icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-4 font-semibold text-foreground [font-family:var(--font-display)]">
                                    {benefit.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="container mx-auto px-4 py-16">
                <RegisterForm />
            </section>
        </div>
    )
}