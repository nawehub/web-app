import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/** The announced shortlist, finalists and winners - proxies GET /api/v1/competitions/{id}/entrants. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await gatewayFetch(`/competitions/${encodeURIComponent(id)}/entrants`);
        const data = await response.json().catch(() => ({}));
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
