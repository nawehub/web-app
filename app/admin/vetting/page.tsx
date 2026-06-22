"use client";

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/feature-flags";
import { useFeaturedEntrepreneursAdmin } from "@/hooks/repository/use-featured-entrepreneurs";
import { FEATURED_SLOT_COUNT } from "@/lib/featured-entrepreneurs";
import { VettingStatus } from "@/types/vetting-admin";
import { useVettingState } from "./_data/use-vetting-state";
import { FeaturedLandingBar } from "./_components/featured-landing-bar";
import { VettingQueue } from "./_components/vetting-queue";
import { VettingStats } from "./_components/vetting-stats";
import { VettingWorkspace } from "./_components/vetting-workspace";

export default function VettingAdminPage() {
    const { data: session } = useSession();
    const disableAuth = AUTH_DISABLED;
    const reviewer =
        session?.user ??
        (disableAuth ? ({ firstName: "A.", lastName: "Kissimi" } as const) : undefined);
    const reviewerName = reviewer
        ? `${reviewer.firstName} ${reviewer.lastName}`
        : "Vetting Officer";

    const {
        featuredIds,
        hydrated: featuredHydrated,
        remove,
        add,
        toggle,
        reorder,
        pruneToApproved,
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
        const approvedIds = cases
            .filter((c) => c.status === "approved")
            .map((c) => c.id);
        pruneToApproved(approvedIds);
    }, [cases, vettingHydrated, featuredHydrated, pruneToApproved]);

    const availableFeaturedCandidates = useMemo(
        () => {
            const featuredSet = new Set(featuredIds);
            return cases
                .filter((c) => c.status === "approved" && !featuredSet.has(c.id))
                .map((c) => ({
                    id: c.id,
                    name: profiles[c.id]?.name ?? c.id,
                    venture: profiles[c.id]?.ventures?.[0]?.name,
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        [cases, profiles, featuredIds]
    );

    const handleAddFeatured = (id: string) => {
        const result = add(id);
        if (!result.ok && result.reason === "max") {
            toast.error(`Maximum ${FEATURED_SLOT_COUNT} featured — remove one first.`);
            return;
        }
        if (result.ok) {
            const name = profiles[id]?.name ?? id;
            toast.success(`${name} added to landing page featured slots`);
        }
    };

    const handleDecide = (status: VettingStatus) => {
        if (!selectedCase) return;
        decide(selectedCase.id, status, selectedCase.notes, reviewerName);
        if (status === "rejected" || status === "changes") {
            remove(selectedCase.id);
        }
        const message =
            status === "approved"
                ? "Approved — profile is now live & vetted"
                : status === "changes"
                  ? "Changes requested — entrepreneur notified"
                  : "Case rejected";
        toast.success(message);
    };

    const handleToggleFeature = () => {
        if (!selectedCase || selectedCase.status !== "approved") return;
        const wasFeatured = isFeatured(selectedCase.id);
        const result = toggle(selectedCase.id);
        if (!result.ok && result.reason === "max") {
            toast.error(`Maximum ${FEATURED_SLOT_COUNT} featured — remove one first.`);
            return;
        }
        if (result.ok) {
            toast.success(
                wasFeatured
                    ? "Removed from landing page featured slots"
                    : "Added to landing page featured slots"
            );
        }
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

            <div className="mt-5">
                <VettingStats cases={cases} featuredCount={featuredIds.length} />
            </div>

            <div className="mt-5">
                <FeaturedLandingBar
                    featuredIds={featuredIds}
                    profiles={profiles}
                    availableCandidates={availableFeaturedCandidates}
                    onAdd={handleAddFeatured}
                    onRemove={remove}
                    onReorder={reorder}
                />
            </div>

            <div
                className={cn(
                    "mt-5 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]",
                    selectedId && "max-lg:grid-cols-1"
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
                        onToggleFeature={handleToggleFeature}
                    />
                </div>
            </div>
        </div>
    );
}
