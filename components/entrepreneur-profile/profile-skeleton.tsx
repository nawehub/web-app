import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shell shown while the profile data loads. Mirrors the real layout
 * (header card + sections column + sidebar) so the page doesn't jump
 * once `useProfile` resolves.
 */
export function ProfileSkeleton() {
    return (
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_332px]">
            {/* Main column */}
            <div className="order-2 flex flex-col gap-4 lg:order-1">
                {/* Header card */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Skeleton className="h-28 w-full rounded-none" />
                    <div className="px-6 pb-6">
                        <Skeleton className="-mt-[52px] h-28 w-28 rounded-full border-4 border-card" />
                        <Skeleton className="mt-4 h-7 w-52" />
                        <Skeleton className="mt-2 h-4 w-full max-w-[480px]" />
                        <div className="mt-4 flex gap-2">
                            <Skeleton className="h-7 w-28 rounded-full" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Section cards */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-7 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-11/12" />
                        <Skeleton className="mt-2 h-4 w-4/5" />
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="order-1 flex flex-col gap-4 lg:order-2">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="mt-3 h-2.5 w-full rounded-full" />
                    <div className="mt-4 space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <Skeleton className="h-5 w-40" />
                    <div className="mt-4 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
