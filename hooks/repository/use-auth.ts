import {useMutation} from "@tanstack/react-query";
import {authService, registerForm, setPasswordForm, verifyForm} from "@/lib/services/use-auth";
import {z} from "zod";

export function useRegisterMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof registerForm>) => authService().auth.register(data),
    });
}

export function useVerifyOtpMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof verifyForm>) => authService().auth.verifyOtp(data),
    });
}

export function useSetPasswordMutation() {
    return useMutation({
        mutationFn: (data: z.infer<typeof setPasswordForm>) =>
            authService().auth.setPassword(data),
    });
}

