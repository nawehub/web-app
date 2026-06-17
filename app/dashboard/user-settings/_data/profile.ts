"use client";

import { useEffect, useState } from "react";

/* ============================================================
   Entrepreneur profile — data model
   These types mirror the public profile / vetting model and are
   the single contract the UI renders against. When the API is
   wired up, `useProfile` is the only place that needs to change.
   ============================================================ */

export type VerificationStatus = "verified" | "review" | "none";

export interface VerificationCheck {
    status: VerificationStatus;
    label: string;
    desc: string;
    date?: string;
    optional?: boolean;
}

export type VerificationKey =
    | "national_id"
    | "selfie"
    | "email"
    | "phone"
    | "passport"
    | "voter_id";

export interface JourneyItem {
    id: string;
    year: string;
    title: string;
    desc?: string;
}

export interface EducationItem {
    id: string;
    title: string;
    org: string;
    year: string;
}

export interface ReferenceItem {
    id: string;
    name: string;
    role: string;
    type: "Academic" | "Professional" | "Community" | string;
}

export interface AwardItem {
    id: string;
    title: string;
    year: string;
}

export interface LinkItem {
    id: string;
    label: string;
    url: string;
}

export interface Venture {
    id: string;
    name: string;
    type: string;
    sector: string;
    stage: string;
    problem: string;
    solution: string;
    customers: string;
    model: string;
    status?: string;
    validation: string[];
    registered: boolean;
    score: number;
    rating: string;
    jobs: number;
    customersReached: number;
    beneficiaries: number;
    innovation: string;
}

export interface ImpactStats {
    jobs: number;
    customers: number;
    beneficiaries: number;
    communities: number;
    environmental: string[];
    stories?: string;
}

export interface FundingInfo {
    received: string[];
    needAmount: string;
    needNote: string;
    supportNeeded: string[];
}

export interface ContactInfo {
    email: string;
    phone: string;
    whatsapp?: string;
    linkedin?: string;
    facebook?: string;
    x?: string;
    nationalId?: string;
}

/** Per-section public visibility. Private sections are hidden from the public profile. */
export type SectionKey =
    | "about"
    | "skills"
    | "journey"
    | "education"
    | "credibility"
    | "ventures"
    | "impact"
    | "funding"
    | "contact";

export type Visibility = Record<SectionKey, boolean>;

export interface EntrepreneurProfile {
    name: string;
    headline: string;
    pronouns?: string;
    gender: string;
    dob?: string;
    nationality: string;
    district: string;
    chiefdom?: string;
    location: string;
    photo?: string;
    rating: string;
    entrepreneurScore: number;
    verification: Record<VerificationKey, VerificationCheck>;
    about: string;
    journey: JourneyItem[];
    skills: string[];
    education: EducationItem[];
    references: ReferenceItem[];
    memberships: string[];
    awards: AwardItem[];
    links: LinkItem[];
    ventures: Venture[];
    impact: ImpactStats;
    funding: FundingInfo;
    contact: ContactInfo;
    visibility: Visibility;
}

/* ---------- Section registry (drives ordering + the visibility summary) ---------- */
export const SECTIONS: { key: SectionKey; label: string }[] = [
    { key: "about", label: "About" },
    { key: "skills", label: "Skills & Expertise" },
    { key: "journey", label: "Entrepreneurial Journey" },
    { key: "education", label: "Education & Training" },
    { key: "credibility", label: "Credibility" },
    { key: "ventures", label: "Ventures Portfolio" },
    { key: "impact", label: "Impact & Results" },
    { key: "funding", label: "Funding & Support" },
    { key: "contact", label: "Contact & Identity" },
];

/* ---------- Option vocabularies (mirror the NaWeHub vetting model) ---------- */
export const OPT = {
    districts: [
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
    ],
    ventureTypes: [
        "Existing Business",
        "Startup",
        "Social Enterprise",
        "Community Project",
        "Cooperative",
        "Business Idea",
        "Research Commercialization",
        "Innovation Prototype",
    ],
    sectors: [
        "Agriculture",
        "Technology",
        "Renewable Energy",
        "Education",
        "Health",
        "Waste Management",
        "Manufacturing",
        "Tourism",
        "Finance",
        "Other",
    ],
    stages: [
        "Idea Stage",
        "Prototype Stage",
        "Pilot Stage",
        "Early Revenue",
        "Growth Stage",
        "Mature Business",
    ],
    innovation: [
        "Incremental",
        "Significant Improvement",
        "New to District",
        "New to Sierra Leone",
        "New to Africa",
        "Globally Novel",
    ],
    ventureRating: [
        "Idea Verified",
        "Prototype Verified",
        "Market Tested",
        "Growth Ready",
        "Investor Ready",
    ],
    validation: [
        "Registration Certificate",
        "Tax Documents",
        "Business License",
        "Customer Testimonials",
        "Product Photos",
        "Market Surveys",
        "Sales Records",
        "Prototype Demonstrations",
        "Community Endorsements",
        "Partner References",
    ],
    fundingReceived: ["Self-Funded", "Family Support", "Grants", "Investors", "Loans"],
    supportNeeded: [
        "Funding",
        "Mentorship",
        "Training",
        "Partnership",
        "Technical Support",
        "Market Access",
    ],
    referenceTypes: ["Academic", "Professional", "Community"],
};

/* ---------- Sector → gradient (used for venture logos) ---------- */
export const SECTOR_GRADIENT: Record<string, [string, string]> = {
    Agriculture: ["#10b779", "#04764a"],
    Technology: ["#3b82f6", "#1d4ed8"],
    "Renewable Energy": ["#f59e0b", "#d97706"],
    Education: ["#8b5cf6", "#6d28d9"],
    Health: ["#ef4444", "#b91c1c"],
    "Waste Management": ["#22c55e", "#15803d"],
    Manufacturing: ["#64748b", "#334155"],
    Tourism: ["#06b6d4", "#0e7490"],
    Finance: ["#2563eb", "#1e3a8a"],
    Other: ["#78716b", "#44403a"],
};

/* ---------- Helpers ---------- */
export function initials(name: string): string {
    return name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function compactNumber(n: number): string {
    const value = Number(n) || 0;
    return value >= 1000
        ? (value / 1000).toFixed(value % 1000 ? 1 : 0).replace(/\.0$/, "") + "k"
        : `${value}`;
}

/** Stable client-side id for newly created list items (journey, education, …). */
export function newId(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ============================================================
   Mock profile — placeholder data shown while the API is wired up.
   Replace `useProfile` with the real data source when ready.
   ============================================================ */
export const MOCK_PROFILE: EntrepreneurProfile = {
    name: "Ama Kargbo",
    headline:
        "Founder & CEO at AgriSalone · Agronomist building market access for smallholder farmers",
    pronouns: "She/Her",
    gender: "Female",
    dob: "1992-04-18",
    nationality: "Sierra Leonean",
    district: "Port Loko",
    chiefdom: "Maforki",
    location: "Port Loko, Sierra Leone",
    photo: "",
    rating: "Promising Entrepreneur",
    entrepreneurScore: 78,
    verification: {
        national_id: {
            status: "verified",
            label: "National ID",
            desc: "Government photo ID — front & back",
            date: "14 Mar 2026",
        },
        selfie: {
            status: "none",
            label: "Selfie Verification",
            desc: "Quick liveness check matched to your ID",
        },
        email: {
            status: "verified",
            label: "Email Address",
            desc: "ama@agrisalone.sl",
        },
        phone: {
            status: "verified",
            label: "Phone Number",
            desc: "+232 76 123 456",
        },
        passport: {
            status: "none",
            label: "Passport",
            desc: "Optional — strengthens your verification",
            optional: true,
        },
        voter_id: {
            status: "none",
            label: "Voter ID",
            desc: "Optional — adds another trust signal",
            optional: true,
        },
    },
    about:
        "I'm an agronomist and social entrepreneur from Port Loko. After watching harvest after harvest lost to poor inputs and broken market links, I founded AgriSalone in 2021 to put quality seeds, training, and fair markets directly in farmers' hands.\n\nI'm driven by a simple belief: Sierra Leone's smallholder farmers don't lack ambition — they lack access. I build the systems that close that gap.",
    journey: [
        {
            id: "j_seed_1",
            year: "2021",
            title: "Founded AgriSalone",
            desc: "Started with a 40-farmer pilot in Maforki chiefdom, bundling certified seeds with agronomy training.",
        },
        {
            id: "j_seed_2",
            year: "2019",
            title: "Field Officer, Njala Agri Extension",
            desc: "Two years working directly with farming cooperatives across the north — where the idea was born.",
        },
        {
            id: "j_seed_3",
            year: "2018",
            title: "First venture — FreshLeaf (closed)",
            desc: "A vegetable aggregation pilot that failed on logistics. My biggest lesson in unit economics.",
        },
    ],
    skills: [
        "Agriculture",
        "Agronomy",
        "Supply Chain",
        "Team Leadership",
        "Community Mobilisation",
        "Financial Modelling",
    ],
    education: [
        { id: "e_seed_1", title: "BSc Agricultural Science", org: "Njala University", year: "2014 – 2018" },
        {
            id: "e_seed_2",
            title: "Tony Elumelu Foundation Entrepreneurship Programme",
            org: "TEF",
            year: "2023",
        },
        { id: "e_seed_3", title: "Certificate in Agribusiness Management", org: "GIZ EnDev", year: "2022" },
    ],
    references: [
        { id: "r_seed_1", name: "Dr. Mariama Sesay", role: "Senior Lecturer, Njala University", type: "Academic" },
        { id: "r_seed_2", name: "Ibrahim Turay", role: "Regional Manager, GIZ EnDev", type: "Professional" },
        { id: "r_seed_3", name: "Pa Alimamy Kamara", role: "Maforki Chiefdom Farmers' Union", type: "Community" },
    ],
    memberships: [
        "Sierra Leone Agribusiness Association",
        "Tony Elumelu Foundation Alumni",
        "Freetown Innovation Hub",
    ],
    awards: [
        { id: "a_seed_1", title: "TEF Entrepreneur of the Year — Agriculture", year: "2023" },
        { id: "a_seed_2", title: "Orange Social Venture Prize — Finalist", year: "2024" },
    ],
    links: [
        { id: "l_seed_1", label: "AgriSalone website", url: "agrisalone.sl" },
        { id: "l_seed_2", label: "Interview — Politico SL", url: "politicosl.com/ama-kargbo" },
    ],
    ventures: [
        {
            id: "v1",
            name: "AgriSalone",
            type: "Existing Business",
            sector: "Agriculture",
            stage: "Early Revenue",
            problem:
                "Smallholder farmers lose up to 40% of potential income to poor-quality inputs and no reliable market to sell into.",
            solution:
                "A last-mile platform bundling certified inputs on credit, local-language agronomy training, and guaranteed offtake — repaid after harvest.",
            customers: "Smallholder rice, groundnut & cassava farmers across northern Sierra Leone.",
            model: "Input credit + produce aggregation margin (B2B2C).",
            status: "Operating in 4 districts · 2,400+ farmers onboarded",
            validation: ["Sales Records", "Customer Testimonials", "Registration Certificate"],
            registered: true,
            score: 84,
            rating: "Market Tested",
            jobs: 23,
            customersReached: 2400,
            beneficiaries: 9600,
            innovation: "New to District",
        },
        {
            id: "v2",
            name: "CassavaCarbon",
            type: "Business Idea",
            sector: "Renewable Energy",
            stage: "Idea Stage",
            problem:
                "Cassava peel waste from processing rots in piles, releasing methane and wasting energy potential.",
            solution:
                "Convert cassava peel waste into clean briquette fuel for rural households and bakeries.",
            customers: "Rural households, roadside bakeries, agro-processors.",
            model: "Sell briquettes; sell processing service to aggregators.",
            status: "Concept · seeking a pilot partner",
            validation: ["Market Surveys"],
            registered: false,
            score: 41,
            rating: "Idea Verified",
            jobs: 0,
            customersReached: 0,
            beneficiaries: 0,
            innovation: "New to Sierra Leone",
        },
    ],
    impact: {
        jobs: 23,
        customers: 2400,
        beneficiaries: 9600,
        communities: 14,
        environmental: ["38% average yield increase", "120 ha under improved practice"],
        stories:
            "Adama, a widow farming 1.5 acres in Maforki, tripled her groundnut income in two seasons and now employs two seasonal workers.",
    },
    funding: {
        received: ["Self-Funded", "Grants", "Family Support"],
        needAmount: "Le 750,000",
        needNote: "Seed round to finance input inventory and expand into two new districts.",
        supportNeeded: ["Funding", "Market Access", "Mentorship"],
    },
    contact: {
        email: "ama@agrisalone.sl",
        phone: "+232 76 123 456",
        whatsapp: "+232 76 123 456",
        linkedin: "linkedin.com/in/amakargbo",
        facebook: "fb.com/agrisalone",
        x: "@amakargbo_sl",
        nationalId: "SL-NID-••••2841",
    },
    visibility: {
        about: true,
        journey: true,
        skills: true,
        education: true,
        credibility: true,
        ventures: true,
        impact: true,
        funding: true,
        contact: false,
    },
};

/* ============================================================
   useProfile — data hook (the wire-up point for the real API).
   Today it simulates a short network fetch and serves MOCK_PROFILE.
   Swap the body for a real fetch / react-query call later; the
   returned shape ({ profile, isLoading, error }) is the contract.
   ============================================================ */
export interface UseProfileResult {
    profile: EntrepreneurProfile | null;
    isLoading: boolean;
    error: Error | null;
}

export function useProfile(): UseProfileResult {
    const [state, setState] = useState<UseProfileResult>({
        profile: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let active = true;
        const timer = setTimeout(() => {
            if (!active) return;
            setState({ profile: MOCK_PROFILE, isLoading: false, error: null });
        }, 600);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, []);

    return state;
}

/* ============================================================
   Mutation API — the second wire-up point.
   These are the ONLY functions that talk to the server. Today they
   simulate latency and always resolve; swap each body for a real
   `fetch(...)` (returning a rejected promise on failure) and the
   calling UI — which already handles pending/error — keeps working.
   ============================================================ */

const NETWORK_DELAY = 500;

function simulateRequest<T>(result: T, delay = NETWORK_DELAY): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), delay));
}

/** Persist the whole profile. Called by the debounced autosave. */
export async function saveProfile(profile: EntrepreneurProfile): Promise<void> {
    // TODO(api): replace with `await fetch("/api/profile", { method: "PUT", body: JSON.stringify(profile) })`
    await simulateRequest(profile);
}

export interface ChangePasswordInput {
    current: string;
    next: string;
}

/** Change the account password. */
export async function changePassword(_input: ChangePasswordInput): Promise<void> {
    // TODO(api): POST to /api/account/password; reject on wrong current password.
    await simulateRequest(null, 800);
}

/**
 * Submit a verification artifact (document / selfie / code) to the vetting
 * pipeline. Returns the resulting server-authoritative status.
 */
export async function submitVerification(
    key: VerificationKey,
    status: "review" | "verified"
): Promise<{ key: VerificationKey; status: "review" | "verified" }> {
    // TODO(api): POST the artifact; the SERVER decides the status. Never trust the client.
    return simulateRequest({ key, status });
}

/* ------------------------------------------------------------------
   DEMO-ONLY verification shortcuts.
   TODO(api): set DEMO_MODE = false (or delete the blocks guarded by it)
   once verification is server-backed. While true, the UI accepts a fake
   OTP, shows the demo code, and exposes a "simulate approval" button so
   the flow can be demonstrated without a backend. None of this is secure
   and must not ship enabled.
   ------------------------------------------------------------------ */
export const DEMO_MODE = true;
export const DEMO_VERIFICATION_CODE = "123456";

/* ---------- Field validators (used at the EditDialog save boundary) ---------- */
export function isEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function isUrl(v: string): boolean {
    const s = v.trim();
    // Accept bare domains (agrisalone.sl) as well as full URLs.
    return /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(s);
}

export function isPhone(v: string): boolean {
    return /^[+]?[\d\s().-]{7,}$/.test(v.trim());
}
