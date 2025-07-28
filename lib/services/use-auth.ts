import {z} from "zod";
import {api4app} from "@/lib/api";

export const registerForm = z.object({
    firstName: z.string().min(2, {message: 'firstName is required'}),
    lastName: z.string().min(2, {message: 'lastName is required'}),
    email: z.string().email({message: 'must be a valid email'}),
    phoneNumber: z.string().min(10, {message: 'phone is required'}),
    username: z.string().min(5, {message: 'username is required'}),
    gender: z.enum(['Male', 'Female'], { message: 'gender is required' }),
    role: z.enum(['entrepreneur', 'development-partner'], { message: 'role is required' }),
});

export const loginForm = z.object({
    email: z.string().email({message: 'must be a valid email'}),
    password: z.string().min(8, {message: 'password is required'}),
});

export const verifyForm = z.object({
    userId: z.string({message: "User id is required"}).startsWith("usr-", {message: "User id must start with user prefix"}),
    otp: z.string({message: 'otp is required'}).min(8, {message: 'otp should be at least 8 characters long'}),
});

export const setPasswordForm = z.object({
    accessToken: z.string({message: 'accessToken is required'}),
    newPassword: z.string({message: 'password is required'}).min(8, {message: 'password should be at least 8 characters long'}),
    confirmPassword: z.string({message: 'password is required'}),
});

interface ApiClientConfig {
    token?: string | null;
}

export const authService = () => {
    return {
        auth: {
            register: async (req: z.infer<typeof registerForm>) =>
                api4app('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(req),
                }),
            verifyOtp: async (req: z.infer<typeof verifyForm>) =>
                api4app('/auth/verify-otp', {
                    method: 'POST',
                    body: JSON.stringify(req),
                }),
            setPassword: async (req: z.infer<typeof setPasswordForm>) =>
                api4app('/auth/set-password', {
                    method: 'POST',
                    body: JSON.stringify(req),
                }),
        },
    };
}