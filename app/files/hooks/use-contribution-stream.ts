"use client";

import { useState, useCallback } from "react";
import { useGlobalSse } from "@/hooks/use-sse";
import {
  useListTopContributorsQuery,
  useListDistrictRankingsQuery,
} from "@/hooks/repository/use-lyd";
import type {
  TopContributorsPayload,
  DistrictRankingsPayload,
  ContributorPayload,
  DistrictRankingPayload,
} from "@/types/sse";

// Adapts REST query response shapes into the SSE payload shape
// so both data sources flow through the same state

interface ContributionStreamState {
  contributors: ContributorPayload[];
  rankings: DistrictRankingPayload[];
  isLive: boolean;
  lastUpdated: number | null;
  sseError: boolean;
}

export function useContributionStream() {
  const { data: restContributors } = useListTopContributorsQuery();
  const { data: restRankings } = useListDistrictRankingsQuery();

  const [state, setState] = useState<ContributionStreamState>({
    contributors: [],
    rankings: [],
    isLive: false,
    lastUpdated: null,
    sseError: false,
  });

  const onTopContributors = useCallback((payload: TopContributorsPayload) => {
    setState((prev) => ({
      ...prev,
      contributors: payload.contributors,
      isLive: true,
      sseError: false,
      lastUpdated: payload.occurredAt,
    }));
  }, []);

  const onDistrictRankings = useCallback((payload: DistrictRankingsPayload) => {
    setState((prev) => ({
      ...prev,
      rankings: payload.rankings,
      isLive: true,
      sseError: false,
      lastUpdated: payload.occurredAt,
    }));
  }, []);

  const onError = useCallback(() => {
    setState((prev) => ({ ...prev, isLive: false, sseError: true }));
  }, []);

  useGlobalSse({ onTopContributors, onDistrictRankings, onError });

  // Prefer live SSE data; fall back to REST query data while SSE hasn't fired yet
  const contributors: ContributorPayload[] =
    state.contributors.length > 0
      ? state.contributors
      : (restContributors ?? []).map((c: any) => ({
          contributorId: c.contributorId ?? c.id ?? "",
          firstName: c.firstName ?? "",
          lastName: c.lastName ?? "",
          nationality: c.nationality ?? "",
          anonymous: c.anonymous ?? false,
          totalContributions: {
            amount: c.totalContributions ?? 0,
            currency: c.currency ?? "SLE",
          },
          totalContributionsCount: c.totalContributionsCount ?? 0,
        }));

  const rankings: DistrictRankingPayload[] =
    state.rankings.length > 0
      ? state.rankings
      : (restRankings ?? []).map((r: any) => ({
          districtId: r.districtId ?? r.district ?? "",
          districtName: r.district ?? r.districtName ?? "",
          totalContributors: r.totalContributors ?? 0,
          totalContributions: {
            amount: r.totalContributions ?? 0,
            currency: "SLE",
          },
        }));

  return {
    contributors,
    rankings,
    isLive: state.isLive,
    sseError: state.sseError,
    lastUpdated: state.lastUpdated,
  };
}
