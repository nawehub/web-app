import {Role} from "@/types/api-types";

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    roles: Role[];
}

// This would typically be a database
export const users: AuthUser[] = [
    {
        id: "1",
        firstName: "James",
        lastName: "Doe",
        name: "James Doe",
        email: "james@example.com",
        roles: [
            {
                "id": "donator",
                "name": "Donator",
                "description": "Can make donations to districts and SME`s",
                "permissions": [
                    {
                        "id": "donator",
                        "name": "Donator",
                        "description": "Can make donations to districts and SME`s"
                    }
                ]
            },
            {
                "id": "user",
                "name": "User",
                "description": "Basic user role",
                "permissions": [
                    {
                        "id": "user",
                        "name": "User",
                        "description": "Basic user role"
                    }
                ]
            }
        ],
    },
];