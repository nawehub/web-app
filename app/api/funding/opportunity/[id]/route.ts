import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";
import {ApplyForm} from "@/lib/services/funding";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const response = await apiRequest("/funding/opportunities/minimal/opp/" + id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body: ApplyForm = await req.json();
        const response = await apiRequest("/funding/opportunities/apply", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}