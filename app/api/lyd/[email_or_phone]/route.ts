import {api4Public} from "@/lib/api";
import {NextResponse} from "next/server";

export async function GET(_: Request, { params }: { params: { email_or_phone: string } }) {
    try {
        const { email_or_phone } = await params;

        const response = await api4Public("/lyd/profile/" + email_or_phone + "/wit-contribution", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}