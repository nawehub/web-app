"use client"

import { useState, useCallback } from "react"
import { useGlobalSse } from "./use-sse"
import { useListTopContributorsQuery, useListDistrictRankingsQuery } from "@/hooks/repository/use-lyd"
import type { ContributorPayload, DistrictRankingPayload, TopContributorsPayload, DistrictRankingsPayload } from "@/app/lyd/types/sse"

interface StreamState {
  contributors: ContributorPayload[]
  rankings: DistrictRankingPayload[]
  isLive: boolean
  hasError: boolean
  lastUpdatedAt: number | null
}

/**
 * Hydrates from REST on mount, then switches to live SSE data as events arrive.
 * Components always read from one consistent shape regardless of data source.
 */
export function useContributionStream() {
  const { data: restContributors } = useListTopContributorsQuery()
  const { data: restRankings } = useListDistrictRankingsQuery()

  const [state, setState] = useState<StreamState>({
    contributors: [],
    rankings: [],
    isLive: false,
    hasError: false,
    lastUpdatedAt: null,
  })

  const onTopContributors = useCallback((payload: TopContributorsPayload) => {
    setState(prev => ({
      ...prev,
      contributors: payload.contributors,
      isLive: true,
      hasError: false,
      lastUpdatedAt: payload.occurredAt,
    }))
  }, [])

  const onDistrictRankings = useCallback((payload: DistrictRankingsPayload) => {
    setState(prev => ({
      ...prev,
      rankings: payload.rankings,
      isLive: true,
      hasError: false,
      lastUpdatedAt: payload.occurredAt,
    }))
  }, [])

  const onError = useCallback(() => {
    setState(prev => ({ ...prev, isLive: false, hasError: true }))
  }, [])

  useGlobalSse({ onTopContributors, onDistrictRankings, onError })

  // Normalise REST data into the same shape as SSE data so callers never branch
  const fallbackContributors: ContributorPayload[] = (restContributors ?? []).map((c: any) => ({
    contributorId: c.contributorId ?? c.id ?? String(Math.random()),
    firstName: c.firstName ?? "",
    lastName: c.lastName ?? "",
    nationality: c.nationality ?? "",
    anonymous: c.anonymous ?? false,
    totalContributions: {
      amount: typeof c.totalContributions === "number" ? c.totalContributions : 0,
      currency: c.currency ?? "SLE",
    },
    totalContributionsCount: c.totalContributionsCount ?? 0,
  }))

  const fallbackRankings: DistrictRankingPayload[] = (restRankings ?? []).map((r: any) => ({
    districtId: r.districtId ?? r.district ?? "",
    districtName: r.districtName ?? r.district ?? "",
    totalContributors: r.totalContributors ?? 0,
    totalContributions: {
      amount: typeof r.totalContributions === "number" ? r.totalContributions : 0,
      currency: "SLE",
    },
  }))

  return {
    contributors: state.contributors.length > 0 ? state.contributors : fallbackContributors,
    rankings: state.rankings.length > 0 ? state.rankings : fallbackRankings,
    isLive: state.isLive,
    hasError: state.hasError,
    lastUpdatedAt: state.lastUpdatedAt,
  }
}
