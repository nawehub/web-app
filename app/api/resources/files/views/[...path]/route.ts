import {apiRequest} from "@/lib/api";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        // 1. Extract path and query parameters from the incoming Next.js client request
        const url = new URL(request.url);

        // The path contains the bucketName/objectName
        const pathSegments = url.pathname.split('/api/resources/files/views')[1];

        // The query string includes '?preview=true'
        const queryString = url.search;

        // 2. Construct the full URL for the remote API Gateway
        const remoteUrl = `${process.env.API_BASE_URL}/storage${pathSegments}${queryString}`;

        // 3. Forward the request to the remote server
        const remoteResponse = await fetch(remoteUrl);

        // Check for non-200 status codes
        if (!remoteResponse.ok) {
            console.log(remoteResponse)
            return new NextResponse(`Remote API Error: ${remoteResponse.statusText}`, {
                status: remoteResponse.status
            });
        }

        // 4. Relay the response back to the client
        // Next.js (and the browser) will automatically read headers like
        // Content-Type and Content-Disposition to handle display/download.
        return new NextResponse(remoteResponse.body, {
            status: remoteResponse.status,
            headers: remoteResponse.headers, // Includes Content-Type, Content-Disposition, etc.
        });

    } catch (error) {
        console.log(error)
        return new NextResponse('Internal Server Error while fetching file.', { status: 500 });
    }
}