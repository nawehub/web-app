export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string
        email: string
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

export type ApiErrorResponse = {
    timestamp: string
    path: string
    status: number
    error: string
    requestId: string
    message: string
}