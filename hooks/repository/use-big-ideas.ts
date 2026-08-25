"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BigIdeasFilters, bigIdeasService, GatewayIdea, toNextBigIdea } from "@/lib/services/big-ideas";
import type { NextBigIdea } from "@/types/next-big-idea";

const PAGE_SIZE = 9;

export function useBigIdeasQuery(filters: BigIdeasFilters) {
    const [items, setItems] = useState<NextBigIdea[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isError, setIsError] = useState(false);

    const filterKey = JSON.stringify(filters);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsError(false);
        bigIdeasService()
            .list(filters, PAGE_SIZE)
            .then((page) => {
                if (cancelled) return;
                setItems(page.items.map(toNextBigIdea));
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
            const page = await bigIdeasService().list(filters, PAGE_SIZE, nextPageToken);
            setItems((prev) => [...prev, ...page.items.map(toNextBigIdea)]);
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

export function useBigIdeaQuery(id: string | undefined) {
    return useQuery<GatewayIdea>({
        queryKey: ["big-idea", id],
        queryFn: () => bigIdeasService().getOne(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}
