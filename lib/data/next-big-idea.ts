import {
    GraduationCap,
    Lightbulb,
    Monitor,
    Recycle,
    Rocket,
    UserRound,
} from 'lucide-react'

export const PLATFORM_STATS = {
    raisedSLE: 173_000_000,
    targetSLE: 250_000_000,
    contributors: 981,
    projectsSupported: 62,
    daysLeft: 45,
    totalRaisedDisplay: 'SLE 2,500,000+',
    entrepreneursSupported: '120+',
    districtsReached: '16',
    womenLedStartups: '45+',
}

export const SUPPORT_AREAS = [
    {
        icon: Rocket,
        title: 'Startup Funding',
        description: 'Provide seed funding and grants to help entrepreneurs launch and grow.',
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    {
        icon: UserRound,
        title: 'Women-led Innovation',
        description:
            'Empowering women entrepreneurs and closing the gender gap in innovation.',
        color: 'text-pink-600',
        bg: 'bg-pink-100 dark:bg-pink-950/40',
    },
    {
        icon: Recycle,
        title: 'Green & Circular Economy',
        description:
            'Supporting climate solutions, recycling initiatives and clean technologies.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    },
    {
        icon: GraduationCap,
        title: 'Youth Entrepreneurship',
        description:
            'Training, mentorship and business development for young innovators.',
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-950/40',
    },
    {
        icon: Lightbulb,
        title: 'Prototype Development',
        description: 'Helping innovators build prototypes and bring solutions to life.',
        color: 'text-orange-600',
        bg: 'bg-orange-100 dark:bg-orange-950/40',
    },
    {
        icon: Monitor,
        title: 'Digital Skills & Technology',
        description:
            'Building digital capabilities for the next generation of innovators.',
        color: 'text-blue-600',
        bg: 'bg-blue-100 dark:bg-blue-950/40',
    },
]

export const TRUST_INDICATORS = [
    'Transparent Contributions',
    'Verified Entrepreneurs',
    'Community Driven',
    'Development Partner Friendly',
]

export function formatSLE(amount: number): string {
    if (amount >= 1_000_000) {
        const m = amount / 1_000_000
        return `SLE ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
    }
    if (amount >= 1_000) {
        return `SLE ${Math.round(amount / 1_000)}K`
    }
    return `SLE ${amount.toLocaleString()}`
}
