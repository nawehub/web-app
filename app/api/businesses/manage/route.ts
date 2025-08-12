import {z} from "zod";
import {NextResponse} from "next/server";
import {approveOrRejectBizForm, registerBizForm} from "@/lib/services/business";
import {api4Public, apiRequest} from "@/lib/api";

function passthrough(res: Response) {
    // Stream upstream response as-is; no JSON parsing, so no crash on empty bodies.
    return new NextResponse(res.body, {
        status: res.status,
        headers: {
            // Preserve content type if provided; default to JSON.
            "Content-Type": res.headers.get("content-type") ?? "application/json",
        },
    });
}


export async function POST(req: Request) {
    try {
        const body: z.infer<typeof registerBizForm> = await req.json();
        const response = await apiRequest("/business/register", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        console.log({data})
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        console.log({error})
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}

export async function PUT(request: Request) {
    try {
        const body: z.infer<typeof approveOrRejectBizForm> = await request.json();
        const response = await apiRequest("/business/approve-reject", {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}