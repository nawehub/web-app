import { z } from 'zod'
import {registerForm} from "@/lib/services/use-auth";
import {ApiErrorResponse} from "@/lib/auth-response";
import {api4app} from "@/lib/api4app";

export const registerBizForm = z.object({
    businessName: z.string({message: "business name is required"}).min(3, {message: "business name must be at least 3 chars long"})
        .max(100, { message: "business name must be at most 100 chars long" }),
    businessAddress: z.string({message: "business address is required"}),
    ownerName: z.string({message: "business owner name is required"}),
    ownerAddress: z.string({message: "owner's address is required"}),
    placeOfBirth: z.string({message: "owner's place of birth is required"}),
    dateOfBirth: z.date({message: "owner's date of birth is required"}),
    gender: z.enum(['Male', 'Female'], { message: "owner's gender is required" }),
    nationality: z.string({message: "owner's nationality is required"}),
    mothersName: z.string({message: "owner's mother's name required"}),
    contactNumber: z.string({message: "owner's contact number is required"}),
    email: z.string({message: "email is required"}).email({message: "owner's email must be a valid email address"}),
    category: z.string({message: "business category is required"}),
    registerDate: z.date({message: "register date must be valid"}).optional(),
})

export const approveOrRejectBizForm = z.object({
    businessId: z.string({ message: "business id is required"}),
    rejectionReason: z.string().optional(),
    action: z.enum(['Approve', 'Reject'], { message: "action is required" })
})

export type BusinessData = {
    id: string;
    businessName: string;
    businessAddress: string;
    ownerName: string;
    ownerAddress: string;
    placeOfBirth: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    nationality: string;
    mothersName: string;
    contactNumber: string;
    email: string;
    category: string;
    registerDate: string;
    status: {
        state: string;
        rejectionReason: string;
        statusActionDate: string;
    }
    createdAt: string;
    updatedAt: string;
}

export type ActionResponse = {
    message: string;
    status: string;
}

export type BusinessListResponse = {
    count: number;
    businesses: BusinessData[];
}

export const businessService = () => {
    return {
        business: {
            registerBiz: async (req: z.infer<typeof registerBizForm>) =>
                api4app('/businesses/manage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                }),
            approveOrReject: async (req: z.infer<typeof approveOrRejectBizForm>) =>
                api4app('/businesses/manage', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                }),
            listAll: async (type: string) => {
                const response = await api4app('/businesses/discover?type=' + type, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })

                return response as Promise<BusinessListResponse>
            },
            getOne: async (id: string) =>
                api4app('/businesses/discover/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
        }
    }
}