import { Opportunity } from "@/types/opportunities";
import { MOCK_OPPORTUNITIES } from "@/lib/services/opportunities";

/**
 * Client-side store for admin-managed opportunities.
 *
 * The admin "Opportunities Manager" persists the full listing array here, and
 * the public Opportunities page reads it so staff edits go live immediately.
 * This is a stand-in for a real backend; swap for an API when one is available.
 */
export const OPPORTUNITIES_LS_KEY = "nawehub_opps_v1";

function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

/** The seed listings, deep-cloned so callers can mutate safely. */
export function seedOpportunities(): Opportunity[] {
    return clone(MOCK_OPPORTUNITIES);
}

/** Saved admin listings if present, otherwise the seed. */
export function loadOpportunities(): Opportunity[] {
    if (typeof window === "undefined") return seedOpportunities();
    try {
        const raw = window.localStorage.getItem(OPPORTUNITIES_LS_KEY);
        const saved = raw ? JSON.parse(raw) : null;
        if (Array.isArray(saved) && saved.length) return saved as Opportunity[];
    } catch {
        /* ignore malformed storage */
    }
    return seedOpportunities();
}

export function saveOpportunities(list: Opportunity[]): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(OPPORTUNITIES_LS_KEY, JSON.stringify(list));
    } catch {
        /* storage may be unavailable (private mode / quota) */
    }
}

export function resetOpportunities(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(OPPORTUNITIES_LS_KEY);
    } catch {
        /* ignore */
    }
}

/**
 * Append a new submission (prepended so it surfaces at the top of the admin
 * queue) and persist. Returns the updated list.
 */
export function submitOpportunity(opp: Opportunity): Opportunity[] {
    const next = [opp, ...loadOpportunities()];
    saveOpportunities(next);
    return next;
}
