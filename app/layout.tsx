import type {Metadata} from 'next'
import './globals.css'
import {Plus_Jakarta_Sans, Source_Sans_3} from "next/font/google";
import React from "react";
import {Providers} from "@/lib/providers/providers";
import {AuthProvider} from "@/hooks/context/AuthContext";
import {AuthErrorBoundary} from "@/components/AuthErrorBoundary";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

const sourceSans = Source_Sans_3({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

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
        <html lang="en" suppressHydrationWarning={true}>
            <body className={`${plusJakarta.variable} ${sourceSans.variable} font-body antialiased`}>
            <ThemeProvider attribute="class" enableSystem>
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
