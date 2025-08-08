import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const response = await apiRequest("/business/" + id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}