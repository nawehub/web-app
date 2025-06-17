import type {Metadata} from 'next'
import './globals.css'
import { Inter } from "next/font/google";
import React from "react";
import {Providers} from "@/lib/providers";

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
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
