import {NextResponse} from "next/server";
import {z} from "zod";
import {setPasswordForm} from "@/lib/services/use-auth";

export async function POST(request: Request) {
    try {
        const user: z.infer<typeof setPasswordForm> = await request.json();
        console.log({user})
        const response = await fetch(`${process.env.API_BASE_URL}/auth/change-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({
                newPassword: user.newPassword,
                confirmPassword: user.confirmPassword,

            }),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}