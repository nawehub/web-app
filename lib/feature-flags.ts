/**
 * Feature flags derived from build-time env vars.
 *
 * NOTE: In Next.js client components, env vars must be referenced as
 * `process.env.NEXT_PUBLIC_*` (not dynamically) to be inlined.
 */
export const AUTH_DISABLED = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

