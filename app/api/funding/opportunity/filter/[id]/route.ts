import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const response = await apiRequest(`/funding/opportunities/minimal/${id}/get`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}