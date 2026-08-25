'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, LifeBuoy, Search, Sparkles } from 'lucide-react'

type Category =
    | 'Getting Started'
    | 'Business Registration'
    | 'Next Big Idea'
    | 'Vetted Entrepreneurs & Investors'
    | 'Account & Security'

interface FaqItem {
    question: string
    answer: string
    category: Category
}

const categories: Category[] = [
    'Getting Started',
    'Business Registration',
    'Next Big Idea',
    'Vetted Entrepreneurs & Investors',
    'Account & Security',
]

const faqs: FaqItem[] = [
    {
        category: 'Getting Started',
        question: 'What is NaWeHub?',
        answer:
            'NaWeHub is Sierra Leone\u2019s business platform connecting entrepreneurs, investors, and government partners — helping businesses register, access funding and resources, and grow with community support across all 16 districts.',
    },
    {
        category: 'Getting Started',
        question: 'Who can use NaWeHub?',
        answer:
            'Anyone building or supporting a business in Sierra Leone: entrepreneurs registering a business, investors and contributors backing local ideas, and development partners or government bodies collaborating with us.',
    },
    {
        category: 'Getting Started',
        question: 'Is it free to register?',
        answer: 'Yes — creating an account and registering your business on NaWeHub is completely free.',
    },
    {
        category: 'Getting Started',
        question: 'Which districts does NaWeHub cover?',
        answer:
            'All 16 districts of Sierra Leone. Wherever you\u2019re based, you can register your business and access the same resources and support.',
    },
    {
        category: 'Business Registration',
        question: 'What documents do I need to register my business?',
        answer:
            'You\u2019ll need your business details (name, address, activities), your details as the owner (full name, date and place of birth, nationality), and a valid identity document — a National ID if you\u2019re a Sierra Leonean citizen, or a Passport if you\u2019re a foreign national.',
    },
    {
        category: 'Business Registration',
        question: 'How long does business registration take?',
        answer:
            'Submitting the form takes about 10 minutes. Once submitted, your application is typically reviewed within a few working days, and you\u2019ll receive your dashboard login credentials by email.',
    },
    {
        category: 'Business Registration',
        question: 'Can foreigners register a business on NaWeHub?',
        answer:
            'Yes. Foreign nationals can register a business the same way Sierra Leonean citizens do — you\u2019ll just upload a valid passport instead of a National ID during registration.',
    },
    {
        category: 'Business Registration',
        question: 'Can I edit my business details after submitting?',
        answer:
            'Once your dashboard account is set up, you can update most business details yourself. For changes to verified identity documents, reach out through Contact Us.',
    },
    {
        category: 'Next Big Idea',
        question: 'What is Next Big Idea?',
        answer:
            'Next Big Idea is NaWeHub\u2019s funding feature — individuals, organizations, and government bodies contribute directly to verified young entrepreneurs and innovators across Sierra Leone.',
    },
    {
        category: 'Next Big Idea',
        question: 'How much can I contribute to a campaign?',
        answer:
            'Any amount you choose — there\u2019s no minimum that locks you out and no maximum that caps your impact. Contributions start as small as a few thousand Leones.',
    },
    {
        category: 'Next Big Idea',
        question: 'What payment methods are supported?',
        answer: 'Mobile Money, card, and bank transfer.',
    },
    {
        category: 'Next Big Idea',
        question: 'Who can launch a Next Big Idea campaign?',
        answer:
            'Vetted entrepreneurs on the platform. If you have an idea and want to be considered, register your business first, then apply for verification.',
    },
    {
        category: 'Vetted Entrepreneurs & Investors',
        question: 'How does an entrepreneur become "vetted"?',
        answer:
            'Every entrepreneur goes through a verification process covering identity, business legitimacy, traction, and credibility before their profile or campaign goes live.',
    },
    {
        category: 'Vetted Entrepreneurs & Investors',
        question: 'How do I register as an investor?',
        answer:
            'Use the "Register as Investor" link in the site header or footer. Once set up, you can browse vetted entrepreneurs and contribute directly through Next Big Idea.',
    },
    {
        category: 'Account & Security',
        question: 'How is my data protected?',
        answer:
            'Identity documents and personal information are used solely for verification and are not publicly visible. Only what you choose to share on a public profile is shown to other users.',
    },
    {
        category: 'Account & Security',
        question: "I forgot my password — what do I do?",
        answer: 'Use "Forgot password" on the login page to reset it via the email address on your account.',
    },
]

function FaqAccordionItem({
                              item,
                              isOpen,
                              onToggle,
                          }: {
    item: FaqItem
    isOpen: boolean
    onToggle: () => void
}) {
    return (
        <div className="border-b border-border last:border-none">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
                <span className="font-medium text-foreground [font-family:var(--font-display)]">
                    {item.question}
                </span>
                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <p className="pb-5 leading-relaxed text-muted-foreground">{item.answer}</p>
            )}
        </div>
    )
}

export default function FaqPage() {
    const [query, setQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
    const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return faqs.filter((item) => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory
            const matchesQuery =
                q === '' || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
            return matchesCategory && matchesQuery
        })
    }, [query, activeCategory])

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                        <Sparkles className="h-3.5 w-3.5" />
                        Help Center
                    </div>
                    <h1 className="mt-6 text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                        Everything you need to know about registering your business, funding ideas,
                        and using NaWeHub.
                    </p>

                    <div className="relative mx-auto mt-8 max-w-lg">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search questions..."
                            className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-4 text-sm shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                </div>
            </section>

            {/* Filters + accordion */}
            <section className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        {(['All', ...categories] as const).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                                    activeCategory === cat
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-card p-12 text-center">
                            <p className="font-semibold text-foreground [font-family:var(--font-display)]">
                                No matching questions
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try a different search term or category.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border bg-card px-6 shadow-[var(--shadow-sm)]">
                            {filtered.map((item) => (
                                <FaqAccordionItem
                                    key={item.question}
                                    item={item}
                                    isOpen={openQuestion === item.question}
                                    onToggle={() =>
                                        setOpenQuestion(openQuestion === item.question ? null : item.question)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-muted py-20">
                <div className="container mx-auto px-4 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <LifeBuoy className="h-6 w-6" />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                        Still have questions?
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                        Our team is happy to help with anything not covered here.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Contact Us
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}