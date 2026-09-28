import Link from 'next/link'
import {
    ArrowRight,
    BookOpen,
    DollarSign,
    FileText,
    Heart,
    Network,
    Shield,
    TrendingUp,
    Users,
    CheckCircle,
    Globe,
    Target,
    Sparkles,
    Building2,
    Rocket,
    ChevronRight,
} from 'lucide-react'
import ContactUsSection from "@/components/public/ContactUsSection";
import ScrollPartners from "@/components/public/ScrollPartners";
import Testimonies from "@/components/public/testimonies";
import Benefits from "@/components/public/benefit";
import {Reveal, RevealGroup, RevealItem} from "@/components/motion/reveal";
import {CountUp} from "@/components/motion/count-up";

const stats = [
    { number: "16", label: "Districts Covered", icon: Globe },
    { number: "1,000+", label: "Businesses Supported", icon: Users },
    { number: "SLE 10M+", label: "Funds Raised", icon: DollarSign },
    { number: "24/7", label: "Support Available", icon: Shield },
]

const features = [
    { icon: BookOpen, title: "Resource Library", description: "Comprehensive business guides and templates" },
    { icon: DollarSign, title: "Financing & Grants", description: "Funding opportunities tailored to you" },
    { icon: FileText, title: "Compliance Guides", description: "Navigate legal requirements" },
    { icon: Network, title: "Business Network", description: "Connect with entrepreneurs" },
]

const ideaFeatures = [
    { icon: Heart, title: "Micro-contributions", description: "Starting from just 5 NLE" },
    { icon: TrendingUp, title: "District Leaderboards", description: "Track achievements" },
    { icon: Shield, title: "Transparency", description: "Full fund visibility" },
    { icon: Target, title: "Project Funding", description: "Support local initiatives" },
]

/** Thin repeating diamond border — the same Gara-cloth-trim signature used on the Next Big Idea page. */
function ClothBorder({ tone }: { tone: string }) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id="home-cloth-border" width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={tone} fillOpacity="0.55" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#home-cloth-border)" />
            </svg>
        </div>
    )
}

export default function WebHome() {
    return (
        <div>
            {/* ========== HERO ========== */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                {/* Slowly drifting brand glows behind the hero copy */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="animate-drift absolute -left-32 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
                    <div className="animate-drift absolute -right-24 top-40 h-72 w-72 rounded-full bg-accent/15 blur-[100px] [animation-delay:-7s]" />
                </div>
                <div className="container relative mx-auto px-4 py-20 lg:py-28">
                    <div className="mx-auto max-w-3xl space-y-8 text-center">
                        <Reveal y={12} className="inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse-subtle" />
                            Sierra Leone&rsquo;s Leading Business Platform
                        </Reveal>

                        <Reveal delay={0.08}>
                        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground [font-family:var(--font-display)] sm:text-5xl lg:text-6xl">
                            Empowering{' '}
                            <span className="relative inline-block">
                                <span className="text-primary">Entrepreneurs</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" aria-hidden="true">
                                    <path d="M2 10C50 4 150 0 298 6" stroke="url(#hero-underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="hero-underline-gradient" x1="0" y1="0" x2="300" y2="0">
                                            <stop stopColor="hsl(160 84% 39%)" />
                                            <stop offset="0.5" stopColor="hsl(25 95% 53%)" />
                                            <stop offset="1" stopColor="hsl(160 84% 39%)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <br />
                            <span className="text-foreground/70">Across Sierra Leone</span>
                        </h1>
                        </Reveal>

                        <Reveal delay={0.16}>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                            Access funding, resources, and a thriving community. Register your business
                            and join the movement building a stronger economy.
                        </p>
                        </Reveal>

                        <Reveal delay={0.24} className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                            <div className="w-full sm:w-auto"><Link href="https://app.nawehub.com" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[var(--shadow-xl)] sm:w-auto">
                                    <Rocket className="h-5 w-5" />
                                    Start Your Journey
                                    <ChevronRight className="h-5 w-5" />
                                </Link></div>
                            <div className="w-full sm:w-auto"><Link href="/next-big-idea" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-8 py-4 text-lg font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent sm:w-auto">
                                    <Heart className="h-5 w-5 text-accent" />
                                    Next Big Idea
                                    <ChevronRight className="h-5 w-5 opacity-50" />
                                </Link></div>
                        </Reveal>

                        <Reveal delay={0.32} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" /> Free to Register
                            </span>
                            <span className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" /> Secure Platform
                            </span>
                            <span className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" /> 1,000+ Businesses
                            </span>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ========== QUICK STATS ========== */}
            <section className="relative z-20 -mt-8 px-4">
                <div className="container mx-auto max-w-5xl px-0">
                    <Reveal delay={0.4} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-xl)] lg:p-8">
                        <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
                            {stats.map((stat) => (
                                <RevealItem key={stat.label} className="group text-center">
                                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                                        <stat.icon className="h-6 w-6" />
                                    </span>
                                    <div className="[font-family:var(--font-mono)] text-2xl font-semibold text-foreground lg:text-3xl">
                                        <CountUp value={stat.number} />
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                                </RevealItem>
                            ))}
                        </RevealGroup>
                    </Reveal>
                </div>
            </section>

            {/* ========== TWO PLATFORMS ========== */}
            <section className="py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <Reveal className="mx-auto mb-16 max-w-2xl text-center">
                        <span className="mb-4 inline-block [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                            Two Paths, One Mission
                        </span>
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                            Choose Your Journey
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Whether you&rsquo;re building a business or backing the next generation of
                            entrepreneurs, NaWeHub is your partner in progress.
                        </p>
                    </Reveal>

                    <RevealGroup className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Business Platform Card */}
                        <RevealItem className="h-full">
                        <div className="hover-lift group flex h-full flex-col rounded-3xl border border-border bg-card p-8 hover:border-primary/40 lg:p-10">
                            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                                <Building2 className="h-8 w-8" />
                            </span>
                            <h3 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Business Support Hub
                            </h3>
                            <p className="mt-3 text-muted-foreground">
                                Everything you need to start, grow, and scale your business in Sierra
                                Leone.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {features.map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                            <feature.icon className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <span className="block text-sm font-medium text-foreground">{feature.title}</span>
                                            <span className="text-xs text-muted-foreground">{feature.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto block pt-8"><Link href="https://app.nawehub.com" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                                    Get Started Free
                                    <ArrowRight className="h-5 w-5" />
                                </Link></div>
                        </div>

                        </RevealItem>

                        {/* Next Big Idea Card */}
                        <RevealItem className="h-full">
                        <div className="hover-lift group flex h-full flex-col rounded-3xl border border-border bg-card p-8 hover:border-accent/40 lg:p-10">
                            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                <Heart className="h-8 w-8" />
                            </span>
                            <h3 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Next Big Idea
                            </h3>
                            <p className="mt-3 text-muted-foreground">
                                Sponsor a young entrepreneur&rsquo;s big idea today. Join us in supporting
                                the next generation of entrepreneurs and innovators.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {ideaFeatures.map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                                            <feature.icon className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <span className="block text-sm font-medium text-foreground">{feature.title}</span>
                                            <span className="text-xs text-muted-foreground">{feature.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto block pt-8"><Link href="/next-big-idea" className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]">
                                    Explore Next Big Idea
                                    <ArrowRight className="h-5 w-5" />
                                </Link></div>
                        </div>
                        </RevealItem>
                    </RevealGroup>
                </div>
            </section>

            {/* ========== BENEFITS (untouched — not part of what was shared) ========== */}
            <Benefits />

            {/* ========== BUSINESS REGISTRATION CTA ========== */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[hsl(var(--color-neutral-900))] text-center">
                        <ClothBorder tone="hsl(25 95% 53%)" />
                        <div className="px-8 py-16 lg:px-16 lg:py-20">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--color-neutral-700))] px-4 py-2">
                                <CheckCircle className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-[hsl(var(--color-neutral-200))]">
                                    Essential First Step
                                </span>
                            </div>

                            <h2 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                Recognition Begins With
                                <br />
                                <span className="text-accent">Business Registration</span>
                            </h2>

                            <p className="mx-auto mb-10 mt-6 max-w-2xl text-lg text-[hsl(var(--color-neutral-300))]">
                                No matter how small your business is, registering it is the first step
                                toward gaining recognition, protection, and growth opportunities.
                            </p>

                            <Link href="/register-business" className="inline-flex items-center gap-3 rounded-2xl bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-[var(--shadow-xl)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[hsl(var(--color-secondary-400))]">
                                    Register Your Business
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                        </div>
                        <ClothBorder tone="hsl(60 9% 98%)" />
                    </Reveal>
                </div>
            </section>

            {/* ========== PARTNERS ========== */}
            <section className="bg-muted py-24">
                <div className="container mx-auto px-4">
                    <Reveal className="mb-12 text-center">
                        <span className="mb-4 inline-block [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                            Trusted By
                        </span>
                        <h2 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                            Our Development Partners
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Collaborating with leading organizations to empower SMEs across Sierra
                            Leone
                        </p>
                    </Reveal>
                </div>
                <ScrollPartners fadeFrom="muted" />
            </section>

            {/* ========== FINAL CTA ========== */}
            <section className="py-24 lg:py-32">
                <Reveal className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                        Ready to Transform
                        <br />
                        <span className="text-primary">Your Future?</span>
                    </h2>
                    <p className="mx-auto mb-10 mt-6 max-w-2xl text-lg text-muted-foreground">
                        Join thousands of entrepreneurs and community members building a stronger
                        Sierra Leone together.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="https://app.nawehub.com/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-lg)] transition-colors hover:bg-primary/90">
                                Register Now
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-8 py-4 font-semibold text-foreground transition-colors hover:border-primary/40">
                                Contact Us
                            </Link>
                    </div>
                </Reveal>
            </section>

            {/* ========== TESTIMONIALS ========== */}
            <Testimonies />

            {/* ========== CONTACT ========== */}
            <ContactUsSection />
        </div>
    );
}