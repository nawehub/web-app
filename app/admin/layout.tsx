"use client";

import { ReactNode } from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import Header from "@/components/public/header";
import { isAdmin } from "@/hooks/use-permissions";
import { AUTH_DISABLED } from "@/lib/feature-flags";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const disableAuth = AUTH_DISABLED;
    const { data: session, status } = useSession(
        disableAuth
            ? undefined
            : {
                  required: true,
                  onUnauthenticated() {
                      redirect("/login");
                  },
              }
    );

    const user =
        session?.user ??
        (disableAuth
            ? ({ role: { name: "admin", permissions: ["full:access"] } } as const)
            : undefined);

    useEffect(() => {
        if (!disableAuth && status === "authenticated" && !isAdmin(user)) {
            redirect("/dashboard");
        }
    }, [disableAuth, status, user]);

    if (!disableAuth && status === "loading") {
        return <Loading />;
    }

    if (!disableAuth && !isAdmin(user)) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <Header />
            <main className="overflow-x-hidden">{children}</main>
        </div>
    );
}
