"use client";

import { useCallback, useEffect, useState } from "react";
import {
    loadOpportunities,
    resetOpportunities,
    saveOpportunities,
    seedOpportunities,
} from "@/lib/opportunities-store";
import { Opportunity, OpportunityType } from "@/types/opportunities";

export type OpportunityAdminFilter =
    | "all"
    | "pending"
    | OpportunityType
    | "featured"
    | "closed";

export const OPPORTUNITY_ADMIN_FILTERS: { key: OpportunityAdminFilter; label: string }[] =
    [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "grant", label: "Grants" },
        { key: "competition", label: "Competitions" },
        { key: "event", label: "Events" },
        { key: "accelerator", label: "Accelerators" },
        { key: "fellowship", label: "Fellowships" },
        { key: "featured", label: "Featured" },
        { key: "closed", label: "Closed" },
    ];

/**
 * Stateful store for the admin Opportunities Manager. Hydrates from
 * localStorage (falling back to the seed), and persists every change so the
 * public Opportunities page reflects staff edits.
 */
export function useOpportunitiesAdmin() {
    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setOpps(loadOpportunities());
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        saveOpportunities(opps);
    }, [opps, hydrated]);

    const create = useCallback((opp: Opportunity) => {
        setOpps((prev) => [opp, ...prev]);
    }, []);

    const update = useCallback((opp: Opportunity) => {
        setOpps((prev) => prev.map((x) => (x.id === opp.id ? opp : x)));
    }, []);

    const remove = useCallback((id: string) => {
        setOpps((prev) => prev.filter((x) => x.id !== id));
    }, []);

    /** Toggle featured. Returns the resulting featured state, or null if blocked. */
    const toggleFeatured = useCallback((id: string): boolean | null => {
        let result: boolean | null = null;
        setOpps((prev) =>
            prev.map((x) => {
                if (x.id !== id) return x;
                // A closed listing can't be featured.
                if (!x.open && !x.featured) {
                    result = null;
                    return x;
                }
                result = !x.featured;
                return { ...x, featured: !x.featured };
            })
        );
        return result;
    }, []);

    /** Approve a pending submission so it goes live on the public page. */
    const approve = useCallback((id: string) => {
        setOpps((prev) =>
            prev.map((x) => (x.id === id ? { ...x, status: "approved" } : x))
        );
    }, []);

    /** Reject a submission (kept for the record, hidden from the public page). */
    const reject = useCallback((id: string) => {
        setOpps((prev) =>
            prev.map((x) =>
                x.id === id ? { ...x, status: "rejected", featured: false } : x
            )
        );
    }, []);

    const reset = useCallback(() => {
        resetOpportunities();
        setOpps(seedOpportunities());
    }, []);

    return {
        opps,
        hydrated,
        create,
        update,
        remove,
        toggleFeatured,
        approve,
        reject,
        reset,
    };
}
