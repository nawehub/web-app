import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Attaches an optional supporting file to an already-submitted idea - proxies
 * to web-api-gateway's POST /api/v1/big-ideas/{id}/supporting-material
 * (multipart `file` part + `materialType` query param). The raw body +
 * Content-Type (with its multipart boundary) are forwarded verbatim rather
 * than reconstructed via request.formData() - re-appending a parsed
 * FormData's entries loses each part's declared Content-Type.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const materialType = url.searchParams.get("materialType") ?? "";
        const contentType = request.headers.get("content-type") ?? undefined;
        const body = await request.arrayBuffer();

        const response = await gatewayFetch(
            `/big-ideas/${id}/supporting-material?materialType=${encodeURIComponent(materialType)}`,
            { method: "POST", headers: contentType ? { "Content-Type": contentType } : undefined, body },
        );
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
