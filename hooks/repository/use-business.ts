import {useMutation, useQuery} from "@tanstack/react-query";
import {z} from "zod";
import {approveOrRejectBizForm, businessService, registerBizForm} from "@/lib/services/business";

export function useRegisterBusinessMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof registerBizForm>) => businessService().business.registerBiz(data),
    });
}

export function useRegisterPublicBusinessMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof registerBizForm>) => businessService().business.registerPublicBiz(data),
    });
}

export function useApproveRejectBusinessMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof approveOrRejectBizForm>) => businessService().business.approveOrReject(data),
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