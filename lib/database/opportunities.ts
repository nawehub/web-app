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
import {Category, EventItem} from "@/types/opportunities";

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
