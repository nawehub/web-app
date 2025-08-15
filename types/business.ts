import {BriefcaseBusiness, User} from "lucide-react";

export type BusinessFormData = {
    businessName: string
    businessAddress: string
    businessActivities: string
    businessEntityType: string
    category: string
    ownerName: string
    ownerAddress: string
    placeOfBirth: string
    contactNumber: string
    gender: string
    dateOfBirth: string
    nationality: string
    mothersName: string
    email: string
    registerDate?: Date
    isAlreadyRegistered: boolean
    isPublicRegister: boolean
}

export const initData: BusinessFormData = {
    businessName: '',
    businessAddress: '',
    businessActivities: '',
    businessEntityType: '',
    category: '',
    ownerName: '',
    ownerAddress: '',
    placeOfBirth: '',
    contactNumber: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    mothersName: '',
    email: '',
    registerDate: undefined,
    isAlreadyRegistered: false,
    isPublicRegister: false,
}

export function getDate15YearsAgo() {
    const currentDate = new Date(); // Get the current date and time
    const currentYear = currentDate.getFullYear(); // Get the current year

    // Set the year to 15 years ago
    currentDate.setFullYear(currentYear - 15);

    return currentDate; // Return the modified Date object
}

export const steps = [
    {id: 1, title: 'Business Information', description: 'Enter your business details', icon: BriefcaseBusiness},
    {id: 2, title: 'Owner Information', description: 'Enter business owner information', icon: User}
]

export const categories = [
    {name: "Agriculture"},
    {name: "Technology"},
    {name: "Fashion & Textiles"},
    {name: "Food & Beverage"},
    {name: "Healthcare"},
    {name: "Education"},
    {name: "Construction"},
    {name: "Transportation"},
    {name: "Retail"},
    {name: "Manufacturing"},
    {name: "Services"},
    {name: "Tourism"},
    {name: "Mining"},
    {name: "Energy"},
    {name: "Other"}
];

export const businessTypes = [
    {
        name: "Sole Proprietorship",
        descriptions: [
            "Owned and run by a single individual",
            "No legal separation between owner and business — the owner holds full personal liability for debts and obligations"
        ]
    },
    {
        name: "Partnership",
        descriptions: [
            "Involves two or more individuals sharing ownership, profits, and liabilities.",
            "1. General Partnership – all partners are equally liable.",
            "2. Limited Partnership – includes general partners (full liability) and limited partners whose liability is capped to their investment."
        ]
    },
    {
        name: "Private Limited Company (Ltd or LLC)",
        descriptions: [
            "• Most commonly used business structure for small to medium enterprises.",
            "• Offers limited liability to shareholders.",
            "• Shares are not publicly traded.",
            "• Minimum one shareholder and typically two directors; no legal minimum capital but a nominal share capital is common."
        ]
    },
    {
        name: "Public Limited Company (PLC)",
        descriptions: [
            "• Can offer shares to the public and generally has no restrictions on share transfers.",
            "• Subject to stricter disclosure, governance, and higher capital requirements."
        ]
    },
    {
        name: "Company Limited by Guarantee (CLG)",
        descriptions: [
            "• Designed for non-profits, charities, or social enterprises.",
            "• Has no share capital; members’ liability is limited to a predetermined amount they guarantee.",
            "• Profits are reinvested to further the organization’s objectives, not distributed."
        ]
    },
    {
        name: "Unlimited Company",
        descriptions: [
            "• Members bear unlimited liability for debts.",
            "• This structure is less common and typically only used where such liability is required to instill creditor confidence."
        ]
    },
    {
        name: "Foreign Company Operations",
        descriptions: [
            "Foreign-based companies may operate in Sierra Leone under two primary forms:",
            "• Branch Office – an extension of the parent company, not a separate legal entity, making the parent directly liable.",
            "• Subsidiary – a locally incorporated, separate legal entity."
        ]
    }
]