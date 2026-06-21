/**
 * NaWeHub — Privacy Policy & Terms of Use
 * --------------------------------------
 * Location: app/(web)/privacy-terms/page.tsx (adjust to wherever yours
 * actually routes)
 *
 * STRUCTURE CHANGE — not just a reskin
 * -----------------------------------------------
 * The original rendered all 7 Privacy sections and all 7 Terms sections as
 * one long stacked page, each section a card with its own unique
 * gradient (14 different rainbow gradients total — blue→cyan,
 * purple→pink, green→emerald, and so on, no pattern to which section got
 * which). For a legal document specifically, that's working against
 * itself: rainbow per-section color doesn't communicate anything (it's
 * not categorical — Privacy and Terms sections aren't different *types*
 * of thing), and a wall of differently-colored cards reads as less
 * trustworthy than a calm, consistent one for exactly the kind of content
 * where calm and consistent matters most. So:
 *
 * - One icon treatment for every section (`bg-primary/15 text-primary`),
 *   not 14 different gradients.
 * - Privacy Policy and Terms of Use are now separate Tabs instead of one
 *   continuous scroll — at 7 sections each, mixing both into one feed
 *   made it hard to tell which document you were even reading partway
 *   down. Assumes a standard shadcn Tabs/TabsList/TabsTrigger/TabsContent
 *   API at @/components/ui/tabs — a reasonably safe bet given Card/Badge/
 *   Separator are already used elsewhere in this file, but flagging since
 *   I haven't seen that file directly.
 * - Added a jump-nav (pill links to each section's existing `id`) at the
 *   top of each tab, since a 7-section legal document benefits from being
 *   scannable, not just scrollable.
 * - Sections are now a numbered list (ledger-style mono numerals, same
 *   motif used for stats elsewhere on the site) rather than a 2-column
 *   card grid — easier to read as an actual document, and removes the
 *   `hover:scale-[1.02]` card-hover treatment, which doesn't mean
 *   anything on text you're meant to read, not click.
 * - Dropped the `useIsMobile()` + `${isMobile ? '-mx-4 rounded-none' : ''}`
 *   pattern used throughout for a full-bleed-on-mobile effect. That's a
 *   client-only viewport check, so the first render (before hydration)
 *   always assumes desktop layout, then snaps to the mobile one a moment
 *   later — a real, if subtle, layout shift on every load. Replaced with
 *   plain responsive Tailwind classes that don't depend on JS running
 *   first.
 * - "Love Your District Fund Management" gets a highlighted callout
 *   treatment (accent-bordered) instead of its own pink/rose gradient,
 *   and the temporary-policy notice now uses your actual `--color-warning`
 *   token — it's semantically a warning/notice, which that token exists
 *   for and nothing else in the file was using.
 * - Contact cards (Email/Phone/Address) and the closing CTA now match the
 *   same treatment used on the Contact page and everywhere else — primary
 *   tokens for the cards, the dark neutral-900 + ClothBorder block for the
 *   CTA, instead of three more one-off gradients and a fourth.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Shield,
    Eye,
    Users,
    Lock,
    Database,
    UserCheck,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    FileText,
    ArrowRight,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Globe,
    Heart,
    Scale,
    type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

interface PolicySection {
    id: string;
    icon: LucideIcon;
    title: string;
    content: { subtitle: string; description: string }[];
}

const privacySections: PolicySection[] = [
    {
        id: 'information-collect',
        icon: Database,
        title: 'Information We Collect',
        content: [
            { subtitle: 'Personal Information', description: 'Name, email address, phone number, and business details provided during registration.' },
            { subtitle: 'Usage Data', description: 'How you interact with the app (features used, pages visited, session length).' },
            { subtitle: 'Device Information', description: 'Device type, operating system, and basic technical data for troubleshooting and app improvement.' },
        ],
    },
    {
        id: 'how-we-use',
        icon: Eye,
        title: 'How We Use Your Information',
        content: [
            { subtitle: 'Account Management', description: 'To create and manage your account.' },
            { subtitle: 'Connection Services', description: 'To connect entrepreneurs with resources, partners, and funding opportunities.' },
            { subtitle: 'App Improvement', description: 'To improve app performance and user experience.' },
            { subtitle: 'Communications', description: 'To send important updates, notifications, and support messages.' },
        ],
    },
    {
        id: 'sharing-info',
        icon: Users,
        title: 'Sharing of Information',
        content: [
            { subtitle: 'Partners', description: 'Only when necessary to connect you with resources, mentors, or opportunities you request.' },
            { subtitle: 'Service Providers', description: 'For technical support, hosting, and analytics.' },
            { subtitle: 'Legal Authorities', description: 'If required by law or to protect user safety.' },
        ],
    },
    {
        id: 'data-security',
        icon: Lock,
        title: 'Data Security',
        content: [
            { subtitle: 'Protection Measures', description: 'We use reasonable technical and organizational measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.' },
        ],
    },
    {
        id: 'data-retention',
        icon: RefreshCw,
        title: 'Data Retention',
        content: [
            { subtitle: 'Storage Duration', description: 'Your personal information will be stored only as long as necessary to provide services or as required by law.' },
        ],
    },
    {
        id: 'your-rights',
        icon: UserCheck,
        title: 'Your Rights',
        content: [
            { subtitle: 'Access & Update', description: 'Access and update your information in the app.' },
            { subtitle: 'Data Deletion', description: 'Request deletion of your account and associated data.' },
            { subtitle: 'Communication Preferences', description: 'Opt out of non-essential communications.' },
        ],
    },
    {
        id: 'policy-changes',
        icon: AlertTriangle,
        title: 'Changes to This Policy',
        content: [
            { subtitle: 'Temporary Status', description: 'This is a temporary privacy policy. It may be updated or replaced once the full legal policy is finalized. We will notify users within the app when major updates are made.' },
        ],
    },
];

const termsSections: PolicySection[] = [
    {
        id: 'purpose',
        icon: Globe,
        title: 'Purpose of NaWeHub',
        content: [
            { subtitle: 'Entrepreneur Showcase', description: 'Entrepreneurs to showcase their ideas and businesses.' },
            { subtitle: 'Partner Discovery', description: 'Partners and investors to discover opportunities.' },
            { subtitle: 'Community Support', description: 'Citizens to support local initiatives (e.g., Love Your District).' },
        ],
    },
    {
        id: 'responsibilities',
        icon: CheckCircle,
        title: 'User Responsibilities',
        content: [
            { subtitle: 'Accurate Information', description: 'Provide accurate and honest information when creating an account or posting content.' },
            { subtitle: 'Lawful Use', description: 'Use the platform for lawful purposes only.' },
            { subtitle: 'Respectful Behavior', description: 'Respect other users and avoid abusive, harmful, or misleading behavior.' },
        ],
    },
    {
        id: 'donations',
        icon: Heart,
        title: 'Contributions & Donations',
        content: [
            { subtitle: 'Voluntary Donations', description: 'Donations made through Love Your District or other features are voluntary and non-refundable.' },
            { subtitle: 'Transparency', description: 'NaWeHub will make reasonable efforts to ensure transparency on how funds are applied.' },
        ],
    },
    {
        id: 'content-ownership',
        icon: FileText,
        title: 'Content Ownership',
        content: [
            { subtitle: 'User Ownership', description: 'Users retain ownership of the content they share.' },
            { subtitle: 'Platform Permission', description: 'By posting on NaWeHub, you grant us permission to display and share your content within the app for community purposes.' },
        ],
    },
    {
        id: 'liability',
        icon: Scale,
        title: 'Limitation of Liability',
        content: [
            { subtitle: 'As-Is Service', description: 'NaWeHub is provided "as is". While we work to maintain reliability, we are not liable for technical interruptions or errors.' },
            { subtitle: 'User Responsibility', description: 'We are not liable for losses resulting from user reliance on information or services within the app.' },
        ],
    },
    {
        id: 'terms-updates',
        icon: RefreshCw,
        title: 'Updates to Terms',
        content: [
            { subtitle: 'Temporary Terms', description: 'These Terms of Use are temporary and may be updated as the platform grows. Continued use of NaWeHub means you accept any changes.' },
        ],
    },
];

const contactCards = [
    { icon: Mail, label: 'Email', value: 'info@ewomensl.com' },
    { icon: Phone, label: 'Phone', value: '+232 78 976369' },
    { icon: MapPin, label: 'Address', value: '59 Rogbaneh Road, Makeni City' },
];

function ClothBorder({ tone }: { tone: string }) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id="legal-cloth-border" width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={tone} fillOpacity="0.55" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#legal-cloth-border)" />
            </svg>
        </div>
    );
}

function JumpNav({ sections }: { sections: PolicySection[] }) {
    return (
        <div className="mb-10 flex flex-wrap gap-2">
            {sections.map((s) => (
                <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                    {s.title}
                </a>
            ))}
        </div>
    );
}

function SectionList({ sections }: { sections: PolicySection[] }) {
    return (
        <div className="space-y-5">
            {sections.map((section, index) => (
                <div
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                    <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                            <section.icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="[font-family:var(--font-mono)] text-xs text-muted-foreground">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="text-lg font-semibold text-foreground [font-family:var(--font-display)]">
                                    {section.title}
                                </h3>
                            </div>
                            <div className="mt-4 divide-y divide-border">
                                {section.content.map((item, idx) => (
                                    <div key={item.subtitle} className={idx > 0 ? 'pt-4' : 'pb-4 last:pb-0'}>
                                        <h4 className="font-medium text-foreground">{item.subtitle}</h4>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function PrivacyPolicyPage() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 py-20 dark:from-primary/10 dark:to-background sm:py-28">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <Badge variant="secondary" className="mb-6 bg-primary/15 px-4 py-2 text-sm font-medium text-primary">
                            <Shield className="mr-2 h-4 w-4" />
                            Privacy & Terms
                        </Badge>
                        <h1 className="text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl lg:text-6xl">
                            Privacy Policy & <span className="text-primary">Terms of Use</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            Your privacy and trust are fundamental to our mission of supporting entrepreneurs and
                            communities across Sierra Leone.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80">
                                <Calendar className="h-4 w-4 text-primary" />
                                Effective: October 1, 2025
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80">
                                <RefreshCw className="h-4 w-4 text-primary" />
                                Updated: August 1, 2025
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Temporary Policy Notice */}
            <section className="container mx-auto px-4 py-12">
                <div className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border border-[hsl(var(--color-warning))]/30 bg-[hsl(var(--color-warning))]/5 p-6 sm:p-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--color-warning))]/15 text-[hsl(var(--color-warning))]">
                        <AlertTriangle className="h-5 w-5" />
                    </span>
                    <div>
                        <h2 className="font-semibold text-foreground [font-family:var(--font-display)]">
                            Temporary Policy Notice
                        </h2>
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                            At NaWeHub, we value your privacy and are committed to protecting your personal
                            information. This temporary privacy policy explains how we collect, use, and safeguard
                            data while you use the NaWeHub app. A more detailed and permanent privacy policy will be
                            published after the app&rsquo;s official launch.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Policy / Terms of Use tabs */}
            <section className="container mx-auto px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    <Tabs defaultValue="privacy">
                        <TabsList className="mb-8 grid w-full grid-cols-2">
                            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                            <TabsTrigger value="terms">Terms of Use</TabsTrigger>
                        </TabsList>

                        <TabsContent value="privacy">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                    Privacy Policy
                                </h2>
                                <p className="mt-2 text-muted-foreground">
                                    Understanding how we protect and handle your personal information.
                                </p>
                            </div>
                            <JumpNav sections={privacySections} />
                            <SectionList sections={privacySections} />
                        </TabsContent>

                        <TabsContent value="terms">
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                    Terms of Use
                                </h2>
                                <p className="mt-2 text-muted-foreground">
                                    Guidelines for using NaWeHub platform responsibly and effectively.
                                </p>
                            </div>
                            <JumpNav sections={termsSections} />
                            <SectionList sections={termsSections} />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Love Your District Fund Management — highlighted callout */}
            <section className="container mx-auto px-4 py-16">
                <Card className="mx-auto max-w-4xl border-accent/30 bg-accent/5">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                                <Heart className="h-6 w-6" />
                            </span>
                            <div>
                                <CardTitle className="text-2xl [font-family:var(--font-display)]">
                                    Love Your District Fund Management
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Transparent community project funding and administration
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Fund Administration</h3>
                            <p className="leading-relaxed text-muted-foreground">
                                Funds raised through Love Your District (LYD) are directed toward community projects.
                                The administration of the NaWeHub system, managed by eWomen, oversees this process.
                                Leveraging its expertise in innovation, eWomen can recommend potential projects for
                                each district or chiefdom to local stakeholders.
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Project Approval Process</h3>
                            <p className="leading-relaxed text-muted-foreground">
                                For each district, there is a curated list of potential projects. These projects,
                                created and published by the NaWeHub admin, are open for online voting — even for
                                users who access the system as guests (not logged in). Once projects are reviewed and
                                approved by both stakeholders and the public, they will be funded through LYD.
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Transparency & Accountability</h3>
                            <p className="leading-relaxed text-muted-foreground">
                                Approved projects are marked as &ldquo;APPROVED &ndash; IMPLEMENTATION ONGOING,&rdquo;
                                while successfully completed projects are showcased as success stories to highlight
                                impact and accountability.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Contact Section */}
            <section className="bg-muted/40 py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-4xl">
                                Contact Us
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Have questions about our privacy policy or terms? We&rsquo;re here to help.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {contactCards.map((c) => (
                                <div key={c.label} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                            <c.icon className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-foreground">{c.label}</h3>
                                            <p className="truncate text-muted-foreground">{c.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                Join thousands of entrepreneurs across Sierra Leone who trust NaWeHub with their
                                business growth and community development.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href="/register">
                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))] sm:w-auto">
                                        Get Started Today
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </Link>
                                <Link href="/contact">
                                    <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[hsl(var(--color-neutral-700))] px-8 py-3 font-semibold text-[hsl(var(--color-neutral-50))] transition-colors hover:border-accent hover:text-accent sm:w-auto">
                                        Contact Support
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