import { NextResponse } from "next/server";
import { gatewayFetch } from "@/lib/gateway";

export async function GET() {
    try {
        const response = await gatewayFetch("/opportunities/analysis", { method: "GET" });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
