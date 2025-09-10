import {userService} from "@/lib/services/user";
import {useQuery} from "@tanstack/react-query";
import {approveOrRejectUserForm} from "@/types/user";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {z} from "zod";

export const useListUsersRequireApprovalQuery = () => {
    return useQuery({
        queryKey: ['require-approval'],
        queryFn: async () => await userService().user.listAllRequireApproval()
    });
}

export function useApproveRejectUserMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['approve-reject-user'],
        mutationFn: (data: z.infer<typeof approveOrRejectUserForm>) => userService().user.approveRejectUser(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['require-approval'] }).then();
        },
    });
}