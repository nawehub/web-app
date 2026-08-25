"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { entrepreneursService, toVettedEntrepreneur } from "@/lib/services/entrepreneurs";
import type { VettedEntrepreneur, VettedEntrepreneursFilters } from "@/types/entrepreneurs";

const CAPPED_SIZE = 8;
const ALL_PAGE_SIZE = 12;

function toListFilters(filters: VettedEntrepreneursFilters) {
    return {
        query: filters.query,
        district: filters.district,
        skills: filters.skill ? [filters.skill] : undefined,
        gender: filters.gender,
        nationality: filters.nationality,
    };
}

/** Featured Vetted Entrepreneurs section on the main page — capped, no pagination. */
export function useFeaturedEntrepreneursQuery(filters: VettedEntrepreneursFilters = {}) {
    return useQuery<VettedEntrepreneur[]>({
        queryKey: ["entrepreneurs-featured", filters],
        queryFn: async () => {
            const page = await entrepreneursService().entrepreneurs.list(
                { ...toListFilters(filters), featured: true },
                CAPPED_SIZE,
            );
            return page.items.map(toVettedEntrepreneur);
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

/** "All Vetted Entrepreneurs" preview section on the main page — capped, no pagination. */
export function useVettedEntrepreneursPreviewQuery(filters: VettedEntrepreneursFilters = {}) {
    return useQuery<VettedEntrepreneur[]>({
        queryKey: ["entrepreneurs-vetted-preview", filters],
        queryFn: async () => {
            const page = await entrepreneursService().entrepreneurs.list(
                { ...toListFilters(filters), featured: false },
                CAPPED_SIZE,
            );
            return page.items.map(toVettedEntrepreneur);
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

/** Full directory — /web/vetted-entrepreneurs/all, real cursor "Load More" pagination. */
export function useAllEntrepreneursQuery(filters: VettedEntrepreneursFilters) {
    const [items, setItems] = useState<VettedEntrepreneur[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isError, setIsError] = useState(false);

    const filterKey = JSON.stringify(filters);
    const listFilters = toListFilters(filters);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsError(false);
        entrepreneursService()
            .entrepreneurs.list(listFilters, ALL_PAGE_SIZE)
            .then((page) => {
                if (cancelled) return;
                setItems(page.items.map(toVettedEntrepreneur));
                setNextPageToken(page.hasNextPage ? page.nextPageToken : undefined);
                setHasNextPage(page.hasNextPage);
            })
            .catch(() => !cancelled && setIsError(true))
            .finally(() => !cancelled && setIsLoading(false));
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKey]);

    const loadMore = useCallback(async () => {
        if (!nextPageToken || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const page = await entrepreneursService().entrepreneurs.list(listFilters, ALL_PAGE_SIZE, nextPageToken);
            setItems((prev) => [...prev, ...page.items.map(toVettedEntrepreneur)]);
            setNextPageToken(page.hasNextPage ? page.nextPageToken : undefined);
            setHasNextPage(page.hasNextPage);
        } catch {
            setIsError(true);
        } finally {
            setIsLoadingMore(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKey, nextPageToken, isLoadingMore]);

    return { items, isLoading, isLoadingMore, isError, hasNextPage, loadMore };
}

export function usePublicProfileQuery(id: string | undefined) {
    return useQuery({
        queryKey: ["public-profile", id],
        queryFn: () => entrepreneursService().entrepreneurs.getPublicProfile(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });
}
