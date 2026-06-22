"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EntrepreneurProfile } from "@/app/dashboard/user-settings/_data/profile";
import {
    CheckStatus,
    VettingCase,
    VettingFilter,
    VettingStatus,
    VettingTrust,
} from "@/types/vetting-admin";
import {
    getAdminProfile,
    mergeVettingState,
    persistVettingState,
} from "./vetting";

export function useVettingState(featuredIds: string[] = []) {
    const [cases, setCases] = useState<VettingCase[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<VettingFilter>("all");
    const [profiles, setProfiles] = useState<Record<string, EntrepreneurProfile>>({});
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setCases(mergeVettingState());
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        persistVettingState(cases);
    }, [cases, hydrated]);

    useEffect(() => {
        let cancelled = false;
        async function loadProfiles() {
            const entries = await Promise.all(
                cases.map(async (c) => {
                    const profile = await getAdminProfile(c.id);
                    return [c.id, profile] as const;
                })
            );
            if (cancelled) return;
            const next: Record<string, EntrepreneurProfile> = {};
            entries.forEach(([id, profile]) => {
                if (profile) next[id] = profile;
            });
            setProfiles(next);
        }
        if (cases.length) loadProfiles();
        return () => {
            cancelled = true;
        };
    }, [cases]);

    const filteredCases = useMemo(() => {
        if (filter === "all") return cases;
        if (filter === "featured") {
            return cases.filter((c) => featuredIds.includes(c.id));
        }
        return cases.filter((c) => c.status === filter);
    }, [cases, filter, featuredIds]);

    const selectedCase = useMemo(
        () => cases.find((c) => c.id === selectedId) ?? null,
        [cases, selectedId]
    );

    const selectedProfile = selectedId ? profiles[selectedId] ?? null : null;

    const updateCase = useCallback((id: string, patch: Partial<VettingCase>) => {
        setCases((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
        );
    }, []);

    const updateTrust = useCallback((id: string, key: keyof VettingTrust, value: number) => {
        setCases((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, trust: { ...c.trust, [key]: value } } : c
            )
        );
    }, []);

    const updateCheck = useCallback(
        (id: string, key: keyof VettingCase["checks"], status: CheckStatus) => {
            setCases((prev) =>
                prev.map((c) => {
                    if (c.id !== id) return c;
                    const current = c.checks[key];
                    return {
                        ...c,
                        checks: {
                            ...c.checks,
                            [key]: current === status ? "pending" : status,
                        },
                    };
                })
            );
        },
        []
    );

    const updateVenRating = useCallback((id: string, ventureId: string, rating: string) => {
        setCases((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, venRatings: { ...c.venRatings, [ventureId]: rating } }
                    : c
            )
        );
    }, []);

    const decide = useCallback(
        (id: string, status: VettingStatus, notes: string, reviewer: string) => {
            setCases((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, status, notes, reviewer } : c
                )
            );
        },
        []
    );

    return {
        cases,
        filteredCases,
        selectedId,
        selectedCase,
        selectedProfile,
        profiles,
        filter,
        hydrated,
        setFilter,
        setSelectedId,
        updateCase,
        updateTrust,
        updateCheck,
        updateVenRating,
        decide,
    };
}
