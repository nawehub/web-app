import NextAuth from "next-auth"
import { DefaultSession } from "next-auth";
import {User} from "@/types/api-types";

declare module "next-auth" {
    interface Session {
        accessToken?: string
        refreshToken?: string
        expiresIn?: number
        error?: 'RefreshAccessTokenError';
        user: User & DefaultSession["user"];
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
        roles: Array<{
            id: string
            name: string
            description: string
            permissions: Array<{
                id: string
                name: string
                description: string
            }>
        }>
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        refreshToken: string
        expiresIn: number
        error?: 'RefreshAccessTokenError';
        user: User;
    }
}