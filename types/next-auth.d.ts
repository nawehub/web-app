import { DefaultSession } from "next-auth";
import {UserRole} from "@/types/user";

declare module "next-auth" {
    interface Session {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        error?: string;
        user: {
            id: string
            email: string
            name: string
            firstName: string
            lastName: string
            phone: string
            gender: string
            status: string
            approved: boolean
            devPartnerId: string,
            devPartnerName: string,
            role: UserRole
        } & DefaultSession["user"];
    }

    interface User {
        accessToken: string
        refreshToken: string
        expiresIn: number
        id: string
        email: string
        name: string
        firstName: string
        lastName: string
        phone: string
        gender: string
        status: string
        approved: boolean
        devPartnerId: string,
        devPartnerName: string,
        role: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        refreshToken: string
        expiresIn: number
        error?: string;
        user: {
            id: string
            email: string
            name: string
            firstName: string
            lastName: string
            phone: string
            gender: string
            status: string
            approved: boolean
            devPartnerId: string,
            devPartnerName: string,
            role: UserRole
        };
    }
}