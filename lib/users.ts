export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

// This would typically be a database
export const users: User[] = [
    {
        id: "1",
        name: "James Doe",
        email: "james@example.com",
        password: "$2b$10$gc6Dajm4Fdrm9YLEpkVZKOjZolbIm9XqUPPH34uW6O4b9MH/gvele", // "password123"
        role: "user",
    },
];