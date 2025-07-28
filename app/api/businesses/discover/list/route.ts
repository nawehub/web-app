import { z } from 'zod'
import {approveOrRejectBizForm} from "@/lib/services/business";
import { apiRequest } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all';

        const response = await apiRequest("/business?type=" + type, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        console.log(data)
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.log({error})
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}