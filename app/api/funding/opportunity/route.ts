import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";
import {createMinimalOpp} from "@/lib/services/funding";

export async function GET(_: Request) {
    try {
        const response = await apiRequest("/funding/opportunities/minimal/all", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: createMinimalOpp = await req.json();
        const response = await apiRequest("/funding/opportunities/new-minimal", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}