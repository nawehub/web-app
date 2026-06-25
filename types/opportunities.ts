/* ============================================================
   NaWeHub — Opportunities (grants, competitions, events…)
   ============================================================ */

export type OpportunityType =
    | "grant"
    | "competition"
    | "event"
    | "accelerator"
    | "fellowship";

/** Moderation state. Public submissions arrive "pending"; admin posts are "approved". */
export type OpportunityStatus = "pending" | "approved" | "rejected";

/** Visual + label config for each opportunity type. */
export interface OpportunityTypeMeta {
    label: string;
    /** Accent colour used for the type icon when needed. */
    color: string;
    /** Tailwind classes for the type chip (background + text). */
    chipClass: string;
}

export const OPPORTUNITY_TYPES: Record<OpportunityType, OpportunityTypeMeta> = {
    grant: {
        label: "Grant",
        color: "#1B8E4A",
        chipClass: "bg-primary/15 text-primary",
    },
    competition: {
        label: "Competition",
        color: "#C9821B",
        chipClass:
            "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]",
    },
    event: {
        label: "Event",
        color: "#2563C9",
        chipClass: "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]",
    },
    accelerator: {
        label: "Accelerator",
        color: "#7A4DD0",
        chipClass: "bg-[#efe9fb] text-[#5a33a8] dark:bg-[#7a4dd0]/20 dark:text-[#c4aef0]",
    },
    fellowship: {
        label: "Fellowship",
        color: "#D6456B",
        chipClass: "bg-[#fcebf1] text-[#a82c4f] dark:bg-[#d6456b]/20 dark:text-[#f0a8c1]",
    },
};

export const OPPORTUNITY_TYPE_ORDER: OpportunityType[] = [
    "grant",
    "competition",
    "event",
    "accelerator",
    "fellowship",
];

/** A single opportunity listing. */
export interface Opportunity {
    id: string;
    type: OpportunityType;
    featured: boolean;
    /** Open for applications. */
    open: boolean;
    /** Moderation status. Treated as "approved" when absent (seed data). */
    status?: OpportunityStatus;
    title: string;
    org: string;
    /** Single-letter / short logo glyph. */
    logo: string;
    /** Accent colour for the logo tile gradient. */
    c1: string;
    /** ISO date string (yyyy-mm-dd). */
    deadline: string;
    /** Pretty deadline label, e.g. "15 Aug 2026". */
    deadlineLabel?: string;
    summary: string;

    /* ---- Card / detail extras (optional — not collected by every form) ---- */
    amount?: string;
    location?: string;
    sectors?: string[];
    stage?: string;
    tags?: string[];
    /** Selection / spots note, e.g. "1,000 selected". */
    spots?: string;

    /* ---- Submission form fields ---- */
    /** Full set of selected categories (broader than `type`). */
    categories?: string[];
    /** Provider / organisation type, e.g. "Development Partner". */
    orgType?: string;
    /** Who the opportunity is for. */
    beneficiaries?: string[];
    eligibilityCriteria?: string;
    /** Official details / application URL. */
    applicationLink?: string;
    contactEmail?: string;
    contactPhone?: string;
    /** Additional contact person (name + role). */
    contactPerson?: string;
    /** Geographic coverage, e.g. "Sierra Leone only". */
    coverage?: string;
    /** Cover / feature image (data URL or hosted URL). */
    coverImage?: string;
    /** Name of the person who submitted. */
    submittedBy?: string;
    /** ISO date the submission was made. */
    submittedAt?: string;
}

/** Filters for the public opportunities directory. */
export interface OpportunitiesFilters {
    query?: string;
    sector?: string;
    stage?: string;
}

export const OPPORTUNITY_SECTOR_OPTIONS = [
    "All sectors",
    "Agriculture",
    "Tech",
    "FinTech",
    "HealthTech",
    "Clean Energy",
    "Social Impact",
    "ICT",
] as const;

export const OPPORTUNITY_STAGE_OPTIONS = [
    "All stages",
    "Idea",
    "Prototype",
    "Early",
    "Growth",
] as const;

/** Accent palette offered when creating a listing in the admin manager. */
export const OPPORTUNITY_PALETTE = [
    "#1B8E4A",
    "#E08A1E",
    "#2563C9",
    "#7A4DD0",
    "#D6456B",
    "#11998E",
    "#C9821B",
] as const;

/* ============================================================
   Submission form option sets
   ============================================================ */

/** Opportunity categories shown on the submission form (broader than `type`). */
export const OPPORTUNITY_CATEGORY_OPTIONS = [
    "Grant",
    "Competition/Challenge",
    "Fellowship",
    "Scholarship",
    "Accelerator Program",
    "Incubator Program",
    "Training/Capacity Building",
    "Internship",
    "Funding Opportunity",
    "Business Support Service",
] as const;

/** Maps a submission category onto the listing `type` used for tabs / icons. */
export const CATEGORY_TO_TYPE: Record<string, OpportunityType> = {
    Grant: "grant",
    "Funding Opportunity": "grant",
    Scholarship: "fellowship",
    Fellowship: "fellowship",
    "Competition/Challenge": "competition",
    "Accelerator Program": "accelerator",
    "Incubator Program": "accelerator",
    "Training/Capacity Building": "event",
    Internship: "event",
    "Business Support Service": "event",
};

export function categoriesToType(categories: string[]): OpportunityType {
    for (const c of categories) {
        const t = CATEGORY_TO_TYPE[c];
        if (t) return t;
    }
    return "grant";
}

export const ORGANIZATION_TYPE_OPTIONS = [
    "Development Partner",
    "Innovation Hub",
    "Tech Hub",
    "Foundation",
    "Government Agency",
    "NGO",
    "Private Sector Organization",
    "University/Research Institution",
] as const;

export const BENEFICIARY_OPTIONS = [
    "Entrepreneurs",
    "Innovators",
    "Startups",
    "SMEs",
    "Women-led Businesses",
    "Youth",
    "Students",
    "Researchers",
    "Farmers",
    "Persons with Disabilities",
] as const;

export const COVERAGE_OPTIONS = [
    "Sierra Leone only",
    "Africa",
    "Global",
] as const;
