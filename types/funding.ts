import {format, parseISO} from "date-fns";

export interface FundingOpportunity {
    id: string
    title: string
    description: string
    provider: FundingProvider | undefined
    amountMin: number
    amountMax: number
    currency: string
    applicationDeadline: Date
    status: "Open" | "Upcoming" | "Closed" | "Archived" | ""
    type:
        | "Grant"
        | "Loan"
        | "Accelerator"
        | "Pitch_Competition"
        | "Venture_Capital"
        | "Angel_Investment"
        | "Crowdfunding"
        | "Other"
        | ""
    eligibilitySummary: string
    isFeatured: boolean
    tags: string[]
    criteria: {
        key: string
        value: string
        type: "string" | "boolean" | "list" | "number"
        required: boolean
    }[]
    totalApplications: number
    createdAt: Date
    updatedAt: Date
}

export interface FundingOpportunityDto {
    id: string
    title: string
    description: string
    about: string
    provider: FundingProvider | undefined
    amountMin: number
    amountMax: number
    applicationDeadline: Date
    applyLink: string
    isFeatured: boolean
    status: {
        state: string;
        rejectionReason: string;
        statusActionDate: string;
    }
    createdAt: Date
    updatedAt: Date
}

export interface FundingProvider {
    id?: string
    name: string
    description: string
    websiteUrl: string
    contactEmail: string
    providerType: "Government" | "NGO" | "Private" | "Foundation" | "Bank" | "Corporate" | "Individual" | "Other"
    createdBy: string
    contactPhone: string
    createdAt: Date
}

export interface DashboardStats {
    totalActiveUsers: number
    totalFundingOpportunities: number
    totalRegisteredBusinesses: number
    fundedProjects: number
}

export interface RecentActivity {
    id: string
    type: "application" | "funding" | "registration" | "approval"
    description: string
    timestamp: Date
    user?: string
}

export interface UserActivityData {
    month: string
    users: number
}

export interface FundingApplication {
    id: string
    opportunityId: string
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    businessName: string
    businessDescription: string
    businessStage: "Idea" | "Startup" | "Early_Stage" | "Growth" | "Mature"
    criteriaResponse: {
        key: string
        value: string
    }[]
    applicationStatus: "Draft" | "Submitted" | "Under_Review" | "Approved" | "Rejected" | "Withdrawn"
    notes: string
    rejectReason: string
    createdBy: string
    submissionDate: Date
    lastUpdateDate: Date
}

export const fundingTypes = [
    "Grant",
    "Loan",
    "Accelerator",
    "Pitch_Competition",
    "Venture_Capital",
    "Angel_Investment",
    "Crowdfunding",
    "Other",
]

export const currencies = ["SLE", "USD", "EUR", "GBP"]
export const criteriaTypes = ["String", "Number", "Boolean", "Date", "List"]
export const providerTypes = ["Government", "NGO", "Private", "Foundation", "Bank", "Corporate", "Individual", "Other"]
export const businessStages = ["Idea", "Startup", "Early_Stage", "Growth", "Mature"]

export const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
        return "N/A"
    }
    const date = parseISO(dateString)
    return format(date, "MMMM do, yyyy 'at' hh:mm a")
}
