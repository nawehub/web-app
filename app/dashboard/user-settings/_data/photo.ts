"use client";

/* ============================================================
   Photo handling — the single path for turning a picked File into
   a URL the profile can store, plus the cleanup needed to avoid
   leaking object URLs. Both the avatar camera button and the
   schema-driven photo field go through here.
   ============================================================ */

/** True for the local `blob:` previews we create with createObjectURL. */
export function isBlobUrl(url?: string | null): boolean {
    return typeof url === "string" && url.startsWith("blob:");
}

/** Revoke a local preview URL (no-op for hosted/remote/empty URLs). */
export function revokePreview(url?: string | null): void {
    if (isBlobUrl(url)) URL.revokeObjectURL(url as string);
}

/**
 * Upload a profile photo and return the URL to store.
 *
 * TODO(api): POST the file to storage and return the hosted/CDN URL.
 * Until that exists we return a local object URL for an instant preview;
 * callers must revokePreview() the value they replace to avoid leaks.
 */
export async function uploadPhoto(file: File): Promise<string> {
    return URL.createObjectURL(file);
}
