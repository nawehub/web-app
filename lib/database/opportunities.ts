import {
    Award,
    BookOpen,
    Briefcase,
    Calendar,
    GraduationCap,
    Leaf,
    Rocket,
    Trophy,
    User,
    Users2,
    Zap
} from "lucide-react";
import {Category, EventItem, Opportunity} from "@/types/opportunities";

export const CATEGORIES: Category[] = [
    {
        id: 'grants',
        label: 'Grants & Funding',
        count: 120,
        icon: Trophy,
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        countColor: 'text-green-600'
    },
    {
        id: 'competitions',
        label: 'Competitions',
        count: 45,
        icon: Award,
        iconBg: 'bg-yellow-100',
        iconText: 'text-yellow-600',
        countColor: 'text-yellow-600'
    },
    {
        id: 'events',
        label: 'Events & Conferences',
        count: 35,
        icon: Calendar,
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        countColor: 'text-purple-600'
    },
    {
        id: 'training',
        label: 'Training & Workshops',
        count: 60,
        icon: GraduationCap,
        iconBg: 'bg-teal-100',
        iconText: 'text-teal-600',
        countColor: 'text-teal-600'
    },
    {
        id: 'fellowships',
        label: 'Fellowships',
        count: 25,
        icon: Users2,
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        countColor: 'text-blue-600'
    },
    {
        id: 'scholarships',
        label: 'Scholarships',
        count: 30,
        icon: BookOpen,
        iconBg: 'bg-red-100',
        iconText: 'text-red-500',
        countColor: 'text-red-500'
    },
    {
        id: 'incubators',
        label: 'Incubators & Accelerators',
        count: 20,
        icon: Rocket,
        iconBg: 'bg-indigo-100',
        iconText: 'text-indigo-600',
        countColor: 'text-indigo-600'
    },
    {
        id: 'jobs',
        label: 'Jobs & Internships',
        count: 40,
        icon: Briefcase,
        iconBg: 'bg-sky-50',
        iconText: 'text-sky-600',
        countColor: 'text-slate-600'
    },
    {
        id: 'climate',
        label: 'Climate & Circular Economy',
        count: 25,
        icon: Leaf,
        iconBg: 'bg-emerald-100',
        iconText: 'text-emerald-600',
        countColor: 'text-emerald-600'
    },
    {
        id: 'women',
        label: 'Women Opportunities',
        count: 35,
        icon: User,
        iconBg: 'bg-pink-100',
        iconText: 'text-pink-600',
        countColor: 'text-pink-600'
    },
    {
        id: 'youth',
        label: 'Youth Innovation',
        count: 50,
        icon: Zap,
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600',
        countColor: 'text-orange-600'
    },
]

export const OPPORTUNITIES: Opportunity[] = [
    {
        id: '1', title: 'African Climate Innovation Grant 2026',
        type: 'Grant', location: 'Africa',
        description: 'Supporting innovative solutions to climate change across Africa.',
        funding: '$25,000', deadline: '30 Jun 2026',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400',
        isNew: true, isFeatured: true, applyLabel: 'Apply Now',
        officialUrl: 'https://www.climateinnovationchallenge.org/',
        provider: 'Africa Climate Innovation Network', postedDate: '12 Apr 2026',
        eligibility: ['Africa-based startups and social enterprises', 'Solutions must address climate adaptation or mitigation', 'Applicants must have a working prototype or pilot'],
        benefits: ['$25,000 in grant funding', 'Six months of expert mentorship', 'Access to climate investors and regional partners'],
        applicationSteps: ['Review the eligibility requirements', 'Prepare your pitch deck and impact plan', 'Submit your application on the official programme website'],
        typeIcon: Leaf,
    },
    {
        id: '2', title: 'Tony Elumelu Foundation Entrepreneurship Programme',
        type: 'Program', location: 'Africa',
        description: 'Empowering African entrepreneurs through funding, mentorship and training.',
        funding: '$5,000', deadline: '15 May 2026',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400',
        isNew: true, isFeatured: true, applyLabel: 'Apply Now',
        officialUrl: 'https://www.tefconnect.com/',
        provider: 'Tony Elumelu Foundation', postedDate: '2 Jan 2026',
        eligibility: ['African entrepreneurs aged 18 or older', 'Business ideas or businesses operating for no more than five years', 'The business must be based in Africa and be for profit'],
        benefits: ['$5,000 non-refundable seed capital', 'Business management training and mentorship', 'Membership in the TEF alumni network'],
        applicationSteps: ['Create or sign in to your TEFConnect account', 'Complete your profile and business application', 'Submit the application before the official deadline'],
        typeIcon: Trophy,
    },
    {
        id: '3', title: 'Women in Tech Conference 2026',
        type: 'Event', location: 'Sierra Leone',
        description: 'A conference celebrating women innovating in technology.',
        deadline: '20 – 22 Jun 2026',
        urgencyBadge: '5 DAYS LEFT', urgencyColor: 'bg-[hsl(var(--color-error))]',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
        isFeatured: true, applyLabel: 'Register Now',
        officialUrl: 'https://womenintech-africa.com/',
        provider: 'Women in Tech Africa', postedDate: '28 Mar 2026',
        eligibility: ['Women working, studying, or building businesses in technology', 'Founders, professionals, students, and allies are welcome', 'Participants must complete online registration'],
        benefits: ['Keynotes and practical workshops', 'Founder and career networking sessions', 'Access to women-led technology communities'],
        applicationSteps: ['Visit the official event website', 'Choose the appropriate attendee pass', 'Complete registration and retain your confirmation'],
        typeIcon: Calendar,
    },
    {
        id: '4', title: 'Green Innovation Challenge 2026',
        type: 'Competition', location: 'Global',
        description: 'Innovate for a sustainable future. Open to youth and startups.',
        funding: '$10,000', deadline: '10 Jun 2026',
        urgencyBadge: '4 WEEKS LEFT', urgencyColor: 'bg-[hsl(var(--color-warning))]',
        image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=400',
        isFeatured: true, applyLabel: 'Apply Now',
        officialUrl: 'https://www.greeninnovationchallenge.com/submission',
        provider: 'Green Innovation Challenge', postedDate: '5 Apr 2026',
        eligibility: ['Open to young innovators and startup teams worldwide', 'Entries must propose an original sustainability solution', 'Applications and supporting materials must be in English'],
        benefits: ['$10,000 in awards and venture support', 'International visibility for finalist solutions', 'Feedback from sustainability and innovation experts'],
        applicationSteps: ['Read the official submission guidelines', 'Prepare your solution summary and supporting materials', 'Submit through the official challenge channel'],
        typeIcon: Zap,
    },
]

export const STATS = [
    {value: '250+', label: 'Active Opportunities'},
    {value: '35+', label: 'Upcoming Events'},
    {value: '120+', label: 'Funding Programs'},
    {value: '50+', label: 'Partners & Donors'},
]

export const EVENTS: EventItem[] = [
    {
        id: 'e1',
        month: 'MAY',
        day: 24,
        title: 'Startup Pitch Night',
        time: '5:00 PM – 8:00 PM',
        format: '',
        location: 'Freetown'
    },
    {
        id: 'e2',
        month: 'MAY',
        day: 28,
        title: 'Plastic Circularity Summit',
        time: '9:00 AM – 4:00 PM',
        format: 'Hybrid',
        location: 'Hybrid'
    },
    {
        id: 'e3',
        month: 'JUN',
        day: 2,
        title: 'AI for Entrepreneurs Workshop',
        time: '10:00 AM – 1:00 PM',
        format: '',
        location: 'Online'
    },
    {
        id: 'e4',
        month: 'JUN',
        day: 12,
        title: 'Women in Business Networking Mixer',
        time: '6:00 PM – 9:00 PM',
        format: '',
        location: 'Freetown'
    },
    {
        id: 'e5',
        month: 'JUN',
        day: 20,
        title: 'Climate Innovation Bootcamp',
        time: '9:00 AM – 5:00 PM',
        format: '',
        location: 'Freetown'
    },
]
