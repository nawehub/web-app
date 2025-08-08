import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";
import {CreateFolderTagRequest} from "@/types/files";

export async function GET(_: Request) {
    try {
        const response = await apiRequest("/folder", {
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
        const body: CreateFolderTagRequest = await req.json();
        const response = await apiRequest("/folder", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}