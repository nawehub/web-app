import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/** Public competition listing - proxies GET /api/v1/competitions (the gateway never returns drafts). */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams();
        for (const key of ["state", "search", "pageSize", "pageToken"]) {
            const value = url.searchParams.get(key);
            if (value) params.set(key, value);
        }
        const response = await gatewayFetch(`/competitions?${params.toString()}`, { method: "GET" });
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
