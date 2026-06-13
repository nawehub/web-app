export interface LYDContributor {
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

export interface LYDContribution {
    id: string
    amount: Money
    target: "District" | "Chiefdom"
    district: string
    paymentMethod: "Payment_Code" | "CheckoutSession"
    targetId: string
    status: "Pending" | "Completed" | "Failed" | "Refunded" | "Cancelled" | "Declined"
    createdAt: Date
    updatedAt: Date
}

export type Currency = "SLE" | "USD" | "GBP" | "EUR"

export type Money = {
    amount: number
    currency: Currency
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

export type MakeContributionRequest = {
    contributor: Omit<LYDContributor, "id" | "createdAt" | "updatedAt">
    districtId: string;
    target: "District" | "Chiefdom";
    targetId: string;
    paymentMethod:  "Payment_Code" | "CheckoutSession";
    amount: Money,
    successUrl: string,
    cancelUrl: string
}

export type ProfileWithContribution = Omit<LYDContributor, "createdAt" | "updatedAt"> & {
    totalContributions: Money
}