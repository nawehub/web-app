import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";
import {z} from "zod";
import {registerBizForm} from "@/lib/services/business";

export async function GET(_: Request) {
    try {
        const response = await apiRequest("/category", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: z.infer<typeof registerBizForm> = await req.json();
        const response = await apiRequest("/category", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}