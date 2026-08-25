import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams();
        params.set("status", "APPROVED");

        const searchQuery = url.searchParams.get("searchQuery");
        if (searchQuery) params.set("searchQuery", searchQuery);

        const stage = url.searchParams.get("stage");
        if (stage) params.set("stage", stage);

        const pageSize = url.searchParams.get("pageSize");
        if (pageSize) params.set("pageSize", pageSize);
        const pageToken = url.searchParams.get("pageToken");
        if (pageToken) params.set("pageToken", pageToken);
        const ascending = url.searchParams.get("ascending");
        if (ascending) params.set("ascending", ascending);

        const response = await gatewayFetch(`/big-ideas?${params.toString()}`, { method: "GET" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * Public "Next Big Idea" submission - proxies straight through to
 * web-api-gateway's POST /api/v1/big-ideas (plain JSON body matching
 * IdeaDto.CreateIdeaDto).
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const response = await gatewayFetch("/big-ideas", {
            method: "POST",
            body,
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
