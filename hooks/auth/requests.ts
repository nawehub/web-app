import {RegisterRequest} from "@/store/auth";
import {apiRequest} from "@/lib/api";

export async function registerUser(userData: RegisterRequest) {
    return apiRequest("/services/register", {
        method: 'POST',
        body: JSON.stringify({ userData }),
    })
}

export async function verifyOTP(userId: string, otp: string) {
    return apiRequest("/services/verify-otp", {
        method: 'POST',
        body: JSON.stringify({ userId, otp }),
    })
}

export async function setPassword(newPassword: string, confirmPassword: string) {
    return apiRequest("/services/set-password", {
        method: 'POST',
        body: JSON.stringify({ newPassword, confirmPassword }),
    })
}

// Fetch users with authentication
export async function fetchUsers() {
    return apiRequest('/api/v1/users')
}