import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";
import {ApplyForm, ApproveOrRejectForm} from "@/lib/services/funding";

export async function POST(req: Request) {
    try {
        const body: ApplyForm = await req.json();
        console.log({body})
        const response = await apiRequest("/funding/opportunity/applications", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}

export async function PUT(req: Request) {
    try {
        const body: ApproveOrRejectForm = await req.json();
        const response = await apiRequest("/funding/opportunity/applications/change-status", {
            method: 'PUT',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}