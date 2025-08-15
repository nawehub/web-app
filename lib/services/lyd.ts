import {DistrictRanking, LYDDonation, MakeDonationRequest, ProfileWithContribution, TopContributor} from "@/types/lyd";
import {api4app} from "@/lib/api4app";

export type DonationResponse = {
    message: string
    status: string
}

export type ListProfileDonationsResponse = {
    totalCount: number
    donations: LYDDonation[]
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
            donate: async (req: MakeDonationRequest) => {
                const resp = await api4app('/lyd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<DonationResponse>
            }
        },
    }
}