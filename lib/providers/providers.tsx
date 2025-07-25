"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import QueryProvider from "@/lib/providers/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return <QueryProvider><SessionProvider>{children}</SessionProvider></QueryProvider>
}