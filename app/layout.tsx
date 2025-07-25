import type {Metadata} from 'next'
import './globals.css'
import { Inter } from "next/font/google";
import React from "react";
import { Providers } from "@/lib/providers/providers";
import { AuthProvider } from "@/hooks/context/AuthContext";
import {AuthErrorBoundary} from "@/components/AuthErrorBoundary";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'NaWeHub',
    description: 'Salone Success'
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
                <Providers>
                    <AuthErrorBoundary>
                        {children}
                    </AuthErrorBoundary>
                </Providers>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
        </body>
        </html>
    )
}
