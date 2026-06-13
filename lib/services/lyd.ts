import {DistrictRanking, LYDContribution, MakeContributionRequest, ProfileWithContribution, TopContributor} from "@/types/lyd";
import {api4app} from "@/lib/api4app";

// ─── Mirrors ContributionResponse from api-gateway ───────────────────────────
export interface UsageInstructions {
    title: string
    steps: string[]
    expiryMessage: string
}

export interface ContributionResponse {
    contributionId: string
    actionUrlOrCode: string
    usageInstructions?: UsageInstructions
    status: ContributionStatus
    expiresAt: string
    expiresInSeconds: number
}

export type ContributionStatus =
    | "CREATED"
    | "PAYMENT_REQUESTED"
    | "PAYMENT_PENDING"
    | "PAYMENT_COMPLETED"
    | "PAYMENT_FAILED"
    | "PAYMENT_CANCELLED"
    | "PAYMENT_EXPIRED"

export type ListProfileDonationsResponse = {
    totalCount: number
    donations: LYDContribution[]
}

export const lydService = () => {
    return {
        lyd: {
            topContributors: async () => {
                const response = await api4app('/lyd/top-contributors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<TopContributor[]>
            },
            districtRankings: async () => {
                const response = await api4app('/lyd/rankings', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<DistrictRanking[]>
            },
            profileDonations: async (emailOrPhone: string) => {
                const response = await api4app('/lyd/profile/' + emailOrPhone, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<ListProfileDonationsResponse>
            },
            profileWithContribution: async (emailOrPhone: string) => {
                const response = await api4app('/lyd/' + emailOrPhone, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<ProfileWithContribution>
            },
            donate: async (req: MakeContributionRequest, idempotencyKey: string) => {
                const resp = await api4app('/lyd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "X-Idempotency-Key": idempotencyKey
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<ContributionResponse>
            }
        },
    }
}