"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/feature-flags";
import { isAdmin } from "@/hooks/use-permissions";
import { useFeaturedEntrepreneursAdmin } from "@/hooks/repository/use-featured-entrepreneurs";
import { VettingStatus } from "@/types/vetting-admin";
import { useVettingState } from "./_data/use-vetting-state";
import { VettingQueue } from "./_components/vetting-queue";
import { VettingStats } from "./_components/vetting-stats";
import { VettingWorkspace } from "./_components/vetting-workspace";
import {
    AUTO_FEATURE_SCORE_THRESHOLD,
    trustOverall,
} from "./_data/vetting";

export default function VettingDashboardPage() {
    const { data: session, status } = useSession();
    const disableAuth = AUTH_DISABLED;
    const user =
        session?.user ??
        (disableAuth ? ({ role: { name: "admin", permissions: ["full:access"] } } as const) : undefined);

    useEffect(() => {
        if (!disableAuth && status === "authenticated" && !isAdmin(user)) {
            redirect("/dashboard");
        }
    }, [disableAuth, status, user]);

    if (!disableAuth && status === "loading") {
        return (
            <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
            </div>
        );
    }

    if (!disableAuth && !isAdmin(user)) {
        return null;
    }

    const reviewer =
        session?.user ??
        (disableAuth ? ({ firstName: "A.", lastName: "Kissimi" } as const) : undefined);
    const reviewerName = reviewer
        ? `${reviewer.firstName} ${reviewer.lastName}`
        : "Vetting Officer";

    const {
        featuredIds,
        hydrated: featuredHydrated,
        syncAutoFeaturedFromCases,
        isFeatured,
    } = useFeaturedEntrepreneursAdmin();

    const {
        cases,
        filteredCases,
        selectedId,
        selectedCase,
        selectedProfile,
        profiles,
        filter,
        hydrated: vettingHydrated,
        setFilter,
        setSelectedId,
        updateCase,
        updateTrust,
        updateCheck,
        updateVenRating,
        decide,
    } = useVettingState(featuredIds);

    useEffect(() => {
        if (!vettingHydrated || !featuredHydrated) return;
        syncAutoFeaturedFromCases(cases);
    }, [cases, vettingHydrated, featuredHydrated, syncAutoFeaturedFromCases]);

    const handleDecide = (status: VettingStatus) => {
        if (!selectedCase) return;
        decide(selectedCase.id, status, selectedCase.notes, reviewerName);

        const score = trustOverall(selectedCase.trust);
        const message =
            status === "approved"
                ? score >= AUTO_FEATURE_SCORE_THRESHOLD
                    ? "Approved — profile is live and auto-featured on the landing page (85%+)"
                    : "Approved — profile is now live & vetted"
                : status === "changes"
                  ? "Changes requested — entrepreneur notified"
                  : "Case rejected";
        toast.success(message);
    };

    const hydrated = vettingHydrated && featuredHydrated;

    if (!hydrated) {
        return (
            <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1440px] px-4 py-5 lg:px-6 lg:py-6">
            <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-[28px]">
                    Vetting Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Review, verify and score entrepreneur profiles before they go live to investors.
                </p>
            </div>

            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                Entrepreneurs with a trust score of{" "}
                <strong className="font-semibold text-foreground">
                    {AUTO_FEATURE_SCORE_THRESHOLD}% or above
                </strong>{" "}
                are automatically approved, vetted, and featured on the public landing page. No
                manual featuring is required.
            </div>

            <div className="mt-5">
                <VettingStats cases={cases} featuredCount={featuredIds.length} />
            </div>

            <div
                className={cn(
                    "mt-5 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]",
                    selectedId && "max-lg:grid-cols-1",
                )}
            >
                <div className={cn(selectedId && "max-lg:hidden")}>
                    <VettingQueue
                        cases={filteredCases}
                        profiles={profiles}
                        selectedId={selectedId}
                        filter={filter}
                        featuredIds={featuredIds}
                        onFilterChange={setFilter}
                        onSelect={setSelectedId}
                    />
                </div>

                <div className={cn(!selectedId && "max-lg:hidden")}>
                    <VettingWorkspace
                        vettingCase={selectedCase}
                        profile={selectedProfile}
                        reviewerName={reviewerName}
                        isFeatured={selectedCase ? isFeatured(selectedCase.id) : false}
                        onBack={() => setSelectedId(null)}
                        onTrustChange={(key, value) => {
                            if (!selectedCase) return;
                            updateTrust(selectedCase.id, key, value);
                        }}
                        onCheckToggle={(key, status) => {
                            if (!selectedCase) return;
                            updateCheck(selectedCase.id, key, status);
                        }}
                        onEntRatingChange={(rating) => {
                            if (!selectedCase) return;
                            updateCase(selectedCase.id, { entRating: rating });
                        }}
                        onVenRatingChange={(ventureId, rating) => {
                            if (!selectedCase) return;
                            updateVenRating(selectedCase.id, ventureId, rating);
                        }}
                        onNotesChange={(notes) => {
                            if (!selectedCase) return;
                            updateCase(selectedCase.id, { notes });
                        }}
                        onDecide={handleDecide}
                    />
                </div>
            </div>
        </div>
    );
}
