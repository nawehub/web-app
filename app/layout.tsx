import type {Metadata} from 'next'
import './globals.css'
import {Fraunces, Inter, JetBrains_Mono} from "next/font/google";
import React from "react";
import {Providers} from "@/lib/providers/providers";
import {AuthProvider} from "@/hooks/context/AuthContext";
import {AuthErrorBoundary} from "@/components/AuthErrorBoundary";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";

export const metadata: Metadata = {
    title: {
        default: 'NaWeHub — Sierra Leone\u2019s Entrepreneurship Platform',
        template: '%s · NaWeHub',
    },
    description:
        'Connecting entrepreneurs, investors, and government partners across Sierra Leone — backing 1,000+ businesses across all 16 districts.',

}

const fraunces = Fraunces({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-display',
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
})

const mono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-mono',
})

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true} className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
            <body className={`bg-background text-foreground [font-family:var(--font-body)] antialiased`}>
            <ThemeProvider attribute="class" enableSystem>
                <TooltipProvider>
                    <AuthProvider>
                        <Providers>
                            <AuthErrorBoundary>
                                {children}
                            </AuthErrorBoundary>
                        </Providers>
                    </AuthProvider>
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
            </body>
        </html>
    )
}
