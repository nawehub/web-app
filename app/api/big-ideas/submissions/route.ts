import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

/**
 * Public "Next Big Idea" submission - proxies to web-api-gateway's
 * POST /api/v1/big-ideas/submissions (multipart: `idea` JSON part + optional `material`
 * file; `materialType` / `createNawehubAccount` query params). The raw body + Content-Type
 * (with its multipart boundary) are forwarded verbatim - re-building it via
 * request.formData() loses each part's declared Content-Type.
 */
export async function POST(request: Request) {
    try {
        const search = new URL(request.url).search;
        const contentType = request.headers.get("content-type") ?? undefined;
        const body = await request.arrayBuffer();
        const response = await gatewayFetch(`/big-ideas/submissions${search}`, {
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
