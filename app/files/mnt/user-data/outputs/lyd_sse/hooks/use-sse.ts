"use client"

import { useEffect, useRef, useCallback } from "react"
import type {
  TopContributorsPayload,
  DistrictRankingsPayload,
  PaymentAttachedPayload,
  PaymentTerminalPayload,
} from "@/app/lyd/types/sse"

const API = process.env.NEXT_PUBLIC_API_URL ?? ""

// ─── Global leaderboard stream ────────────────────────────────────────────────

interface UseGlobalSseOptions {
  onTopContributors?: (data: TopContributorsPayload) => void
  onDistrictRankings?: (data: DistrictRankingsPayload) => void
  onError?: () => void
  enabled?: boolean
}

export function useGlobalSse({
  onTopContributors,
  onDistrictRankings,
  onError,
  enabled = true,
}: UseGlobalSseOptions) {
  const esRef = useRef<EventSource | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attemptsRef = useRef(0)
  const MAX = 5

  // Stable refs so connect() closure doesn't go stale
  const topRef = useRef(onTopContributors)
  const rankRef = useRef(onDistrictRankings)
  const errRef = useRef(onError)
  useEffect(() => { topRef.current = onTopContributors }, [onTopContributors])
  useEffect(() => { rankRef.current = onDistrictRankings }, [onDistrictRankings])
  useEffect(() => { errRef.current = onError }, [onError])

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return

    esRef.current?.close()

    const es = new EventSource(`${API}/api/v1/contributions/stream`, { withCredentials: true })
    esRef.current = es

    es.addEventListener("TOP_CONTRIBUTORS", (e: MessageEvent) => {
      try {
        attemptsRef.current = 0
        topRef.current?.(JSON.parse(e.data))
      } catch { console.error("[SSE] TOP_CONTRIBUTORS parse error") }
    })

    es.addEventListener("DISTRICT_RANKINGS", (e: MessageEvent) => {
      try {
        attemptsRef.current = 0
        rankRef.current?.(JSON.parse(e.data))
      } catch { console.error("[SSE] DISTRICT_RANKINGS parse error") }
    })

    es.onerror = () => {
      errRef.current?.()
      es.close()
      if (attemptsRef.current < MAX) {
        const delay = 3_000 * 2 ** attemptsRef.current++
        timerRef.current = setTimeout(connect, delay)
      }
    }
  }, [enabled]) // only enabled is a real dep

  useEffect(() => {
    connect()
    return () => {
      esRef.current?.close()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [connect])
}

// ─── Per-contribution payment stream ─────────────────────────────────────────

interface UsePaymentSseOptions {
  contributionId: string | null
  onAttached?: (data: PaymentAttachedPayload) => void
  onTerminal?: (data: PaymentTerminalPayload) => void
  onError?: () => void
}

export function usePaymentSse({
  contributionId,
  onAttached,
  onTerminal,
  onError,
}: UsePaymentSseOptions) {
  // Stable refs
  const attachedRef = useRef(onAttached)
  const terminalRef = useRef(onTerminal)
  const errRef = useRef(onError)
  useEffect(() => { attachedRef.current = onAttached }, [onAttached])
  useEffect(() => { terminalRef.current = onTerminal }, [onTerminal])
  useEffect(() => { errRef.current = onError }, [onError])

  useEffect(() => {
    if (!contributionId || typeof window === "undefined") return

    const es = new EventSource(
      `${API}/api/v1/contributions/${contributionId}/stream`,
      { withCredentials: true }
    )

    es.addEventListener("PAYMENT_ATTACHED", (e: MessageEvent) => {
      try { attachedRef.current?.(JSON.parse(e.data)) }
      catch { console.error("[SSE] PAYMENT_ATTACHED parse error") }
    })

    es.addEventListener("PAYMENT_TERMINAL", (e: MessageEvent) => {
      try {
        terminalRef.current?.(JSON.parse(e.data))
        es.close() // server completes after terminal; close proactively
      } catch { console.error("[SSE] PAYMENT_TERMINAL parse error") }
    })

    es.onerror = () => {
      errRef.current?.()
      es.close()
    }

    return () => es.close()
  }, [contributionId]) // re-connect only when id changes
}
