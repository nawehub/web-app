export interface LYDProfile {
    id: string
    firstName: string
    lastName: string
    gender: "Male" | "Female"
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
