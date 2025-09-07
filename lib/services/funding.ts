import {z} from "zod";
import {FundingApplication, FundingOpportunity, FundingOpportunityDto, FundingProvider} from "@/types/funding";
import {api4app} from "@/lib/api4app";
import {approveOrRejectBizForm} from "@/lib/services/business";

export const createProviderForm = z.object({
    name: z.string({message: "provider name is required"}),
    description: z.string({message: "provider description is required"}),
    websiteUrl: z.string({message: "provider's website is required"}).url({message: "provider's website must be a valid url"}),
    contactEmail: z.string({message: "provider contact email is required"}).email({message: "provider contact email must be a valid email address"}),
    contactPhone: z.string({message: "provider's phone is required"}).min(9, {message: "provider contact phone must be a valid phone number"}),
    providerType: z.enum(["Government", "NGO", "Private", "Foundation", "Bank", "Corporate", "Individual", "Other"], {message: "provider type is required"}),
})

export type ApplyForm = {
    opportunityId: string
    applicantName: string
    applicantEmail: string
    applicantPhone: string
    businessName: string
    businessDescription: string
    businessStage: string
    criteriaResponse: { key: string; value: string }[]
    notes: string
    applicationStatus: string
}

export const approveOrRejectOpportunityForm = z.object({
    isFeatured: z.boolean(),
    rejectionReason: z.string().optional(),
    action: z.enum(['Approve', 'Reject'], {message: "action is required"})
})

export type ApproveOrRejectForm = {
    applicationId: string
    rejectionReason: string
    action: "Review" | "Approve" | "Reject"
}

export type filterType = "All" | "Open" | "Featured"

export type createOpportunityForm =
    Omit<FundingOpportunity, "id" | "provider" | "totalApplications" | "createdAt" | "updatedAt">
    & {
    providerId: string
}

export type createMinimalOpp = Omit<FundingOpportunityDto, "id" | "createdAt" | "updatedAt" | "provider"> & {
    providerId: string
}

export type OpportunityListResponse = {
    count: number
    opportunities: FundingOpportunityDto[]
}

export type ProviderListResponse = {
    count: number
    providers: FundingProvider[]
}

export type FundingCreateResponse<T> = {
    message: string
    provider: T
}

export type MinimalOpportunityResponse = {
    message: string;
    opportunityTitle: string;
    opportunityId: string;
}

export type ApplicationListResponse = {
    count: number
    applications: FundingApplication[]
}

export const fundingService = () => {
    return {
        providers: {
            listAll: async () => {
                const response = await api4app('/funding/providers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<ProviderListResponse>
            },
            create: async (req: z.infer<typeof createProviderForm>) => {
                const resp = await api4app('/funding/providers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<FundingCreateResponse<FundingProvider>>
            }
        },
        opportunities: {
            listAll: async (filter: filterType) => {
                const response = await api4app('/funding/opportunity/filter/' + filter, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<OpportunityListResponse>
            },
            getOne: async (id: string) => {
                const response = await api4app('/funding/opportunity/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<FundingOpportunityDto>
            },
            create: async (req: createMinimalOpp) => {
                const resp = await api4app('/funding/opportunity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<MinimalOpportunityResponse>
            },
            approveOrReject: async (id: string, req: z.infer<typeof approveOrRejectOpportunityForm>) => {
                const resp = api4app('/funding/opportunity/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })
                return resp as Promise<MinimalOpportunityResponse>
            }
        },
        applications: {
            apply: async (req: ApplyForm) => {
                const resp = await api4app('/funding/application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<FundingCreateResponse<FundingApplication>>
            },
            listApplications: async (id: string) => {
                const response = await api4app('/funding/application/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<ApplicationListResponse>
            },
            changeStatus: async (req: ApproveOrRejectForm) => {
                const resp = await api4app('/funding/application', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<FundingCreateResponse<FundingApplication>>
            },
        }
    }
}