import { Opportunity } from "@/types/opportunities";

const DAY_MS = 86_400_000;

/** Whole days from now until the given date (negative once past). */
export function daysLeft(deadline: string, now: Date = new Date()): number {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.ceil((new Date(deadline).getTime() - start.getTime()) / DAY_MS);
}

export type DeadlineTone = "soon" | "ok" | "closed";

export function deadlineTone(o: Opportunity, now?: Date): DeadlineTone {
    if (!o.open) return "closed";
    return daysLeft(o.deadline, now) <= 21 ? "soon" : "ok";
}

/** Short countdown label for cards / tables. */
export function deadlineText(o: Opportunity, now?: Date): string {
    if (!o.open) return "Closed";
    const d = daysLeft(o.deadline, now);
    if (d <= 0) return "Closing today";
    if (d === 1) return "1 day left";
    if (d <= 45) return `${d} days left`;
    return o.deadlineLabel;
}

/** Darken a hex colour for gradient stops. */
export function shadeColor(hex: string, amount = 30): string {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - amount);
    const g = Math.max(0, ((n >> 8) & 255) - amount);
    const b = Math.max(0, (n & 255) - amount);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/** Up to two initials from an organisation / title. */
export function initials(name: string): string {
    return (
        name
            .replace(/[^A-Za-z ]/g, "")
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "O"
    );
}

/** A listing is publicly visible once approved (seed data has no status = approved). */
export function isApproved(o: { status?: string }): boolean {
    return o.status === undefined || o.status === "approved";
}

/** Pretty "15 Aug 2026" label from an ISO date. */
export function formatDeadlineLabel(iso: string): string {
    if (!iso) return "";
    try {
        return new Date(iso).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}
