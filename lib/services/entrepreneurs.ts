import type { PagedResponse } from "@/lib/gateway";
import { fromEnumParam, SKILL_OPTIONS } from "@/lib/gateway-enums";
import { initials as toInitials } from "@/types/entrepreneur-profile";
import type { EntrepreneurProfile, Venture, JourneyItem } from "@/types/entrepreneur-profile";
import type { VettedEntrepreneur } from "@/types/entrepreneurs";

/** Mirrors EntrepreneurModel.EntrepreneurProfile on web-api-gateway. */
export interface GatewayEntrepreneurProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    pronoun: string | null;
    profilePhotoUrl: string | null;
    gender: string;
    dateOfBirth: string | null;
    nationality: string;
    district: string;
    chiefdom: string | null;
    currentLocation: string;
    contactInfo: { email: string; phoneNumber: string; whatsappNumber: string } | null;
    socialLinks: { githubProfileUrl: string; linkedinUrl: string; facebookUrl: string; xUrl: string; websiteUrl: string } | null;
    status: string;
    suspensionReason: string | null;
    story: {
        aboutMe: string;
        yearStarted: number;
        impact: { jobs: number; customers: number; beneficiaries: number; communities: number; environmental: string[] };
        successStory: string;
    } | null;
    skills: string[];
    education: { type: string; institution: string; qualification: string; startYear: number; endYear: number }[];
    references: { type: string; refereeName: string; refereeTitle: string; refereeOrg: string; refereeEmail: string; refereePhone: string }[];
    memberships: { type: string; orgName: string; role: string; joinedYear: number }[];
    awards: { title: string; issuer: string; year: number; description: string | null }[];
    publicLinks: string[];
    profileScore: number;
    funding: { received: string[]; needAmount: { amount: number; currency: string } | null; needNote: string; supportNeeded: string[] };
    visibility: { journey: boolean; education: boolean; references: boolean; ventures: boolean; impact: boolean; funding: boolean; contact: boolean };
    vetted: boolean;
    featured: boolean;
    hasReceivedFunding: boolean;
    needFunding: boolean;
    createTime: string;
    updateTime: string;
}

/** Mirrors EntrepreneurModel.VentureSummary. */
export interface GatewayVenture {
    id: string; name: string; type: string; sector: string; stage: string; problem: string; solution: string;
    model: string; status: string; validation: string[]; registered: boolean; score: number; rating: string;
    jobs: number; customersReached: number; beneficiaries: number; communities: number; innovation: string;
}

/** Mirrors EntrepreneurModel.JourneySummary. */
export interface GatewayJourney {
    id: string; title: string; year: number; desc: string; lessonsLearned: string;
    biggestAchievements: string; biggestFailures: string;
}

export interface EntrepreneursFilters {
    query?: string;
    district?: string | null;
    skills?: string[];
    gender?: string | null;
    nationality?: string | null;
    featured?: boolean;
}

const AVATAR_PALETTE: [string, string][] = [
    ["#1B8E4A", "#0F6B36"], ["#2563C9", "#1B47A0"], ["#7A4DD0", "#5A33A8"],
    ["#E08A1E", "#C26A0E"], ["#D6456B", "#A82C4F"], ["#11998E", "#0B6E66"],
];

function paletteFor(id: string): [string, string] {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function skillLabel(value: string): string {
    return SKILL_OPTIONS.find((s) => s.value === value)?.label ?? fromEnumParam(value);
}

export function toVettedEntrepreneur(gw: GatewayEntrepreneurProfile): VettedEntrepreneur {
    const name = `${gw.firstName} ${gw.lastName}`.trim();
    const [c1, c2] = paletteFor(gw.id);
    return {
        id: gw.id,
        name,
        initials: toInitials(name),
        role: gw.story?.yearStarted ? `Entrepreneur since ${gw.story.yearStarted}` : "Vetted Entrepreneur",
        district: gw.district,
        logoInitial: gw.district.charAt(0).toUpperCase() || "N",
        c1,
        c2,
        photo: gw.profilePhotoUrl || undefined,
        short: gw.story?.aboutMe || gw.story?.successStory || "Vetted by NaWeHub.",
        skills: gw.skills.map(skillLabel),
        location: gw.currentLocation || gw.district,
        featured: gw.featured,
    };
}

function toVenture(gw: GatewayVenture): Venture {
    return {
        id: gw.id,
        name: gw.name,
        type: fromEnumParam(gw.type),
        sector: fromEnumParam(gw.sector),
        stage: fromEnumParam(gw.stage),
        problem: gw.problem,
        solution: gw.solution,
        customers: "",
        model: fromEnumParam(gw.model),
        status: fromEnumParam(gw.status),
        validation: gw.validation,
        registered: gw.registered,
        score: gw.score,
        rating: fromEnumParam(gw.rating),
        jobs: gw.jobs,
        customersReached: gw.customersReached,
        beneficiaries: gw.beneficiaries,
        innovation: fromEnumParam(gw.innovation),
    };
}

function toJourneyItem(gw: GatewayJourney): JourneyItem {
    return { id: gw.id, year: String(gw.year), title: gw.title, desc: gw.desc };
}

export function toEntrepreneurProfile(
    gw: GatewayEntrepreneurProfile,
    ventures: GatewayVenture[],
    journeys: GatewayJourney[],
): EntrepreneurProfile {
    const name = `${gw.firstName} ${gw.lastName}`.trim();
    const v = gw.visibility;

    return {
        name,
        headline: gw.story?.aboutMe ? gw.story.aboutMe.split("\n")[0] : "Vetted NaWeHub entrepreneur",
        pronouns: gw.pronoun || undefined,
        gender: fromEnumParam(gw.gender),
        dob: gw.dateOfBirth || undefined,
        nationality: gw.nationality,
        district: gw.district,
        chiefdom: gw.chiefdom || undefined,
        location: gw.currentLocation || gw.district,
        photo: gw.profilePhotoUrl || undefined,
        rating: gw.vetted ? "Vetted Entrepreneur" : "Entrepreneur",
        entrepreneurScore: gw.profileScore,
        verification: {
            national_id: { status: gw.vetted ? "verified" : "none", label: "National ID", desc: "Government photo ID" },
            selfie: { status: "none", label: "Selfie Verification", desc: "Liveness check" },
            email: { status: gw.vetted && gw.contactInfo?.email ? "verified" : "none", label: "Email Address", desc: "" },
            phone: { status: gw.vetted && gw.contactInfo?.phoneNumber ? "verified" : "none", label: "Phone Number", desc: "" },
            passport: { status: "none", label: "Passport", desc: "Optional", optional: true },
            voter_id: { status: "none", label: "Voter ID", desc: "Optional", optional: true },
        },
        about: gw.story?.aboutMe || "",
        journey: journeys.map(toJourneyItem),
        skills: gw.skills.map(skillLabel),
        education: gw.education.map((e, i) => ({
            id: `${gw.id}-edu-${i}`,
            title: e.qualification,
            org: e.institution,
            year: e.endYear ? `${e.startYear} – ${e.endYear}` : `${e.startYear}`,
        })),
        references: gw.references.map((r, i) => ({
            id: `${gw.id}-ref-${i}`,
            name: r.refereeName,
            role: r.refereeTitle,
            type: fromEnumParam(r.type),
        })),
        memberships: gw.memberships.map((m) => m.orgName),
        awards: gw.awards.map((a, i) => ({ id: `${gw.id}-award-${i}`, title: a.title, year: String(a.year) })),
        links: gw.publicLinks.map((url, i) => ({ id: `${gw.id}-link-${i}`, label: url, url })),
        ventures: ventures.map(toVenture),
        impact: gw.story?.impact
            ? { ...gw.story.impact, stories: gw.story.successStory || undefined }
            : { jobs: 0, customers: 0, beneficiaries: 0, communities: 0, environmental: [] },
        funding: {
            received: gw.funding.received,
            needAmount: gw.funding.needAmount ? `${gw.funding.needAmount.currency} ${gw.funding.needAmount.amount}` : "",
            needNote: gw.funding.needNote,
            supportNeeded: gw.funding.supportNeeded,
        },
        contact: {
            email: gw.contactInfo?.email || "",
            phone: gw.contactInfo?.phoneNumber || "",
            whatsapp: gw.contactInfo?.whatsappNumber || undefined,
            linkedin: gw.socialLinks?.linkedinUrl || undefined,
            facebook: gw.socialLinks?.facebookUrl || undefined,
            x: gw.socialLinks?.xUrl || undefined,
        },
        visibility: {
            about: true,
            skills: true,
            journey: v.journey,
            education: v.education,
            credibility: v.references,
            ventures: v.ventures,
            impact: v.impact,
            funding: v.funding,
            contact: v.contact,
        },
    };
}

function buildParams(filters: EntrepreneursFilters, pageSize: number, pageToken?: string) {
    const params = new URLSearchParams();
    if (filters.query?.trim()) params.set("query", filters.query.trim());
    if (filters.district) params.set("district", filters.district);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.nationality) params.set("nationality", filters.nationality);
    if (filters.featured !== undefined) params.set("featured", String(filters.featured));
    filters.skills?.forEach((s) => params.append("skills", s));
    params.set("pageSize", String(pageSize));
    if (pageToken) params.set("pageToken", pageToken);
    return params;
}

export const entrepreneursService = () => ({
    entrepreneurs: {
        list: async (
            filters: EntrepreneursFilters,
            pageSize = 8,
            pageToken?: string,
        ): Promise<PagedResponse<GatewayEntrepreneurProfile>> => {
            const params = buildParams(filters, pageSize, pageToken);
            const res = await fetch(`/api/entrepreneurs?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to load entrepreneurs");
            const page: PagedResponse<GatewayEntrepreneurProfile> = await res.json();
            // Defensive: the gateway's status/vetted filters have been observed to not
            // actually filter server-side (confirmed on /big-ideas), so this is a public-
            // listing safety net against showing unvetted/inactive profiles.
            return { ...page, items: page.items.filter((item) => item.status === "ACTIVE" && item.vetted) };
        },
        getPublicProfile: async (id: string): Promise<EntrepreneurProfile | null> => {
            const profileRes = await fetch(`/api/entrepreneurs/${id}`);
            if (profileRes.status === 404) return null;
            if (!profileRes.ok) throw new Error("Failed to load profile");
            const gw: GatewayEntrepreneurProfile = await profileRes.json();

            const [ventures, journeys] = await Promise.all([
                gw.visibility.ventures
                    ? fetch(`/api/entrepreneurs/${id}/ventures`).then((r) => (r.ok ? r.json() : []))
                    : Promise.resolve([]),
                gw.visibility.journey
                    ? fetch(`/api/entrepreneurs/${id}/journeys`).then((r) => (r.ok ? r.json() : []))
                    : Promise.resolve([]),
            ]);

            return toEntrepreneurProfile(gw, ventures, journeys);
        },
    },
});
