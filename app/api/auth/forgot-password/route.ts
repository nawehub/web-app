import {registerForm} from "@/lib/services/use-auth";
import {NextResponse} from "next/server";
import {z} from "zod";

export async function POST(request: Request) {
    try {
        const body: z.infer<typeof registerForm> = await request.json();
        const response = await fetch(`${process.env.API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}