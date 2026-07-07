import {
    GraduationCap,
    Lightbulb,
    Monitor,
    Recycle,
    Rocket,
    UserRound,
} from 'lucide-react'

export type IdeaCategory =
    | 'AgriTech'
    | 'Clean Energy'
    | 'Gara & Craft'
    | 'EdTech'
    | 'Health'

export interface NextBigIdea {
    id: string
    title: string
    founder: string
    district: string
    category: IdeaCategory
    description: string
    coverImage: string
    raisedSLE: number
    goalSLE: number
    contributors: number
    daysLeft: number
    verified: boolean
    /** Community appeal / potential score (1–5). */
    appealRating: number
    outcome?: string
}

export const NEXT_BIG_IDEAS: NextBigIdea[] = [
    {
        id: 'agro-dry',
        title: 'Solar dryers for smallholder cassava farmers',
        founder: 'Adama Sesay',
        district: 'Bo',
        category: 'AgriTech',
        description:
            'Affordable solar drying units that cut post-harvest losses for cassava farmers and open access to urban markets.',
        coverImage:
            'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 38_500_000,
        goalSLE: 45_000_000,
        contributors: 212,
        daysLeft: 9,
        verified: true,
        appealRating: 4.5,
    },
    {
        id: 'gara-coop',
        title: 'Gara dye cooperative for 30 women artisans',
        founder: 'Fatmata Koroma',
        district: 'Makeni',
        category: 'Gara & Craft',
        description:
            'A women-led cooperative scaling traditional Gara dye production with shared equipment and export-ready packaging.',
        coverImage:
            'https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 14_200_000,
        goalSLE: 20_000_000,
        contributors: 96,
        daysLeft: 16,
        verified: true,
        appealRating: 4.8,
    },
    {
        id: 'lite-grid',
        title: 'Pay-as-you-go solar kits for off-grid households',
        founder: 'Ibrahim Bangura',
        district: 'Kenema',
        category: 'Clean Energy',
        description:
            'Modular solar kits with mobile payments, bringing reliable electricity to off-grid communities in eastern Sierra Leone.',
        coverImage:
            'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 61_000_000,
        goalSLE: 60_000_000,
        contributors: 304,
        daysLeft: 0,
        verified: true,
        appealRating: 4.9,
        outcome:
            'Deployed 420 pay-as-you-go solar kits across 12 villages. Households report an average 6-hour increase in productive evening hours.',
    },
    {
        id: 'learnlocal',
        title: 'Offline tablets for rural primary schools',
        founder: 'Mariama Conteh',
        district: 'Kono',
        category: 'EdTech',
        description:
            'Rugged offline learning tablets pre-loaded with curriculum-aligned content for schools without reliable internet.',
        coverImage:
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 9_800_000,
        goalSLE: 30_000_000,
        contributors: 58,
        daysLeft: 23,
        verified: false,
        appealRating: 4.2,
    },
    {
        id: 'mama-care',
        title: 'Mobile prenatal screening unit',
        founder: 'Hawa Turay',
        district: 'Port Loko',
        category: 'Health',
        description:
            'A mobile clinic bringing ultrasound and prenatal screening to hard-to-reach communities along the northern corridor.',
        coverImage:
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 27_600_000,
        goalSLE: 50_000_000,
        contributors: 171,
        daysLeft: 12,
        verified: true,
        appealRating: 4.6,
    },
    {
        id: 'agro-cold',
        title: 'Shared cold-storage hub for fish traders',
        founder: 'Mohamed Kargbo',
        district: 'Freetown',
        category: 'AgriTech',
        description:
            'Community cold-storage facility reducing spoilage for fish traders at the Freetown wharf and surrounding markets.',
        coverImage:
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
        raisedSLE: 22_100_000,
        goalSLE: 35_000_000,
        contributors: 140,
        daysLeft: 18,
        verified: true,
        appealRating: 4.4,
    },
]

export const IDEA_CATEGORIES: ('All' | IdeaCategory)[] = [
    'All',
    'AgriTech',
    'Clean Energy',
    'Gara & Craft',
    'EdTech',
    'Health',
]

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

export function getIdeaById(id: string): NextBigIdea | undefined {
    return NEXT_BIG_IDEAS.find((idea) => idea.id === id)
}

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

export function isFullyFunded(idea: NextBigIdea): boolean {
    return idea.raisedSLE >= idea.goalSLE
}
