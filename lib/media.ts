const GATEWAY_PREFIX = "/api/v1/";

/**
 * Turns a media URL from web-api-gateway into one this site can load. The gateway returns its
 * own media as paths on itself ("/api/v1/opportunities/{id}/flier"), which would otherwise be
 * resolved against this site's origin and 404 - they're served through the /api/media proxy
 * instead. Absolute URLs (e.g. OAuth avatars) are returned unchanged.
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith(GATEWAY_PREFIX)) return `/api/media/${url.slice(GATEWAY_PREFIX.length)}`;
    if (/^https?:\/\//.test(url)) return url;
    return undefined;
}
