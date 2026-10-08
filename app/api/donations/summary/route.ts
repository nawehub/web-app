import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/** Total raised, number of donations and the latest donors - proxies GET /api/v1/donations/summary. */
export async function GET(request: Request) {
    try {
        const recent = new URL(request.url).searchParams.get("recent") ?? "8";
        const response = await gatewayFetch(`/donations/summary?recent=${encodeURIComponent(recent)}`);
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "public, max-age=15" } });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
