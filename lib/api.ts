import {getSession} from "next-auth/react";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const session = await getSession()

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    if (session && session?.accessToken) {
        // @ts-ignore
        headers['Authorization'] = `Bearer ${session.accessToken}`
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `API request failed: ${response.statusText}`)
    }

    return response.json()
}