import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Update as needed to match your routes
const DASHBOARD_PREFIX = "/dashboard";
const PUBLIC_PATHS = [
    "/",                // landing
    "/login",
    "/register",
    "/verify-otp",
    "/pending-approval",
    "/forgot-password",
    "/reset-password",
    "/lyd",
    "/business-registration",
    "/contact",
    "/faq",
    "/privacy",
    "/services",
    "/lyd-projects",
    "/api"
];

function isPublicPath(pathname: string) {
    if (PUBLIC_PATHS.includes(pathname)) return true;
    // Allow Next internals and static assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/api/webhooks")
    ) {
        return true;
    }
    return false;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip public paths
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Read JWT (requires NEXTAUTH_SECRET set)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If not signed in, let other auth middleware/pages handle it, or redirect to login
    if (!token) {
        return NextResponse.next();
    }

    // Read top-level approved, or fall back to nested token.user.approved
    const approved =
        Boolean((token as any)?.approved) ||
        Boolean((token as any)?.user?.approved);

    // If user is NOT approved and trying to access any dashboard route, redirect to pending-approval
    if (!approved && pathname.startsWith(DASHBOARD_PREFIX)) {
        const url = req.nextUrl.clone();
        url.pathname = "/pending-approval";
        url.search = ""; // clear query params
        return NextResponse.redirect(url);
    }

    // If approved user tries to visit pending-approval, send them to dashboard
    if (approved && pathname === "/pending-approval") {
        const url = req.nextUrl.clone();
        url.pathname = DASHBOARD_PREFIX;
        url.search = "";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Run middleware on these routes (adjust as needed)
    matcher: ["/((?!api).*)"],
};