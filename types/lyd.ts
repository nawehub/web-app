export interface LYDProfile {
    id: string
    firstName: string
    lastName: string
    gender: "Male" | "Female" | "Prefer_Not_To_Say" | ""
    phoneNumber: string
    email: string
    nationality: string
    isAnonymous: boolean
    createdAt: Date
    updatedAt: Date
}

export interface LYDDonation {
    id: string
    amount: number
    target: "District" | "Chiefdom"
    district: string
    paymentMethod: "Momo" | "Bank" | "Card"
    paymentProvider: string
    currency: "SLE" | "USD" | "GBP" | "EUR"
    targetValue: string
    status: "Pending" | "Completed" | "Failed" | "Refunded" | "Cancelled" | "Declined"
    createdAt: Date
    updatedAt: Date
}

export interface DistrictRanking {
    district: string
    totalContributors: number
    totalContributions: number
}

export interface TopContributor {
    id: string
    firstName: string
    lastName: string
    nationality: string
    totalContributions: number
    totalContributionsCount: number
    anonymous: boolean
}

export type MakeDonationRequest = {
    profile: Omit<LYDProfile, "id" | "createdAt" | "updatedAt">
    amount: number
    target: "District" | "Chiefdom"
    district: string
    paymentMethod: "Momo" | "Bank" | "Card"
    paymentProvider: string
    currency: "SLE" | "USD" | "GBP" | "EUR"
    targetValue: string
}

type Venue = {
    id: string;
    name: string;
    address: string;
    capacity: number;
    amenities: string[]; // e.g., ["Wi-Fi", "Parking", "Projector"]
    contactPerson?: string;
}

export type ProfileWithContribution = Omit<LYDProfile, "createdAt" | "updatedAt"> & {
    paymentMethod: "Momo" | "Bank" | "Card"
    paymentProvider: string
    currency: "SLE" | "USD" | "GBP" | "EUR"
    totalContributions: number
}