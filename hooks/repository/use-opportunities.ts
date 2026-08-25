"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    GatewayOpportunity,
    OpportunitiesFilters,
    opportunitiesService,
    toCategoryTiles,
    toEventItem,
    toOpportunity,
} from "@/lib/services/opportunities";
import type { EventItem, Opportunity } from "@/types/opportunities";

const PAGE_SIZE = 8;

export function useOpportunitiesQuery(filters: OpportunitiesFilters, ascending = false) {
    const [items, setItems] = useState<Opportunity[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isError, setIsError] = useState(false);

    const filterKey = JSON.stringify(filters) + ascending;

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsError(false);
        opportunitiesService()
            .list(filters, PAGE_SIZE, undefined, ascending)
            .then((page) => {
                if (cancelled) return;
                setItems(page.items.map(toOpportunity));
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
            const page = await opportunitiesService().list(filters, PAGE_SIZE, nextPageToken, ascending);
            setItems((prev) => [...prev, ...page.items.map(toOpportunity)]);
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

export function useOpportunityQuery(id: string | undefined) {
    return useQuery<GatewayOpportunity>({
        queryKey: ["opportunity", id],
        queryFn: () => opportunitiesService().getOne(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useOpportunityCategoriesQuery() {
    return useQuery({
        queryKey: ["opportunity-categories"],
        queryFn: async () => toCategoryTiles(await opportunitiesService().getCategoryAnalysis()),
        staleTime: 1000 * 60 * 10,
    });
}

export function useUpcomingEventsQuery(pageSize = 10) {
    return useQuery<EventItem[]>({
        queryKey: ["opportunity-events", pageSize],
        queryFn: async () => (await opportunitiesService().getUpcomingEvents(pageSize)).map(toEventItem),
        staleTime: 1000 * 60 * 5,
    });
}
