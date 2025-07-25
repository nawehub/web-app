type Permission = {
    id: string;
    name: string;
    description: string;
}

export type Role = {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

export type User = {
    accessToken?: string
    refreshToken?: string
    expiresIn?: number
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