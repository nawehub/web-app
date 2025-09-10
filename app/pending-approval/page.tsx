"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function PendingApprovalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const approved = Boolean((session?.user as any)?.approved);

    useEffect(() => {
        if (status === "loading") return;

        // If authenticated and approved, head to dashboard (middleware also enforces this)
        if (status === "authenticated" && approved) {
            return router.replace("/dashboard");
        }
    }, [status, approved, router]);

    if (status === "loading") return null;

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-4">
                <h1 className="text-xl font-semibold">Awaiting Approval</h1>
                <p className="text-muted-foreground">
                    Your account is pending admin approval. You’ll be notified once access is granted.
                </p>
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="px-4 py-2 rounded-md border text-sm"
                    >
                        Sign out
                    </button>
                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}