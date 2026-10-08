import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/** One donation's status - proxies GET /api/v1/donations/{id}. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await gatewayFetch(`/donations/${encodeURIComponent(id)}`);
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
