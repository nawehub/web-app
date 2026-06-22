import { EntrepreneurProfile, MOCK_PROFILE } from "@/app/dashboard/user-settings/_data/profile";
import { entrepreneursService } from "@/lib/services/entrepreneurs";
import {
    CheckItem,
    TrustWeight,
    VettingCase,
    VettingFilter,
    VettingStatus,
    VettingTrust,
} from "@/types/vetting-admin";

export const TRUST_WEIGHTS: TrustWeight[] = [
    { k: "identity", label: "Identity", w: 0.22, desc: "ID, selfie & contact verification" },
    { k: "references", label: "References", w: 0.15, desc: "Academic, professional & community" },
    { k: "activity", label: "Activity", w: 0.1, desc: "Profile completeness & recency" },
    { k: "venture", label: "Venture Quality", w: 0.25, desc: "Problem, solution & traction" },
    { k: "community", label: "Community Feedback", w: 0.1, desc: "Endorsements & testimonials" },
    { k: "impact", label: "Impact Evidence", w: 0.18, desc: "Jobs, beneficiaries & outcomes" },
];

export const ENT_RATINGS = [
    "Emerging Entrepreneur",
    "Promising Entrepreneur",
    "Established Entrepreneur",
    "High-Impact Entrepreneur",
] as const;

export const VEN_RATINGS = [
    "Idea Verified",
    "Prototype Verified",
    "Market Tested",
    "Growth Ready",
    "Investor Ready",
] as const;

export const STATUS_META: Record<
    VettingStatus,
    { label: string; pillClass: string }
> = {
    pending: {
        label: "Pending review",
        pillClass: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    review: {
        label: "In review",
        pillClass: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    approved: {
        label: "Approved · Live",
        pillClass: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    },
    changes: {
        label: "Changes requested",
        pillClass: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    },
    rejected: {
        label: "Rejected",
        pillClass: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
};

export const CHECK_ITEMS: CheckItem[] = [
    { k: "national_id", label: "National ID", kind: "doc", hint: "Front & back · matches name" },
    { k: "selfie", label: "Selfie / Liveness", kind: "bio", hint: "Face matches ID photo" },
    { k: "contact", label: "Email & Phone", kind: "otp", hint: "OTP confirmed on both" },
    { k: "references", label: "References", kind: "ref", hint: "At least one contacted" },
    { k: "business", label: "Business / Validation", kind: "doc", hint: "Registration or alt. evidence" },
];

export const VETTING_FILTERS: { key: VettingFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "review", label: "In review" },
    { key: "approved", label: "Approved" },
    { key: "featured", label: "Featured" },
    { key: "changes", label: "Changes" },
];

export const SEED_CASES: VettingCase[] = [
    {
        id: "ama-kargbo",
        status: "review",
        submitted: "2026-03-12",
        priority: true,
        trust: { identity: 96, references: 84, activity: 80, venture: 85, community: 72, impact: 82 },
        entRating: "Promising Entrepreneur",
        checks: {
            national_id: "approved",
            selfie: "pending",
            contact: "approved",
            references: "approved",
            business: "approved",
        },
        venRatings: { v1: "Market Tested", v2: "Idea Verified" },
        notes: "",
    },
    {
        id: "isata-turay",
        status: "pending",
        submitted: "2026-04-02",
        priority: false,
        trust: { identity: 70, references: 66, activity: 72, venture: 74, community: 68, impact: 70 },
        entRating: "Promising Entrepreneur",
        checks: {
            national_id: "pending",
            selfie: "pending",
            contact: "approved",
            references: "pending",
            business: "pending",
        },
        venRatings: { e1: "Market Tested" },
        notes: "",
    },
    {
        id: "sia-sesay",
        status: "pending",
        submitted: "2026-04-05",
        priority: true,
        trust: { identity: 64, references: 60, activity: 66, venture: 68, community: 74, impact: 78 },
        entRating: "Emerging Entrepreneur",
        checks: {
            national_id: "pending",
            selfie: "pending",
            contact: "approved",
            references: "pending",
            business: "rejected",
        },
        venRatings: { c1: "Prototype Verified" },
        notes: "Business not yet registered — assessing alternative evidence (testimonials, surveys).",
    },
    {
        id: "mohamed-bangura",
        status: "approved",
        submitted: "2026-02-18",
        priority: false,
        trust: { identity: 98, references: 88, activity: 90, venture: 90, community: 80, impact: 84 },
        entRating: "Established Entrepreneur",
        checks: {
            national_id: "approved",
            selfie: "approved",
            contact: "approved",
            references: "approved",
            business: "approved",
        },
        venRatings: { p1: "Investor Ready" },
        notes: "Strong traction and clean documents. Approved for investor visibility.",
    },
    {
        id: "alimamy-koroma",
        status: "approved",
        submitted: "2026-01-29",
        priority: false,
        trust: { identity: 97, references: 90, activity: 88, venture: 92, community: 86, impact: 90 },
        entRating: "High-Impact Entrepreneur",
        checks: {
            national_id: "approved",
            selfie: "approved",
            contact: "approved",
            references: "approved",
            business: "approved",
        },
        venRatings: { s1: "Investor Ready" },
        notes: "Exemplary impact evidence. Flagged for the featured cohort.",
    },
    {
        id: "foday-conteh",
        status: "changes",
        submitted: "2026-03-28",
        priority: false,
        trust: { identity: 82, references: 58, activity: 70, venture: 72, community: 54, impact: 66 },
        entRating: "Promising Entrepreneur",
        checks: {
            national_id: "approved",
            selfie: "pending",
            contact: "approved",
            references: "rejected",
            business: "approved",
        },
        venRatings: { f1: "Market Tested" },
        notes: "Requested an additional professional reference and updated sales records before approval.",
    },
];

export const AVATAR_COLORS: Record<string, [string, string]> = {
    "ama-kargbo": ["#10b779", "#04764a"],
    "isata-turay": ["#8b5cf6", "#6d28d9"],
    "sia-sesay": ["#ef4444", "#b91c1c"],
    "mohamed-bangura": ["#2563eb", "#1e3a8a"],
    "alimamy-koroma": ["#f59e0b", "#d97706"],
    "foday-conteh": ["#0d9488", "#0f766e"],
};

const LS_KEY = "nawehub_admin_v1";

export function trustOverall(trust: VettingTrust): number {
    return Math.round(TRUST_WEIGHTS.reduce((sum, w) => sum + (trust[w.k] || 0) * w.w, 0));
}

export function suggestEntRating(score: number): string {
    if (score >= 88) return "High-Impact Entrepreneur";
    if (score >= 74) return "Established Entrepreneur";
    if (score >= 58) return "Promising Entrepreneur";
    return "Emerging Entrepreneur";
}

export function scoreColor(score: number): string {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#16a34a";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
}

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function fmtCompact(n: number): string {
    if (n >= 1000) {
        const v = n / 1000;
        return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, "")}k`;
    }
    return String(n);
}

export function fmtDate(d: string): string {
    try {
        return new Date(d).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return d;
    }
}

export function mergeVettingState(): VettingCase[] {
    let saved: Record<string, Partial<VettingCase>> = {};
    if (typeof window !== "undefined") {
        try {
            saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
        } catch {
            saved = {};
        }
    }

    return SEED_CASES.map((seed) => {
        const patch = saved[seed.id] || {};
        return {
            ...seed,
            ...patch,
            trust: { ...seed.trust, ...(patch.trust || {}) },
            checks: { ...seed.checks, ...(patch.checks || {}) },
            venRatings: { ...seed.venRatings, ...(patch.venRatings || {}) },
        };
    });
}

export function persistVettingState(cases: VettingCase[]): void {
    if (typeof window === "undefined") return;
    const out: Record<string, Partial<VettingCase>> = {};
    cases.forEach((c) => {
        out[c.id] = {
            status: c.status,
            trust: c.trust,
            entRating: c.entRating,
            checks: c.checks,
            venRatings: c.venRatings,
            notes: c.notes,
            reviewer: c.reviewer,
        };
    });
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(out));
    } catch {
        /* ignore quota errors */
    }
}

const profileCache = new Map<string, EntrepreneurProfile>();

export async function getAdminProfile(id: string): Promise<EntrepreneurProfile | null> {
    if (profileCache.has(id)) return profileCache.get(id)!;
    if (id === "ama-kargbo" && typeof window !== "undefined") {
        try {
            const stored = localStorage.getItem("nawehub_profile_v1");
            if (stored) {
                const profile = JSON.parse(stored) as EntrepreneurProfile;
                profileCache.set(id, profile);
                return profile;
            }
        } catch {
            /* fall through */
        }
        profileCache.set(id, MOCK_PROFILE);
        return MOCK_PROFILE;
    }
    const profile = await entrepreneursService().entrepreneurs.getPublicProfile(id);
    if (profile) profileCache.set(id, profile);
    return profile;
}
