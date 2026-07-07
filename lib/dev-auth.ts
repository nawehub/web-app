import { AUTH_DISABLED } from "@/lib/feature-flags";

/** Fixed secret for local-only mock sessions — never use in production. */
export const DEV_AUTH_SECRET = "local-dev-only-nawehub-secret";

export function getAuthSecret(): string | undefined {
    if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
    if (AUTH_DISABLED) return DEV_AUTH_SECRET;
    return undefined;
}

/** Mock admin session when NEXT_PUBLIC_DISABLE_AUTH=true (no live API needed). */
export function createDevAuthUser(email?: string | null) {
    const loginEmail = email?.trim() || "dev@localhost";

    return {
        id: "local-dev-admin",
        email: loginEmail,
        name: "Local Dev Admin",
        firstName: "Local",
        lastName: "Admin",
        phone: "",
        gender: "",
        status: "active",
        approved: true,
        role: { name: "admin", permissions: ["full:access"] },
        devPartnerId: "",
        devPartnerName: "",
        accessToken: "dev-access-token",
        refreshToken: "dev-refresh-token",
        expiresIn: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
}
