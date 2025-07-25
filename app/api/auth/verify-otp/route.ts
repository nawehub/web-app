import {NextResponse} from "next/server";
import {z} from "zod";
import {verifyForm} from "@/lib/services/use-auth";

export async function POST(request: Request) {
    try {
        const body: z.infer<typeof verifyForm> = await request.json();
        const response = await fetch(`${process.env.API_BASE_URL}/auth/verify-otp`, {
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
