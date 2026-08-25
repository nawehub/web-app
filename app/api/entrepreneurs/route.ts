import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams();
        params.set("status", "ACTIVE");
        params.set("vetted", "true");

        const query = url.searchParams.get("query");
        if (query) params.set("query", query);

        const district = url.searchParams.get("district");
        if (district) params.set("district", district);

        const gender = url.searchParams.get("gender");
        if (gender) params.set("gender", gender);

        const nationality = url.searchParams.get("nationality");
        if (nationality) params.set("nationality", nationality);

        const featured = url.searchParams.get("featured");
        if (featured) params.set("featured", featured);

        for (const s of url.searchParams.getAll("skills")) params.append("skills", s);

        const pageSize = url.searchParams.get("pageSize");
        if (pageSize) params.set("pageSize", pageSize);
        const pageToken = url.searchParams.get("pageToken");
        if (pageToken) params.set("pageToken", pageToken);
        const ascending = url.searchParams.get("ascending");
        if (ascending) params.set("ascending", ascending);

        const response = await gatewayFetch(`/entrepreneurs?${params.toString()}`, { method: "GET" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
