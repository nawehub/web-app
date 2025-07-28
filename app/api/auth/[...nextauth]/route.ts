import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import GithubProvider from "next-auth/providers/github";
import {refreshAccessToken} from "@/lib/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
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
                    console.log({data})

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
                            roles: data.user.roles as [],
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
            if (account?.provider === "google") {
                return true;
            }
            return true;
        },
        jwt: async function ({token, user}) {
            if (user) {
                token.accessToken = `Bearer ${user.accessToken}`
                token.refreshToken = user.refreshToken
                token.expiresIn = Date.now() + user.expiresIn * 1000;
                token.user = user
            }

            // Return the previous token if the access token has not expired
            if (token.expiresIn && Date.now() < token.expiresIn) {
                return token;
            }

            // Access token expired, try to refresh it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken
            session.expiresIn = token.expiresIn
            session.user = token.user
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
