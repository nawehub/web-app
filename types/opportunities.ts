import React from "react";

export type Opportunity = {
    id: string; title: string; type: string; location: string
    description: string; funding?: string; deadline: string; deadlineISO?: string
    urgencyBadge?: string; urgencyColor?: string; image: string
    isNew?: boolean; isFeatured?: boolean
    applyLabel: string; typeIcon: React.ElementType; officialUrl: string
    provider: string; postedDate: string; eligibility: string[]
    benefits: string[]; applicationSteps: string[]
}

export type EventItem = {
    id: string; month: string; day: number; title: string
    time: string; format: string; location: string
}

export type Category = {
    id: string; label: string; count: number; icon: React.ElementType
    iconBg: string; iconText: string; countColor: string
}

export const TARGET_BENEFICIARIES = [
    'Entrepreneurs', 'Students', 'Innovators', 'Researchers',
    'Startups', 'Farmers', 'SMEs', 'Persons with Disabilities',
    'Women-led Businesses', 'Youth',
]

export const locations = ["Sierra Leone", "Africa", "Global"]
