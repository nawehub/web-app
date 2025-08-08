import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Not authenticated');
    }

    if (session.error === 'RefreshAccessTokenError') {
        // Force the client to re-authenticate
        throw new Error('Session expired');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        ...options.headers,
    };

    return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

}

export async function apiRequest4ResourceUpload(endpoint: string, options: RequestInit = {}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Not authenticated');
    }

    if (session.error === 'RefreshAccessTokenError') {
        // Force the client to re-authenticate
        throw new Error('Session expired');
    }

    const headers = {
        'Authorization': `Bearer ${session.accessToken}`,
        ...options.headers,
    };
    // @ts-ignore
    delete headers['Content-Type'];

    return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
}

export async function api4Public(endpoint: string, options: RequestInit = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

}
