import { gatewayFetch } from "@/lib/gateway";

/**
 * Same-origin proxy for the public media web-api-gateway serves (opportunity fliers, big-idea
 * materials, avatars, resource thumbnails). The gateway returns these as paths on itself
 * (e.g. /api/v1/opportunities/{id}/flier) - see lib/media.ts, which rewrites them to
 * /api/media/... so they load through this site. Only the public media routes are allowed.
 */
const ALLOWED = [
    /^opportunities\/[\w-]+\/flier$/,
    /^big-ideas\/[\w-]+\/materials\/[\w.-]+$/,
    /^auth\/users\/[\w-]+\/profile-image$/,
    /^resources\/[\w-]+\/thumbnail$/,
];

// Headers worth passing through to the browser.
const FORWARDED_HEADERS = ["content-type", "content-length", "content-disposition", "cache-control", "x-content-type-options"];

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const joined = path.map(encodeURIComponent).join("/");
    if (!ALLOWED.some((pattern) => pattern.test(path.join("/")))) {
        return new Response("Not found", { status: 404 });
    }

    try {
        const search = new URL(request.url).search;
        const upstream = await gatewayFetch(`/${joined}${search}`, { method: "GET", headers: { Accept: "*/*" } });
        if (!upstream.ok || !upstream.body) {
            return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
        }
        const headers = new Headers();
        for (const name of FORWARDED_HEADERS) {
            const value = upstream.headers.get(name);
            if (value) headers.set(name, value);
        }
        return new Response(upstream.body, { status: 200, headers });
    } catch {
        return new Response(null, { status: 502 });
    }
}
