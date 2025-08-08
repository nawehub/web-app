import type { LYDDonation, DistrictRanking, TopContributor } from "@/types/lyd"

export const mockDistrictRankings: DistrictRanking[] = [
    {
        district: "Western Urban",
        totalContributors: 1247,
        totalContributions: 15750000,
    },
    {
        district: "Bo",
        totalContributors: 892,
        totalContributions: 12340000,
    },
    {
        district: "Western Rural",
        totalContributors: 634,
        totalContributions: 8920000,
    },
    {
        district: "Moyamba",
        totalContributors: 456,
        totalContributions: 6780000,
    },
    {
        district: "Bonthe",
        totalContributors: 321,
        totalContributions: 4560000,
    },
    {
        district: "Pujehun",
        totalContributors: 234,
        totalContributions: 3210000,
    },
]

export const mockTopContributors: TopContributor[] = [
    {
        id: "1",
        firstName: "Mohamed",
        lastName: "Kamara",
        nationality: "Sierra Leone",
        anonymous: false,
        totalContributions: 2500000
    },
    {
        id: "2",
        firstName: "Fatima",
        lastName: "Sesay",
        nationality: "Sierra Leone",
        anonymous: false,
        totalContributions: 1800000
    },
    {
        id: "3",
        firstName: "James",
        lastName: "Anonumous",
        nationality: "Sierra Leone",
        anonymous: true,
        totalContributions: 1500000
    },
    {
        id: "4",
        firstName: "Ibrahim",
        lastName: "Bangura",
        nationality: "Sierra Leone",
        anonymous: false,
        totalContributions: 1200000
    },
    {
        id: "5",
        firstName: "Aminata",
        lastName: "Koroma",
        nationality: "Sierra Leone",
        anonymous: true,
        totalContributions: 950000
    },
]

export const mockDonations: LYDDonation[] = [
    {
        id: "don-1",
        amount: 50000,
        target: "District",
        district: "Western Urban",
        paymentMethod: "Momo",
        paymentProvider: "Orange Money",
        currency: "SLE",
        targetValue: "Western Urban",
        status: "Completed",
        createdAt: new Date("2024-01-15T10:30:00"),
        updatedAt: new Date("2024-01-15T10:30:00"),
    },
    {
        id: "don-2",
        amount: 25000,
        target: "Chiefdom",
        district: "Moyamba",
        paymentMethod: "Bank",
        paymentProvider: "Rokel Commercial Bank",
        currency: "SLE",
        targetValue: "Banta",
        createdAt: new Date("2024-01-20T14:15:00"),
        updatedAt: new Date("2024-01-15T10:30:00"),
        status: "Completed",
    },
]

export const paymentProviders = {
    Momo: [
        { id: "m17", name: "Orange Money" },
        { id: "m18", name: "Afri Money" },
        { id: "m19", name: "Qmoney" },
    ],
    Bank: [
        { id: "rcb001", name: "Rokel Commercial Bank" },
        { id: "slcb002", name: "Sierra Leone Commercial Bank" },
        { id: "uba001", name: "United Bank for Africa" },
        { id: "gtb001", name: "Guaranty Trust Bank" }
    ],
    Card: [
        { id: "visa", name: "Visa" },
        { id: "mastercard", name: 'Mastercard' },
        { id: "american-express", name: "American Express" }
    ],
}

export const currencies = [
    { code: "SLE", name: "Sierra Leone Leone", symbol: "Le" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "EUR", name: "Euro", symbol: "€" },
]
