import { gatewayFetch } from "@/lib/gateway";

export const dynamic = "force-dynamic";

/**
 * Live status of one donation as server-sent events - streams GET /api/v1/donations/{id}/events
 * straight through. Ends when the donation does (or when the visitor leaves).
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const upstream = await gatewayFetch(`/donations/${encodeURIComponent(id)}/events`, {
            headers: { Accept: "text/event-stream" },
            signal: request.signal,
        });
        if (!upstream.ok || !upstream.body) {
            return new Response(JSON.stringify({ message: "Donation not found" }), { status: upstream.status || 502 });
        }
        return new Response(upstream.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });
    } catch {
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
