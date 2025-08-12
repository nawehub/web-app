import {z} from "zod";
import {registerBizForm} from "@/lib/services/business";
import {api4Public, apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const body: z.infer<typeof registerBizForm> = await req.json();
        const response = await api4Public("/business/public/register", {
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