"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  TopContributorsPayload,
  DistrictRankingsPayload,
  PaymentAttachedPayload,
  PaymentTerminalPayload, TOP_CONTRIBUTORS_EVENT_TYPE, PAYMENT_TERMINAL_EVENT_TYPE, PAYMENT_ATTACHED_EVENT_TYPE,
  DISTRICT_RANKINGS_EVENT_TYPE,
} from "@/types/sse";

// ─── Global stream handlers (leaderboard / rankings) ─────────────────────────
interface GlobalSseOptions {
  onTopContributors?: (data: TopContributorsPayload) => void;
  onDistrictRankings?: (data: DistrictRankingsPayload) => void;
  onError?: (error: Event) => void;
  enabled?: boolean;
}

export function useGlobalSse({
  onTopContributors,
  onDistrictRankings,
  onError,
  enabled = true,
}: GlobalSseOptions) {
  const esRef = useRef<EventSource | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const MAX_ATTEMPTS = 5;

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    esRef.current?.close();

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lyd/contributions/stream`;
    const es = new EventSource(url);
    esRef.current = es;

    if (onTopContributors) {
      es.addEventListener(TOP_CONTRIBUTORS_EVENT_TYPE, (e: MessageEvent) => {
        try {
          attemptsRef.current = 0;
          onTopContributors(JSON.parse(e.data));
        } catch (err) {
          console.error("[SSE] Failed to parse TOP_CONTRIBUTORS", err);
        }
      });
    }

    if (onDistrictRankings) {
      es.addEventListener(DISTRICT_RANKINGS_EVENT_TYPE, (e: MessageEvent) => {
        try {
          attemptsRef.current = 0;
          onDistrictRankings(JSON.parse(e.data));
        } catch (err) {
          console.error("[SSE] Failed to parse DISTRICT_RANKINGS", err);
        }
      });
    }

    es.onerror = (event) => {
      onError?.(event);
      es.close();

      if (attemptsRef.current < MAX_ATTEMPTS) {
        const delay = 3000 * Math.pow(2, attemptsRef.current);
        attemptsRef.current += 1;
        console.warn(`[SSE] Reconnecting in ${delay}ms (attempt ${attemptsRef.current})`);
        reconnectRef.current = setTimeout(connect, delay);
      } else {
        console.error("[SSE] Max reconnect attempts reached");
      }
    };
  }, [enabled, onTopContributors, onDistrictRankings, onError]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connect]);

  return {
    disconnect: () => esRef.current?.close(),
  };
}

// ─── Per-contribution payment stream ─────────────────────────────────────────
interface PaymentSseOptions {
  contributionId: string | null;
  onAttached?: (data: PaymentAttachedPayload) => void;
  onTerminal?: (data: PaymentTerminalPayload) => void;
  onError?: (error: Event) => void;
}

export function usePaymentSse({
  contributionId,
  onAttached,
  onTerminal,
  onError,
}: PaymentSseOptions) {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!contributionId || typeof window === "undefined") return;

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/lyd/contributions/${contributionId}/stream`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener(PAYMENT_ATTACHED_EVENT_TYPE, (e: MessageEvent) => {
      try {
        onAttached?.(JSON.parse(e.data));
      } catch (err) {
        console.error("[SSE] Failed to parse PAYMENT_ATTACHED", err);
      }
    });

    es.addEventListener(PAYMENT_TERMINAL_EVENT_TYPE, (e: MessageEvent) => {
      try {
        const data: PaymentTerminalPayload = JSON.parse(e.data);
        onTerminal?.(data);
        // Server completes the stream after terminal event — close cleanly
        es.close();
      } catch (err) {
        console.error("[SSE] Failed to parse PAYMENT_TERMINAL", err);
      }
    });

    es.onerror = (event) => {
      onError?.(event);
      es.close();
    };

    return () => es.close();
  }, [contributionId]);
}
