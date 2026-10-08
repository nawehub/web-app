import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Starts a donation to the Next Big Idea fund - proxies POST /api/v1/donations. The visitor's
 * address is passed on so the gateway's per-visitor limit applies to them, not to this server.
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const forwardedFor = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
        const response = await gatewayFetch("/donations", {
            method: "POST",
            body,
            headers: forwardedFor ? { "X-Forwarded-For": forwardedFor } : undefined,
        });
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
