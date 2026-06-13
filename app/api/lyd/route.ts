import {api4Public} from "@/lib/api";
import {NextResponse} from "next/server";
import {MakeContributionRequest} from "@/types/lyd";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const idempotencyKey = req.headers.get("X-Idempotency-Key");

        if (!idempotencyKey) {
            return NextResponse.json({ message: "Missing Idempotency Key" }, { status: 400 });
        }

        const response = await api4Public("/lyd", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                // Ensure no other headers interfere
                "X-Idempotency-Key": idempotencyKey,
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Next.js Proxy Error:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
