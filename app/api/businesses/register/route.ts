import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Public business registration - proxies straight through to web-api-gateway's
 * POST /api/v1/businesses (multipart: `businessMeta` JSON part + optional
 * `idScan` file part). The raw body + Content-Type (with its multipart boundary)
 * are forwarded verbatim rather than reconstructed via request.formData() -
 * re-appending a parsed FormData's entries loses each part's declared
 * Content-Type (undici serializes it back out as application/octet-stream),
 * which the gateway then rejects with a 415 on the JSON part.
 */
export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type") ?? undefined;
        const body = await request.arrayBuffer();
        const response = await gatewayFetch("/businesses", {
            method: "POST",
            headers: contentType ? { "Content-Type": contentType } : undefined,
            body,
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
