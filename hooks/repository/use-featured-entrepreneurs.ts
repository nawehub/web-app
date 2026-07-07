"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { computeAutoFeaturedIds } from "@/app/dashboard/vetting/_data/vetting";
import { VettingCase } from "@/types/vetting-admin";
import { readFeaturedIds, syncAutoFeaturedIds } from "@/lib/featured-entrepreneurs";

export function useFeaturedEntrepreneursAdmin() {
    const queryClient = useQueryClient();
    const [featuredIds, setFeaturedIds] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setFeaturedIds(readFeaturedIds());
        setHydrated(true);
    }, []);

    const invalidatePublicList = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["vetted-entrepreneurs"] });
    }, [queryClient]);

    const syncAutoFeaturedFromCases = useCallback(
        (cases: VettingCase[]) => {
            const next = syncAutoFeaturedIds(computeAutoFeaturedIds(cases));
            setFeaturedIds(next);
            invalidatePublicList();
            return next;
        },
        [invalidatePublicList],
    );

    const isFeatured = useCallback(
        (id: string) => featuredIds.includes(id),
        [featuredIds],
    );

    return {
        featuredIds,
        hydrated,
        syncAutoFeaturedFromCases,
        isFeatured,
    };
}
