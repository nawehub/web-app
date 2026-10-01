import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Public opportunity-status lookup - proxies to web-api-gateway's
 * GET /api/v1/opportunities/by-tracking-id/{trackingId} (permitAll).
 */
export async function GET(request: Request, { params }: { params: Promise<{ trackingId: string }> }) {
    try {
        const { trackingId } = await params;
        const response = await gatewayFetch(`/opportunities/by-tracking-id/${encodeURIComponent(trackingId)}`);
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
