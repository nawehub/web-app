"use client";

import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveResult {
    status: SaveStatus;
    /** Force an immediate save (e.g. a manual "retry" after an error). */
    saveNow: () => void;
}

/**
 * Debounced autosave. Watches `value` and, after `delay` ms of quiet, calls
 * `save(value)` and tracks a saving/saved/error status. The initial render is
 * skipped so we don't persist data the user hasn't touched. Out-of-order
 * responses are ignored via a monotonically increasing run id, so a slow early
 * save can't clobber the status of a newer one.
 */
export function useAutosave<T>(
    value: T,
    save: (value: T) => Promise<void>,
    { delay = 800 }: { delay?: number } = {}
): UseAutosaveResult {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const firstRun = useRef(true);
    const latest = useRef(value);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const runId = useRef(0);

    latest.current = value;

    const flush = () => {
        const id = ++runId.current;
        setStatus("saving");
        save(latest.current)
            .then(() => {
                if (id === runId.current) setStatus("saved");
            })
            .catch(() => {
                if (id === runId.current) setStatus("error");
            });
    };

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(flush, delay);
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
        // `flush` reads from refs, so it's intentionally not a dependency.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, delay]);

    return { status, saveNow: flush };
}
