import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    ApplyForm,
    ApproveOrRejectForm, approveOrRejectOpportunityForm, createMinimalOpp,
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

export const useGetProviderQuery = (id: string) => {
    return useQuery({
        queryKey: ['provider', id],
        queryFn: async () => await fundingService().providers.getOne(id)
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
        queryKey: ['opportunity', id],
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

export function useApproveRejectOpportunityMutation(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['approve-reject-opportunity', id],
        mutationFn: (req: z.infer<typeof approveOrRejectOpportunityForm>) => fundingService().opportunities.approveOrReject(id, req),
        onSuccess(_, variables) {
            queryClient.invalidateQueries({ queryKey: ['opportunities', 'opportunity', id] }).then();
        },
    });
}