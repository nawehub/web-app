import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Public registration-tracking lookup - proxies to web-api-gateway's
 * GET /api/v1/businesses/by-tracking-id/{trackingId} (permitAll).
 */
export async function GET(request: Request, { params }: { params: Promise<{ trackingId: string }> }) {
    try {
        const { trackingId } = await params;
        const response = await gatewayFetch(`/businesses/by-tracking-id/${encodeURIComponent(trackingId)}`);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
