import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Not authenticated');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': session.accessToken || '',
        ...options.headers,
    };

    return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

}

export async function  api4app (endpoint: string, options: RequestInit = {}) {
    const baseUrl = "/api"
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
}