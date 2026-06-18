import { EntrepreneurProfile, MOCK_PROFILE, Venture } from "@/app/dashboard/user-settings/_data/profile";
// import { api4app } from "@/lib/api4app";
import {
    DISTRICT_OPTIONS,
    INDUSTRY_OPTIONS,
    STAGE_OPTIONS,
    VettedEntrepreneur,
    VettedEntrepreneursFilters,
} from "@/types/entrepreneurs";

/* ============================================================
   Mock seed 
   ============================================================ */
const MOCK_ENTREPRENEURS: VettedEntrepreneur[] = [
    {
        id: "ama-kargbo",
        name: "Ama Kargbo",
        initials: "AK",
        role: "Founder, AgriSalone",
        company: "AgriSalone",
        logoInitial: "A",
        c1: "#1B8E4A",
        c2: "#0F6B36",
        short: "Empowering smallholder farmers with quality inputs and market access.",
        sector: "Agriculture",
        stage: "Seed Stage",
        stageTone: "amber",
        location: "Port Loko",
        photo: "/images/vetted-entrepreneurs/ama-kargbo.png",
    },
    {
        id: "mohamed-bangura",
        name: "Mohamed Bangura",
        initials: "MB",
        role: "Co-founder, PayLink SL",
        company: "PayLink SL",
        logoInitial: "P",
        c1: "#2563C9",
        c2: "#1B47A0",
        short: "Digital payments and financial services for individuals and businesses.",
        sector: "FinTech",
        stage: "Growth Stage",
        stageTone: "green",
        location: "Freetown",
    },
    {
        id: "isata-turay",
        name: "Isata Turay",
        initials: "IT",
        role: "Founder, EduBridge",
        company: "EduBridge",
        logoInitial: "E",
        c1: "#7A4DD0",
        c2: "#5A33A8",
        short: "Affordable digital learning platform for students and young professionals.",
        sector: "EdTech",
        stage: "Early Stage",
        stageTone: "blue",
        location: "Bo",
    },
    {
        id: "alimamy-koroma",
        name: "Alimamy Koroma",
        initials: "AK",
        role: "CEO, SunriSE Solar",
        company: "SunriSE Solar",
        logoInitial: "S",
        c1: "#E08A1E",
        c2: "#C26A0E",
        short: "Reliable and affordable solar energy solutions for homes and businesses.",
        sector: "Clean Energy",
        stage: "Growth Stage",
        stageTone: "green",
        location: "Kenema",
    },
    {
        id: "sia-sesay",
        name: "Sia Sesay",
        initials: "SS",
        role: "Founder, CarePoint SL",
        company: "CarePoint SL",
        logoInitial: "C",
        c1: "#D6456B",
        c2: "#A82C4F",
        short: "Accessible healthcare services and telemedicine for rural communities.",
        sector: "HealthTech",
        stage: "Seed Stage",
        stageTone: "amber",
        location: "Makeni",
    },
    {
        id: "foday-conteh",
        name: "Foday Conteh",
        initials: "FC",
        role: "Founder, FreshCold Logistics",
        company: "FreshCold",
        logoInitial: "F",
        c1: "#11998E",
        c2: "#0B6E66",
        short: "Cold-chain logistics reducing post-harvest losses for food producers.",
        sector: "Logistics",
        stage: "Early Stage",
        stageTone: "blue",
        location: "Freetown",
    },
];

const SECTOR_MAP: Record<string, string> = {
    Agriculture: "Agriculture",
    FinTech: "Finance",
    EdTech: "Education",
    "Clean Energy": "Renewable Energy",
    HealthTech: "Health",
    Logistics: "Other",
};

const VENTURE_RATING: Record<string, string> = {
    "Idea Stage": "Idea Verified",
    "Seed Stage": "Prototype Verified",
    "Early Stage": "Market Tested",
    "Growth Stage": "Investor Ready",
};

const NETWORK_DELAY = 400;

function simulateRequest<T>(result: T, delay = NETWORK_DELAY): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), delay));
}

function filterEntrepreneurs(
    items: VettedEntrepreneur[],
    filters: VettedEntrepreneursFilters = {}
): VettedEntrepreneur[] {
    const q = (filters.query ?? "").trim().toLowerCase();
    const industry = filters.industry ?? INDUSTRY_OPTIONS[0];
    const stage = filters.stage ?? STAGE_OPTIONS[0];
    const district = filters.district ?? DISTRICT_OPTIONS[0];

    return items.filter((e) => {
        const matchesQuery =
            !q ||
            e.name.toLowerCase().includes(q) ||
            e.company.toLowerCase().includes(q) ||
            e.role.toLowerCase().includes(q) ||
            e.short.toLowerCase().includes(q) ||
            e.sector.toLowerCase().includes(q);
        const matchesIndustry = industry === INDUSTRY_OPTIONS[0] || e.sector === industry;
        const matchesStage = stage === STAGE_OPTIONS[0] || e.stage === stage;
        const matchesDistrict = district === DISTRICT_OPTIONS[0] || e.location === district;
        return matchesQuery && matchesIndustry && matchesStage && matchesDistrict;
    });
}

function buildProfileFromCard(card: VettedEntrepreneur): EntrepreneurProfile {
    const venture: Venture = {
        id: `${card.id}-v1`,
        name: card.company,
        type: "Startup",
        sector: SECTOR_MAP[card.sector] ?? "Other",
        stage: card.stage,
        problem: card.short,
        solution: `${card.company} is building ${card.short.toLowerCase()}`,
        customers: `Customers and communities across ${card.location} and beyond.`,
        model: "Revenue-generating venture serving its target market.",
        status: `${card.stage} · operating in ${card.location}`,
        validation: ["Customer Testimonials", "Product Photos"],
        registered: true,
        score: 72,
        rating: VENTURE_RATING[card.stage] ?? "Market Tested",
        jobs: 0,
        customersReached: 0,
        beneficiaries: 0,
        innovation: "New to District",
    };

    return {
        name: card.name,
        headline: `${card.role} · ${card.short}`,
        gender: "",
        nationality: "Sierra Leonean",
        district: card.location,
        location: `${card.location}, Sierra Leone`,
        photo: card.photo,
        rating: "Vetted Entrepreneur",
        entrepreneurScore: 74,
        verification: {
            national_id: { status: "verified", label: "National ID", desc: "Government photo ID" },
            selfie: { status: "none", label: "Selfie Verification", desc: "Liveness check" },
            email: { status: "verified", label: "Email Address", desc: "" },
            phone: { status: "verified", label: "Phone Number", desc: "" },
            passport: { status: "none", label: "Passport", desc: "Optional", optional: true },
            voter_id: { status: "none", label: "Voter ID", desc: "Optional", optional: true },
        },
        about: `${card.short} As the ${card.role.toLowerCase()}, ${card.name.split(" ")[0]} is focused on building a credible, high-impact venture in the ${card.sector} sector from ${card.location}.`,
        journey: [],
        skills: [card.sector, card.stage],
        education: [],
        references: [],
        memberships: [],
        awards: [],
        links: [],
        ventures: [venture],
        impact: { jobs: 0, customers: 0, beneficiaries: 0, communities: 0, environmental: [] },
        funding: { received: [], needAmount: "", needNote: "", supportNeeded: [] },
        contact: { email: "", phone: "" },
        visibility: {
            about: true,
            skills: true,
            journey: false,
            education: false,
            credibility: false,
            ventures: true,
            impact: false,
            funding: false,
            contact: false,
        },
    };
}

function resolvePublicProfile(id: string, catalog: VettedEntrepreneur[]): EntrepreneurProfile | null {
    const card = catalog.find((e) => e.id === id);
    if (!card) return null;
    if (id === "ama-kargbo") {
        return { ...MOCK_PROFILE, photo: card.photo ?? MOCK_PROFILE.photo };
    }
    return buildProfileFromCard(card);
}

function toQueryString(filters: VettedEntrepreneursFilters): string {
    const params = new URLSearchParams();
    if (filters.query?.trim()) params.set("q", filters.query.trim());
    if (filters.industry && filters.industry !== INDUSTRY_OPTIONS[0]) {
        params.set("industry", filters.industry);
    }
    if (filters.stage && filters.stage !== STAGE_OPTIONS[0]) {
        params.set("stage", filters.stage);
    }
    if (filters.district && filters.district !== DISTRICT_OPTIONS[0]) {
        params.set("district", filters.district);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export const entrepreneursService = () => ({
    entrepreneurs: {
        /**
         * List vetted entrepreneurs for the public directory.
         * TODO(api)
         */
        list: async (filters: VettedEntrepreneursFilters = {}): Promise<VettedEntrepreneur[]> => {
            // TODO(api): uncomment when the endpoint is live
            // const response = await api4app(`/vetted-entrepreneurs${toQueryString(filters)}`, {
            //     method: "GET",
            // });
            // return response as VettedEntrepreneur[];

            return simulateRequest(filterEntrepreneurs(MOCK_ENTREPRENEURS, filters));
        },

        /**
         * Fetch the public profile for a vetted entrepreneur.
         * The API should return only sections the owner has marked public.
         * TODO(api):
         */
        getPublicProfile: async (id: string): Promise<EntrepreneurProfile | null> => {
            // const response = await api4app(`/vetted-entrepreneurs/${id}/profile`, {
            //     method: "GET",
            // });
            // return response as EntrepreneurProfile;

            return simulateRequest(resolvePublicProfile(id, MOCK_ENTREPRENEURS));
        },
    },
});
