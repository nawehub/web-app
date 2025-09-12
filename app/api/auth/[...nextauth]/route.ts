import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {refreshAccessToken} from "@/lib/auth";
import {UserRole} from "@/types/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const data = await res.json();

                    if (res.ok && data?.accessToken) {
                        return {
                            id: data.user.id as string,
                            email: data.user.email as string,
                            name: `${data.user.firstName} ${data.user.lastName}`,
                            firstName: data.user.firstName as string,
                            lastName: data.user.lastName as string,
                            phone: data.user.phone as string,
                            gender: data.user.gender as string,
                            status: data.user.status as string,
                            approved: data.user.approved, // important
                            role: data.user.role as UserRole,
                            accessToken: data.accessToken as string,
                            refreshToken: data.refreshToken as string,
                            expiresIn: data.expiresIn as number,
                        };
                    }

                    return null;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        newUser: "/register",
        error: '/auth/error'
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            return account?.provider === "credentials";
        },
        jwt: async function ({token, user}) {
            // On initial sign-in, mirror user + approved to top-level token
            if (user) {
                return {
                    ...token,
                    accessToken: (user as any).accessToken,
                    refreshToken: (user as any).refreshToken,
                    expiresIn: (user as any).expiresIn,
                    user: user as any,
                    approved: Boolean((user as any).approved), // add top-level approved
                };
            }

            // If the access token hasn't expired, keep the token as-is
            if (Date.now() < (token.expiresIn as number)) {
                return token;
            }

            // Access token expired, try to refresh it and preserve approved + user
            const refreshed = await refreshAccessToken(token);
            return {
                ...refreshed,
                approved: (token as any).approved,
                user: (token as any).user,
            };
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.expiresIn = token.expiresIn as number;
            session.user = token.user as any;
            // ensure session.user.approved matches token.approved
            if (session.user) {
                (session.user as any).approved = Boolean((token as any).approved ?? (session.user as any).approved);
            }
            session.error = (token as any).error;
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };