import {useMutation, useQuery} from "@tanstack/react-query";
import {
    ApplyForm,
    ApproveOrRejectForm, createMinimalOpp,
    createProviderForm, filterType,
    fundingService
} from "@/lib/services/funding";
import {z} from "zod";

export const useListProvidersQuery = () => {
    return useQuery({
        queryKey: ['providers'],
        queryFn: async () => await fundingService().providers.listAll()
    });
}

export function useCreateProviderMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof createProviderForm>) => fundingService().providers.create(data),
    });
}

export const useListOpportunitiesQuery = (filter: filterType) => {
    return useQuery({
        queryKey: ['opportunities', filter],
        queryFn: async () => await fundingService().opportunities.listAll(filter)
    });
}

export const useGetOpportunityQuery = (id: string) => {
    return useQuery({
        queryKey: ['opportunities', id],
        queryFn: async () => await fundingService().opportunities.getOne(id)
    });
}

export function useCreateOpportunityMutation() {
    return useMutation({
        mutationKey: ['createOpportunity'],
        mutationFn: (data: createMinimalOpp) => fundingService().opportunities.create(data),
    });
}

export function useApplyToOpportunityMutation() {
    return useMutation({
        mutationKey: ['applyToOpportunity'],
        mutationFn: (data: ApplyForm) => fundingService().applications.apply(data),
    });
}

export const useListApplicationsQuery = (id: string) => {
    return useQuery({
        queryKey: ['applications', id],
        queryFn: async () => await fundingService().applications.listApplications(id)
    });
}

export function useChangeApplicationStatusMutation() {
    return useMutation({
        mutationKey: ['changeStatus'],
        mutationFn: (data: ApproveOrRejectForm) => fundingService().applications.changeStatus(data),
    });
}