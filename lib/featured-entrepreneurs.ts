const LS_KEY = "nawehub_featured_entrepreneurs_v1";

/** Fixed landing-page spotlight slots. */
export const FEATURED_SLOT_COUNT = 4;

/** @deprecated use FEATURED_SLOT_COUNT */
export const MAX_FEATURED_ENTREPRENEURS = FEATURED_SLOT_COUNT;

/** Default spotlight order on first visit (matches vetting dashboard mock). */
export const DEFAULT_FEATURED_IDS = [
    "ama-kargbo",
    "isata-turay",
    "mohamed-bangura",
    "alimamy-koroma",
] as const;

export function readFeaturedIds(): string[] {
    if (typeof window === "undefined") {
        return [...DEFAULT_FEATURED_IDS];
    }
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return [...DEFAULT_FEATURED_IDS];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [...DEFAULT_FEATURED_IDS];
        return parsed
            .filter((id): id is string => typeof id === "string")
            .slice(0, FEATURED_SLOT_COUNT);
    } catch {
        return [...DEFAULT_FEATURED_IDS];
    }
}

export function writeFeaturedIds(ids: string[]): void {
    if (typeof window === "undefined") return;
    const unique = ids.filter((id, i) => ids.indexOf(id) === i).slice(0, FEATURED_SLOT_COUNT);
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(unique));
    } catch {
        /* ignore quota errors */
    }
}

export function isFeaturedId(id: string, featuredIds?: string[]): boolean {
    return (featuredIds ?? readFeaturedIds()).includes(id);
}

/** Add to the next free slot. Returns null when at capacity. */
export function addFeaturedId(id: string): string[] | null {
    const current = readFeaturedIds();
    if (current.includes(id)) return current;
    if (current.length >= FEATURED_SLOT_COUNT) return null;
    const next = [...current, id];
    writeFeaturedIds(next);
    return next;
}

export function removeFeaturedId(id: string): string[] {
    const next = readFeaturedIds().filter((x) => x !== id);
    writeFeaturedIds(next);
    return next;
}

/** Toggle featured; returns { ok, ids, reason? }. */
export function toggleFeaturedId(id: string): {
    ok: boolean;
    ids: string[];
    reason?: "max";
} {
    const current = readFeaturedIds();
    if (current.includes(id)) {
        const next = removeFeaturedId(id);
        return { ok: true, ids: next };
    }
    const next = addFeaturedId(id);
    if (!next) return { ok: false, ids: current, reason: "max" };
    return { ok: true, ids: next };
}

/** Reorder filled slots by drag-and-drop (slot indices 0..length-1). */
export function reorderFeaturedIds(fromIndex: number, toIndex: number): string[] {
    const ids = [...readFeaturedIds()];
    if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ids.length ||
        toIndex >= ids.length
    ) {
        return ids;
    }
    const [item] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, item);
    writeFeaturedIds(ids);
    return ids;
}

/** Drop a featured entrepreneur onto an empty slot index (extends list). */
export function moveFeaturedIdToSlot(fromIndex: number, toSlot: number): string[] {
    const ids = [...readFeaturedIds()];
    if (fromIndex < 0 || fromIndex >= ids.length || toSlot < 0 || toSlot >= FEATURED_SLOT_COUNT) {
        return ids;
    }
    const [item] = ids.splice(fromIndex, 1);
    const padded: (string | null)[] = Array.from({ length: FEATURED_SLOT_COUNT }, (_, i) => ids[i] ?? null);
    padded[toSlot] = item;
    const next = padded.filter((x): x is string => x !== null);
    writeFeaturedIds(next);
    return next;
}

/** Remove entrepreneurs who are no longer approved/live. */
export function pruneFeaturedIds(approvedIds: Set<string>): string[] {
    const next = readFeaturedIds().filter((id) => approvedIds.has(id));
    writeFeaturedIds(next);
    return next;
}

export function applyFeaturedFlags<T extends { id: string }>(
    items: T[],
    featuredIds?: string[]
): (T & { featured: boolean; featuredOrder: number })[] {
    const ids = featuredIds ?? readFeaturedIds();
    return items.map((item) => {
        const order = ids.indexOf(item.id);
        return {
            ...item,
            featured: order >= 0,
            featuredOrder: order,
        };
    });
}

/** Landing page featured rail — exact slot order, featured only. */
export function getFeaturedRail<T extends { id: string }>(
    items: T[],
    featuredIds?: string[]
): (T & { featured: true; featuredOrder: number })[] {
    const ids = featuredIds ?? readFeaturedIds();
    const byId = new Map(items.map((item) => [item.id, item]));
    return ids
        .map((id, order) => {
            const item = byId.get(id);
            if (!item) return null;
            return { ...item, featured: true as const, featuredOrder: order };
        })
        .filter((x): x is T & { featured: true; featuredOrder: number } => x !== null);
}

export function sortFeaturedFirst<T extends { featured?: boolean; featuredOrder?: number }>(
    items: T[]
): T[] {
    return [...items].sort((a, b) => {
        if (a.featured && b.featured) {
            return (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0);
        }
        if (a.featured) return -1;
        if (b.featured) return 1;
        return 0;
    });
}
