import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";
import {approveOrRejectBizForm, businessService, registerBizForm} from "@/lib/services/business";

export function useRegisterBusinessMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: z.infer<typeof registerBizForm>) => businessService().business.registerBiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] }).then();
        },
    });
}

export function useRegisterPublicBusinessMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: z.infer<typeof registerBizForm>) => businessService().business.registerPublicBiz(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] }).then();
        },
    });
}

export function useApproveRejectBusinessMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: z.infer<typeof approveOrRejectBizForm>) => businessService().business.approveOrReject(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['businesses', 'business', variables.businessId] }).then();
        },
    });
}

export const useListBusinessQuery = (type: string) => {
    const businessQueryKey = ['businesses', type];
    return useQuery({
        queryKey: businessQueryKey,
        queryFn: async () => await businessService().business.listAll(type)
    });
}

export const useGetBusinessQuery = (id: string) => {
    const businessQueryKey = ['business', id];
    return useQuery({
        queryKey: businessQueryKey,
        queryFn: async () => await businessService().business.getOne(id)
    });
}