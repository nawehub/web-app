/** Summary card shown on the vetted entrepreneurs listing. */
export interface VettedEntrepreneur {
    id: string;
    name: string;
    initials: string;
    role: string;
    /** District chip shown above the name (top card overlay). */
    district: string;
    logoInitial: string;
    /** Avatar gradient stops */
    c1: string;
    c2: string;
    photo?: string;
    short: string;
    /** Up to a handful of the entrepreneur's real skills — shown as pill chips. */
    skills: string[];
    location: string;
    featured?: boolean;
    featuredOrder?: number;
}

/** Filters for the public entrepreneurs directory. Passed to the API as query params. */
export interface VettedEntrepreneursFilters {
    query?: string;
    skill?: string;
    district?: string;
    gender?: string;
    nationality?: string;
}

export const DISTRICT_OPTIONS = [
    "All Districts",
    "Western Area Urban",
    "Western Area Rural",
    "Bo",
    "Bombali",
    "Bonthe",
    "Falaba",
    "Kailahun",
    "Kambia",
    "Karene",
    "Kenema",
    "Koinadugu",
    "Kono",
    "Moyamba",
    "Port Loko",
    "Pujehun",
    "Tonkolili",
] as const;
