"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    FEATURED_SLOT_COUNT,
    addFeaturedId,
    pruneFeaturedIds,
    readFeaturedIds,
    removeFeaturedId,
    reorderFeaturedIds,
    toggleFeaturedId,
} from "@/lib/featured-entrepreneurs";

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

    const sync = useCallback(
        (ids: string[]) => {
            setFeaturedIds(ids);
            invalidatePublicList();
        },
        [invalidatePublicList]
    );

    const add = useCallback(
        (id: string) => {
            const next = addFeaturedId(id);
            if (!next) return { ok: false as const, reason: "max" as const, ids: readFeaturedIds() };
            sync(next);
            return { ok: true as const, ids: next };
        },
        [sync]
    );

    const remove = useCallback(
        (id: string) => {
            const next = removeFeaturedId(id);
            sync(next);
            return next;
        },
        [sync]
    );

    const toggle = useCallback(
        (id: string) => {
            const result = toggleFeaturedId(id);
            if (result.ok) sync(result.ids);
            return result;
        },
        [sync]
    );

    const reorder = useCallback(
        (fromIndex: number, toIndex: number) => {
            const next = reorderFeaturedIds(fromIndex, toIndex);
            sync(next);
        },
        [sync]
    );

    const pruneToApproved = useCallback(
        (approvedIds: string[]) => {
            const next = pruneFeaturedIds(new Set(approvedIds));
            sync(next);
            return next;
        },
        [sync]
    );

    const isFeatured = useCallback(
        (id: string) => featuredIds.includes(id),
        [featuredIds]
    );

    return {
        featuredIds,
        hydrated,
        slotCount: FEATURED_SLOT_COUNT,
        add,
        remove,
        toggle,
        reorder,
        pruneToApproved,
        isFeatured,
    };
}
