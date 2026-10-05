import type { Competition } from "@/types/competition";

export type PhaseTone = "open" | "soon" | "progress" | "done" | "cancelled";

/** Where a competition is, in a visitor's words. */
export function phaseOf(c: Competition, now: number): { label: string; tone: PhaseTone } {
    switch (c.state) {
        case "PUBLISHED":
            if (now < Date.parse(c.applicationOpensAt)) return { label: "Opens soon", tone: "soon" };
            if (now < Date.parse(c.applicationClosesAt)) return { label: "Applications open", tone: "open" };
            return { label: "Applications closed", tone: "progress" };
        case "SHORTLISTING": return { label: "Shortlisting", tone: "progress" };
        case "PITCH_VIDEO": return { label: "Shortlist announced", tone: "progress" };
        case "FINALS": return { label: "Finalists announced", tone: "progress" };
        case "COMPLETED": return { label: "Winners announced", tone: "done" };
        case "CANCELLED": return { label: "Cancelled", tone: "cancelled" };
    }
}

export const PHASE_CLASSES: Record<PhaseTone, string> = {
    open: "bg-primary/15 text-primary ring-primary/30",
    soon: "bg-info/15 text-info ring-info/30",
    progress: "bg-accent/15 text-accent ring-accent/30",
    done: "bg-primary/15 text-primary ring-primary/30",
    cancelled: "bg-muted text-muted-foreground ring-border",
};

export function formatWhen(iso: string | null | undefined, withTime = false) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-GB", {
        day: "numeric", month: "long", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
}

export function ordinal(rank: number) {
    return rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : `${rank}th`;
}

/** Whether the shortlist (and later the finalists and winners) has been made public. */
export function hasResults(c: Competition) {
    return c.state === "PITCH_VIDEO" || c.state === "FINALS" || c.state === "COMPLETED";
}
