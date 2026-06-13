import {useMutation, useQuery} from "@tanstack/react-query";
import {MakeContributionRequest} from "@/types/lyd";
import {lydService} from "@/lib/services/lyd";
import { v4 as uuidv4 } from 'uuid';

export function useMakeContributionMutation() {
    const mutationKey = "make-contribution";
    const STORAGE_KEY = `pending_idempotency_${mutationKey}`;

    return useMutation({
        mutationKey: [mutationKey],
        onMutate: async (variables) => {
            localStorage.setItem(STORAGE_KEY, variables.idempotencyKey);
        },
        mutationFn: async ({data, idempotencyKey}: {
            data: MakeContributionRequest,
            idempotencyKey: string
        }) => {
            return await lydService().lyd.donate(data, idempotencyKey);
        },
        onSuccess: () => {
            localStorage.removeItem(STORAGE_KEY);
        },
        onError: (error: any) => {
            if (error.status <= 500) {
                localStorage.removeItem(STORAGE_KEY);
            }
        },
        retry: false
    });
}

export const useListTopContributorsQuery = () => {
    return useQuery({
        queryKey: ['top-contributors'],
        queryFn: async () => await lydService().lyd.topContributors()
    });
}

export const useListDistrictRankingsQuery = () => {
    return useQuery({
        queryKey: ['district-rankings'],
        queryFn: async () => await lydService().lyd.districtRankings()
    });
}

export const useListProfileDonationsQuery = (emailOrPhone: string) => {
    return useQuery({
        queryKey: ['profile-donations', emailOrPhone],
        queryFn: async () => await lydService().lyd.profileDonations(emailOrPhone)
    });
}

export const useProfileWithContributionQuery = (emailOrPhone: string) => {
    return useQuery({
        queryKey: ['profile-with-contribution', emailOrPhone],
        queryFn: async () => await lydService().lyd.profileWithContribution(emailOrPhone),
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 60,    // 1 hour
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!emailOrPhone,
    });
}