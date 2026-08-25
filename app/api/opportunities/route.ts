import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams();
        params.set("status", "APPROVED");

        const searchQuery = url.searchParams.get("searchQuery");
        if (searchQuery) params.set("searchQuery", searchQuery);

        const geographicScope = url.searchParams.get("geographicScope");
        if (geographicScope) params.set("geographicScope", geographicScope);

        for (const c of url.searchParams.getAll("categories")) params.append("categories", c);
        for (const b of url.searchParams.getAll("targetBeneficiaries")) params.append("targetBeneficiaries", b);

        const pageSize = url.searchParams.get("pageSize");
        if (pageSize) params.set("pageSize", pageSize);
        const pageToken = url.searchParams.get("pageToken");
        if (pageToken) params.set("pageToken", pageToken);
        const ascending = url.searchParams.get("ascending");
        if (ascending) params.set("ascending", ascending);

        const response = await gatewayFetch(`/opportunities?${params.toString()}`, { method: "GET" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * Public opportunity submission - proxies straight through to web-api-gateway's
 * POST /api/v1/opportunities (multipart: `opportunity` JSON part + optional
 * `flier` file part). The raw body + Content-Type (with its multipart boundary)
 * are forwarded verbatim rather than reconstructed via request.formData() -
 * re-appending a parsed FormData's entries loses each part's declared
 * Content-Type (undici serializes it back out as application/octet-stream),
 * which the gateway then rejects with a 415 on the JSON part.
 */
export async function POST(request: Request) {
    try {
        const contentType = request.headers.get("content-type") ?? undefined;
        const body = await request.arrayBuffer();
        const response = await gatewayFetch("/opportunities", {
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
