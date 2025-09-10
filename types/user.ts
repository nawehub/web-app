import { z } from "zod"

export type User = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    gender: string,
    status: string,
    approved: boolean,
    rejected: boolean,
    devPartnerId: string,
    devPartnerName: string,
    createdAt: Date,
    updatedAt: Date
}

export type UserListResponse = { users: User[], total: number }

export const approveOrRejectUserForm = z.object({
    userId: z.string({message: "business id is required"}),
    action: z.enum(['Approve', 'Reject'], {message: "action is required"})
})