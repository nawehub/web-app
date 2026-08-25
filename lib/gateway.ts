const GATEWAY_BASE_URL =
    process.env.GATEWAY_API_BASE_URL ||
    process.env.REMOTE_GATEWAY_URL ||
    "http://localhost:8080/api/v1";

/**
 * Talks directly to web-api-gateway's public (permitAll) endpoints -
 * opportunities/big-ideas/entrepreneurs discovery, business registration.
 * No auth header: every route this is used for is unauthenticated on the
 * gateway side. FormData bodies (multipart, e.g. business registration's
 * businessMeta + idScan parts) are passed through untouched so fetch can
 * set its own multipart boundary - forcing a Content-Type here would break
 * that.
 */
export async function gatewayFetch(endpoint: string, options: RequestInit = {}) {
    const isMultipart = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers = new Headers(options.headers);
    if (!isMultipart && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    return fetch(`${GATEWAY_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: "no-store",
    });
}

export type PagedResponse<T> = {
    items: T[];
    pageSize: number;
    returnedCount: number;
    totalCount: number;
    hasNextPage: boolean;
    nextPageToken: string;
    hasPreviousPage: boolean;
    previousPageToken: string;
};
