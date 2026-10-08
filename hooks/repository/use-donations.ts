"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { donationsService } from "@/lib/services/donations";
import type { Donation } from "@/types/donation";

export function useFundSummaryQuery(recent = 8) {
    return useQuery({
        queryKey: ["fund-summary", recent],
        queryFn: () => donationsService().summary(recent),
        refetchInterval: 30_000,
        staleTime: 15_000,
    });
}

/**
 * Follows one donation live: server-sent events while the stream is up, polling every few seconds
 * if it drops (some networks block streaming). Stops once the donation has ended.
 */
export function useDonationWatch(id: string | null, initial?: Donation | null) {
    const [donation, setDonation] = useState<Donation | null>(initial ?? null);
    const [notFound, setNotFound] = useState(false);
    const done = useRef(false);

    useEffect(() => {
        if (!id) return;
        done.current = false;
        setNotFound(false);
        let source: EventSource | null = null;
        let poll: ReturnType<typeof setInterval> | null = null;

        const apply = (d: Donation) => {
            setDonation(d);
            if (d.status !== "PENDING") {
                done.current = true;
                source?.close();
                if (poll) clearInterval(poll);
            }
        };
        const startPolling = () => {
            if (poll || done.current) return;
            const tick = () => donationsService().get(id).then(apply).catch(() => undefined);
            tick();
            poll = setInterval(tick, 4_000);
        };

        if (typeof EventSource !== "undefined") {
            source = new EventSource(`/api/donations/${encodeURIComponent(id)}/events`);
            source.addEventListener("donation", (e) => {
                try {
                    apply(JSON.parse((e as MessageEvent).data));
                } catch {
                    /* ignore a malformed event */
                }
            });
            source.addEventListener("not-found", () => {
                setNotFound(true);
                done.current = true;
                source?.close();
            });
            source.onerror = () => {
                source?.close();
                startPolling();
            };
        } else {
            startPolling();
        }
        return () => {
            source?.close();
            if (poll) clearInterval(poll);
        };
    }, [id]);

    return { donation, notFound };
}
