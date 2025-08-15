import {api4Public} from "@/lib/api";
import {NextResponse} from "next/server";
import {MakeDonationRequest} from "@/types/lyd";

export async function POST(req: Request) {
    try {
        const body: MakeDonationRequest = await req.json();
        const response = await api4Public("/lyd", {
            method: 'POST',
            body: JSON.stringify(body),
        })

        const data = await response.json();
        return NextResponse.json(data, {status: response.status});
    } catch (error) {
        return NextResponse.json({message: 'Internal server error'}, {status: 500});
    }
}
