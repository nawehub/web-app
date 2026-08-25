import { Mail, Phone, MapPin, Users, Heart, Briefcase, Globe, ArrowRight, MessageCircle, Clock, CheckCircle, Sparkles, Send } from 'lucide-react'
import Link from 'next/link'
import { appMetadata } from "@/utils/app-metadata";
import ContactForm from "@/components/public/contact-form";

const contactReasons = [
    {
        icon: Briefcase,
        title: "Entrepreneurship Support",
        description: "Get help with funding opportunities, business registration, or accessing resources",
    },
    {
        icon: Heart,
        title: "Next Big Idea",
        description: "Questions about contributing to a campaign or launching one of your own",
    },
    {
        icon: Users,
        title: "Partnership Opportunities",
        description: "Collaborate with us as a development partner, hub, or organization",
    },
    {
        icon: Globe,
        title: "Technical Support",
        description: "Need help navigating the platform or experiencing technical issues",
    },
]

const responseTimes = [
    "General inquiries: within 24 hours",
    "Technical support: within 12 hours",
    "Partnership inquiries: within 48 hours",
]

const quickLinks = [
    { href: "/web/faq", label: "Frequently Asked Questions" },
    { href: "https://app.nawehub.com", label: "Visit Entrepreneur Portal" },
    { href: "/web/register-business/track", label: "Track Your Business Registration" },
]

function ClothBorder({ tone }: { tone: string }) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id="contact-cloth-border" width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={tone} fillOpacity="0.55" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#contact-cloth-border)" />
            </svg>
        </div>
    )
}

export default function ContactPage() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="mx-auto inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Get in Touch
                    </div>
                    <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl lg:text-6xl">
                        Let&rsquo;s Build Sierra Leone&rsquo;s <span className="text-primary">Future Together</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        Whether you&rsquo;re an entrepreneur seeking support, a partner looking to
                        collaborate, or someone passionate about district development, we&rsquo;re
                        here to help you succeed.
                    </p>
                </div>
            </section>

            {/* Contact Reasons */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                            How Can We Help You?
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Choose the area where you need support and we&rsquo;ll connect you with the
                            right team.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {contactReasons.map((reason) => (
                            <div
                                key={reason.title}
                                className="rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
                            >
                                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                    <reason.icon className="h-7 w-7" />
                                </span>
                                <h3 className="font-semibold text-foreground [font-family:var(--font-display)]">
                                    {reason.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">{reason.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>

                        <div className="space-y-6">
                            {/* Contact Details */}
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-md)]">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                        <Send className="h-4 w-4" />
                                    </span>
                                    <h3 className="text-lg font-semibold text-foreground [font-family:var(--font-display)]">
                                        Contact Information
                                    </h3>
                                </div>
                                <p className="mb-6 text-sm text-muted-foreground">
                                    Reach out to us directly through any of these channels.
                                </p>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                            <Mail className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Email</h4>
                                            <a
                                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                                href={"mailto:" + appMetadata.Authors.email}
                                            >
                                                {appMetadata.Authors.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                            <Phone className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Phone</h4>
                                            <a
                                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                                href={'tel:' + appMetadata.Authors.phone}
                                            >
                                                {appMetadata.Authors.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                                            <MapPin className="h-5 w-5" />
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Office</h4>
                                            <p className="text-sm text-muted-foreground">{appMetadata.Authors.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Response Time */}
                            <div className="rounded-2xl border border-border bg-primary/5 p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                        <Clock className="h-5 w-5" />
                                    </span>
                                    <h3 className="font-semibold text-foreground [font-family:var(--font-display)]">
                                        Response Time
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    {responseTimes.map((time) => (
                                        <div
                                            key={time}
                                            className="flex items-center gap-3 rounded-xl bg-card/60 p-3"
                                        >
                                            <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                                            <span className="text-foreground/80">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground [font-family:var(--font-display)]">
                                    <Sparkles className="h-5 w-5 text-accent" />
                                    Quick Links
                                </h3>
                                <div className="mt-2 space-y-1">
                                    {quickLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-muted"
                                        >
                                            <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                                                {link.label}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[hsl(var(--color-neutral-900))] text-center">
                        <ClothBorder tone="hsl(25 95% 53%)" />
                        <div className="px-8 py-16">
                            <h2 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl">
                                Ready to Transform Your Business?
                            </h2>
                            <p className="mx-auto mb-8 mt-4 max-w-2xl text-lg text-[hsl(var(--color-neutral-300))]">
                                Join thousands of entrepreneurs across Sierra Leone who are already
                                using NaWeHub to access funding, resources, and community support.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href="/register">
                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))] sm:w-auto">
                                        Get Started Today
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </Link>
                                <Link href="/faq">
                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[hsl(var(--color-neutral-700))] px-8 py-3 font-semibold text-[hsl(var(--color-neutral-50))] transition-colors hover:border-accent hover:text-accent sm:w-auto">
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <ClothBorder tone="hsl(60 9% 98%)" />
                    </div>
                </div>
            </section>
        </div>
    );
}