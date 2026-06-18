export type StageTone = "green" | "amber" | "blue" | "gray";

/** Summary card shown on the vetted entrepreneurs listing. */
export interface VettedEntrepreneur {
    id: string;
    name: string;
    initials: string;
    role: string;
    company: string;
    logoInitial: string;
    /** Avatar gradient stops */
    c1: string;
    c2: string;
    photo?: string;
    short: string;
    sector: string;
    stage: string;
    stageTone: StageTone;
    location: string;
}

/** Filters for the public entrepreneurs directory. Passed to the API as query params when live. */
export interface VettedEntrepreneursFilters {
    query?: string;
    industry?: string;
    stage?: string;
    district?: string;
}

export const INDUSTRY_OPTIONS = [
    "All Industries",
    "Agriculture",
    "FinTech",
    "EdTech",
    "Clean Energy",
    "HealthTech",
    "Logistics",
] as const;

export const STAGE_OPTIONS = [
    "All Stages",
    "Idea Stage",
    "Seed Stage",
    "Early Stage",
    "Growth Stage",
] as const;

export const DISTRICT_OPTIONS = [
    "All Districts",
    "Freetown",
    "Bo",
    "Kenema",
    "Makeni",
    "Port Loko",
] as const;
