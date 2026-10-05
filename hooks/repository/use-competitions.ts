"use client";

import { useQuery } from "@tanstack/react-query";
import { competitionsService } from "@/lib/services/competitions";

export const RUNNING_STATES = ["PUBLISHED", "SHORTLISTING", "PITCH_VIDEO", "FINALS"];
export const PAST_STATES = ["COMPLETED", "CANCELLED"];

export function useCompetitionsQuery(states: string[], pageSize = 12) {
    return useQuery({
        queryKey: ["competitions", states, pageSize],
        queryFn: () => competitionsService().list(states, pageSize),
    });
}

export function useCompetitionQuery(id: string) {
    return useQuery({ queryKey: ["competition", id], queryFn: () => competitionsService().get(id), retry: false });
}

/** Only fetched once something has been announced (from the pitch video stage on). */
export function useCompetitionEntrantsQuery(id: string, enabled: boolean) {
    return useQuery({ queryKey: ["competition-entrants", id], queryFn: () => competitionsService().entrants(id), enabled });
}
