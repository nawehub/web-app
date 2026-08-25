import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const response = await gatewayFetch(`/big-ideas/${id}`, { method: "GET" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
