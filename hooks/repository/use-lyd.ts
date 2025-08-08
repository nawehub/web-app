import {useMutation, useQuery} from "@tanstack/react-query";
import {MakeDonationRequest} from "@/types/lyd";
import {lydService} from "@/lib/services/lyd";

export function useMakeDonationMutation() {
    return useMutation({
        mutationKey: ['makeDonation'],
        mutationFn: (data: MakeDonationRequest) => lydService().lyd.donate(data),
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