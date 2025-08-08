import {apiRequest, apiRequest4ResourceUpload} from "@/lib/api";
import {NextResponse} from "next/server";

export async function GET(_: Request) {
    try {
        const response = await apiRequest("/resources/all", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Create new FormData for gateway request
        const gatewayFormData = new FormData();

        // Get metadata and parse it
        const metadataStr = formData.get('metadata');
        const file = formData.get('file');

        if (!metadataStr || !file) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Add metadata with content-type
        gatewayFormData.append('metadata', metadataStr);

        gatewayFormData.append('file', file);

        const response = await apiRequest4ResourceUpload(`/resources`, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            body: gatewayFormData,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}