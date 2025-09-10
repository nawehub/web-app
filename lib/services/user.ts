import {api4app} from "@/lib/api4app";
import {approveOrRejectUserForm, UserListResponse} from "@/types/user";
import {z} from "zod";

export const userService = () => {
    return {
        user: {
            listAllRequireApproval: async () => {
                const response = await api4app('/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<UserListResponse>
            },
            approveRejectUser: async (data: z.infer<typeof approveOrRejectUserForm>) => {
                const response = await api4app('/users', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                return response as Promise<{message: string}>
            }
        }
    }
}