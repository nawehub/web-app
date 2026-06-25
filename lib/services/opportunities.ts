// import { api4app } from "@/lib/api4app";
import {
    Opportunity,
    OpportunitiesFilters,
    OPPORTUNITY_SECTOR_OPTIONS,
    OPPORTUNITY_STAGE_OPTIONS,
} from "@/types/opportunities";

/* ============================================================
   Mock seed — grants, competitions, events, accelerators…
   ============================================================ */
export const MOCK_OPPORTUNITIES: Opportunity[] = [
    {
        id: "tef-2026",
        type: "grant",
        featured: true,
        open: true,
        title: "Tony Elumelu Foundation Entrepreneurship Programme",
        org: "Tony Elumelu Foundation",
        logo: "T",
        c1: "#1B8E4A",
        amount: "$5,000 seed capital",
        deadline: "2026-08-15",
        deadlineLabel: "15 Aug 2026",
        location: "Pan-African · Online",
        sectors: ["All sectors"],
        stage: "Idea – Early",
        summary:
            "Non-refundable $5,000 seed capital plus 12 weeks of training, mentorship and access to the largest African entrepreneurship network.",
        tags: ["Seed capital", "Mentorship", "Training"],
        spots: "1,000 selected",
    },
    {
        id: "orange-svp",
        type: "competition",
        featured: true,
        open: true,
        title: "Orange Social Venture Prize West Africa",
        org: "Orange Foundation",
        logo: "O",
        c1: "#E08A1E",
        amount: "Up to €25,000",
        deadline: "2026-07-30",
        deadlineLabel: "30 Jul 2026",
        location: "Freetown · Hybrid",
        sectors: ["ICT", "Social Impact"],
        stage: "Prototype – Growth",
        summary:
            "Pitch a tech-driven solution improving lives in health, agriculture, education or energy. Top three ventures share the prize pool plus 6 months of support.",
        tags: ["Prize money", "Tech for good", "Pitch"],
        spots: "Top 3 win",
    },
    {
        id: "sl-innov-week",
        type: "event",
        featured: false,
        open: true,
        title: "Sierra Leone Innovation Week 2026",
        org: "DSTI Sierra Leone",
        logo: "D",
        c1: "#2563C9",
        amount: "Free entry",
        deadline: "2026-09-05",
        deadlineLabel: "5 Sep 2026",
        location: "Bintumani, Freetown",
        sectors: ["All sectors"],
        stage: "All stages",
        summary:
            "Three days of keynotes, investor speed-dating, demo booths and workshops connecting Sierra Leone's founders with funders and partners.",
        tags: ["Networking", "Investors", "Workshops"],
        spots: "800 attendees",
    },
    {
        id: "ictga",
        type: "accelerator",
        featured: false,
        open: true,
        title: "Freetown Innovation Hub Accelerator — Cohort 5",
        org: "Freetown Innovation Hub",
        logo: "F",
        c1: "#7A4DD0",
        amount: "Equity-free · Le 30k stipend",
        deadline: "2026-07-12",
        deadlineLabel: "12 Jul 2026",
        location: "Freetown · In-person",
        sectors: ["Tech", "FinTech", "HealthTech"],
        stage: "Early – Growth",
        summary:
            "A 16-week equity-free accelerator with a monthly stipend, dedicated mentors, office space and a demo day in front of regional investors.",
        tags: ["Equity-free", "Office space", "Demo day"],
        spots: "15 startups",
    },
    {
        id: "agri-grant",
        type: "grant",
        featured: false,
        open: true,
        title: "AGRA Smallholder AgriTech Grant",
        org: "AGRA",
        logo: "A",
        c1: "#11998E",
        amount: "$10,000 – $40,000",
        deadline: "2026-08-28",
        deadlineLabel: "28 Aug 2026",
        location: "West Africa",
        sectors: ["Agriculture", "Logistics"],
        stage: "Early – Growth",
        summary:
            "Grants for ventures improving smallholder farmer productivity, market access or post-harvest loss reduction across West Africa.",
        tags: ["Agriculture", "Grant", "Market access"],
        spots: "Rolling review",
    },
    {
        id: "she-leads",
        type: "fellowship",
        featured: false,
        open: true,
        title: "She Leads Women Founders Fellowship",
        org: "UN Women · NaWeHub",
        logo: "S",
        c1: "#D6456B",
        amount: "Le 20k + mentorship",
        deadline: "2026-07-20",
        deadlineLabel: "20 Jul 2026",
        location: "Nationwide",
        sectors: ["All sectors"],
        stage: "Idea – Early",
        summary:
            "A 6-month fellowship for women-led ventures: a cash grant, a dedicated woman mentor, peer cohort, and visibility to investors.",
        tags: ["Women-led", "Fellowship", "Mentorship"],
        spots: "40 fellows",
    },
    {
        id: "green-challenge",
        type: "competition",
        featured: false,
        open: false,
        title: "Clean Energy & Climate Challenge",
        org: "UNDP Sierra Leone",
        logo: "U",
        c1: "#1B8E4A",
        amount: "Up to $15,000",
        deadline: "2026-06-30",
        deadlineLabel: "30 Jun 2026",
        location: "Online",
        sectors: ["Clean Energy", "Waste"],
        stage: "Prototype – Growth",
        summary:
            "Funding and technical support for ventures tackling climate resilience, clean energy access or circular-economy solutions.",
        tags: ["Climate", "Prize money", "Technical support"],
        spots: "Top 5 win",
    },
    {
        id: "investor-mixer",
        type: "event",
        featured: false,
        open: true,
        title: "NaWeHub Investor Mixer — Q3",
        org: "NaWeHub",
        logo: "N",
        c1: "#1B8E4A",
        amount: "Invite only",
        deadline: "2026-07-08",
        deadlineLabel: "8 Jul 2026",
        location: "Radisson Blu, Freetown",
        sectors: ["All sectors"],
        stage: "Vetted only",
        summary:
            "An exclusive evening connecting vetted entrepreneurs with angel investors and funds. Apply with your NaWeHub profile to be considered.",
        tags: ["Investors", "Vetted only", "Networking"],
        spots: "60 founders",
    },
    {
        id: "youth-fund",
        type: "grant",
        featured: false,
        open: true,
        title: "National Youth Enterprise Fund",
        org: "Ministry of Youth Affairs",
        logo: "Y",
        c1: "#C9821B",
        amount: "Le 5k – Le 50k",
        deadline: "2026-09-15",
        deadlineLabel: "15 Sep 2026",
        location: "Nationwide",
        sectors: ["All sectors"],
        stage: "Idea – Early",
        summary:
            "Government-backed micro-grants for entrepreneurs aged 18–35 starting or scaling a registered business in Sierra Leone.",
        tags: ["Youth", "Government", "Micro-grant"],
        spots: "500 grants",
    },
];

const NETWORK_DELAY = 350;

function simulateRequest<T>(result: T, delay = NETWORK_DELAY): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(result), delay));
}

export function filterOpportunities(
    items: Opportunity[],
    filters: OpportunitiesFilters = {}
): Opportunity[] {
    const q = (filters.query ?? "").trim().toLowerCase();
    const sector = filters.sector ?? OPPORTUNITY_SECTOR_OPTIONS[0];
    const stage = filters.stage ?? OPPORTUNITY_STAGE_OPTIONS[0];

    return items.filter((o) => {
        const matchesQuery =
            !q ||
            (
                o.title +
                o.org +
                o.summary +
                o.tags.join(" ")
            )
                .toLowerCase()
                .includes(q);

        const matchesSector =
            sector === OPPORTUNITY_SECTOR_OPTIONS[0] ||
            o.sectors.includes("All sectors") ||
            o.sectors.some((s) => s.toLowerCase().includes(sector.toLowerCase()));

        const matchesStage =
            stage === OPPORTUNITY_STAGE_OPTIONS[0] ||
            o.stage.toLowerCase().includes("all") ||
            o.stage.toLowerCase().includes(stage.toLowerCase());

        return matchesQuery && matchesSector && matchesStage;
    });
}

export const opportunitiesService = () => ({
    opportunities: {
        /**
         * List opportunities for the public directory.
         * Admin edits are layered on top client-side (see use-opportunities-admin).
         * TODO(api): swap the mock for the live endpoint.
         */
        list: async (
            filters: OpportunitiesFilters = {}
        ): Promise<Opportunity[]> => {
            // const response = await api4app(`/opportunities${toQueryString(filters)}`, {
            //     method: "GET",
            // });
            // return response as Opportunity[];

            return simulateRequest(filterOpportunities(MOCK_OPPORTUNITIES, filters));
        },
    },
});
