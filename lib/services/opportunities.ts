import {
    Award, BookOpen, Briefcase, Calendar, GraduationCap, Leaf, Rocket, Trophy, User, Users2, Zap,
} from "lucide-react";
import type { ElementType } from "react";
import type { EventItem, Opportunity } from "@/types/opportunities";
import type { PagedResponse } from "@/lib/gateway";

/** Mirrors OpportunityModel.OpportunitySummary on web-api-gateway. */
export interface GatewayOpportunity {
    id: string;
    title: string;
    categories: string[];
    categoryOther: string | null;
    description: string;
    organizationName: string;
    organizationTypes: string[];
    organizationTypeOther: string | null;
    targetBeneficiaries: string[];
    targetBeneficiaryOther: string | null;
    eligibilityCriteria: string | null;
    deadline: string;
    applicationLink: string;
    contactInfo: { email: string; phone: string; additionalContact: string | null };
    geographicScope: string;
    geographicScopeOther: string | null;
    flierUrl: string | null;
    status: string;
    declineReason: string | null;
    createTime: string;
    updateTime: string;
}

export interface CategoryAnalysis {
    category: string;
    opportunityCount: number;
}

export interface OpportunitiesFilters {
    searchQuery?: string;
    category?: string | null;
    targetBeneficiary?: string | null;
    geographicScope?: string | null;
}

const CATEGORY_ICON: Record<string, ElementType> = {
    GRANTS: Trophy,
    COMPETITIONS: Award,
    EVENTS: Calendar,
    TRAINING: GraduationCap,
    FELLOWSHIPS: Users2,
    SCHOLARSHIPS: BookOpen,
    INCUBATORS: Rocket,
    JOBS: Briefcase,
    CLIMATE: Leaf,
    WOMEN: User,
    YOUTH: Zap,
    OTHER: Trophy,
};

const CATEGORY_IMAGE: Record<string, string> = {
    GRANTS: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
    COMPETITIONS: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=400",
    EVENTS: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400",
    TRAINING: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400",
    FELLOWSHIPS: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400",
    SCHOLARSHIPS: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400",
    INCUBATORS: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400",
    JOBS: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400",
    CLIMATE: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400",
    WOMEN: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400",
    YOUTH: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=400",
    OTHER: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400",
};

export interface CategoryTile {
    id: string;
    label: string;
    icon: ElementType;
    iconBg: string;
    iconText: string;
    countColor: string;
    count: number;
}

const CATEGORY_META: Record<string, Omit<CategoryTile, "count">> = {
    GRANTS: { id: "grants", label: "Grants & Funding", icon: Trophy, iconBg: "bg-green-100", iconText: "text-green-600", countColor: "text-green-600" },
    COMPETITIONS: { id: "competitions", label: "Competitions", icon: Award, iconBg: "bg-yellow-100", iconText: "text-yellow-600", countColor: "text-yellow-600" },
    EVENTS: { id: "events", label: "Events & Conferences", icon: Calendar, iconBg: "bg-purple-100", iconText: "text-purple-600", countColor: "text-purple-600" },
    TRAINING: { id: "training", label: "Training & Workshops", icon: GraduationCap, iconBg: "bg-teal-100", iconText: "text-teal-600", countColor: "text-teal-600" },
    FELLOWSHIPS: { id: "fellowships", label: "Fellowships", icon: Users2, iconBg: "bg-blue-100", iconText: "text-blue-600", countColor: "text-blue-600" },
    SCHOLARSHIPS: { id: "scholarships", label: "Scholarships", icon: BookOpen, iconBg: "bg-red-100", iconText: "text-red-500", countColor: "text-red-500" },
    INCUBATORS: { id: "incubators", label: "Incubators & Accelerators", icon: Rocket, iconBg: "bg-indigo-100", iconText: "text-indigo-600", countColor: "text-indigo-600" },
    JOBS: { id: "jobs", label: "Jobs & Internships", icon: Briefcase, iconBg: "bg-sky-50", iconText: "text-sky-600", countColor: "text-slate-600" },
    CLIMATE: { id: "climate", label: "Climate & Circular Economy", icon: Leaf, iconBg: "bg-emerald-100", iconText: "text-emerald-600", countColor: "text-emerald-600" },
    WOMEN: { id: "women", label: "Women Opportunities", icon: User, iconBg: "bg-pink-100", iconText: "text-pink-600", countColor: "text-pink-600" },
    YOUTH: { id: "youth", label: "Youth Innovation", icon: Zap, iconBg: "bg-orange-100", iconText: "text-orange-600", countColor: "text-orange-600" },
    OTHER: { id: "other", label: "Other Opportunities", icon: Trophy, iconBg: "bg-slate-100", iconText: "text-slate-600", countColor: "text-slate-600" },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_META);

/** Builds the "Explore by Category" tiles entirely from the /opportunities/analysis response. */
export function toCategoryTiles(analysis: CategoryAnalysis[]): CategoryTile[] {
    return analysis
        .filter((c) => c.opportunityCount > 0)
        .map((c) => {
            const meta = CATEGORY_META[c.category] ?? {
                id: c.category.toLowerCase(),
                label: titleCase(c.category),
                icon: Trophy,
                iconBg: "bg-slate-100",
                iconText: "text-slate-600",
                countColor: "text-slate-600",
            };
            return { ...meta, count: c.opportunityCount };
        })
        .sort((a, b) => {
            const ai = CATEGORY_ORDER.indexOf(a.id.toUpperCase());
            const bi = CATEGORY_ORDER.indexOf(b.id.toUpperCase());
            return (ai === -1 ? CATEGORY_ORDER.length : ai) - (bi === -1 ? CATEGORY_ORDER.length : bi);
        });
}

function titleCase(value: string): string {
    return value
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

function urgencyFromDeadline(deadline: string): { urgencyBadge?: string; urgencyColor?: string } {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (Number.isNaN(days) || days < 0) return {};
    if (days <= 7) return { urgencyBadge: `${days} DAY${days === 1 ? "" : "S"} LEFT`, urgencyColor: "bg-[hsl(var(--color-error))]" };
    if (days <= 30) {
        const weeks = Math.max(1, Math.round(days / 7));
        return { urgencyBadge: `${weeks} WEEK${weeks === 1 ? "" : "S"} LEFT`, urgencyColor: "bg-[hsl(var(--color-warning))]" };
    }
    return {};
}

function formatDeadline(deadline: string): string {
    const d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function toOpportunity(gw: GatewayOpportunity): Opportunity {
    const primaryCategory = gw.categories[0] ?? "OTHER";
    const isNew = (Date.now() - new Date(gw.createTime).getTime()) < 14 * 24 * 60 * 60 * 1000;

    return {
        id: gw.id,
        title: gw.title,
        type: titleCase(primaryCategory),
        location: titleCase(gw.geographicScope),
        description: gw.description,
        deadline: formatDeadline(gw.deadline),
        deadlineISO: gw.deadline,
        image: gw.flierUrl || CATEGORY_IMAGE[primaryCategory] || CATEGORY_IMAGE.OTHER,
        isNew,
        applyLabel: "Apply Now",
        officialUrl: gw.applicationLink,
        provider: gw.organizationName,
        postedDate: formatDeadline(gw.createTime),
        eligibility: gw.eligibilityCriteria
            ? gw.eligibilityCriteria.split(/\r?\n|;/).map((s) => s.trim()).filter(Boolean)
            : [],
        benefits: [],
        applicationSteps: [],
        typeIcon: CATEGORY_ICON[primaryCategory] || Trophy,
        ...urgencyFromDeadline(gw.deadline),
    };
}

const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function toEventItem(gw: GatewayOpportunity): EventItem {
    const d = new Date(gw.deadline);
    const hasDate = !Number.isNaN(d.getTime());
    return {
        id: gw.id,
        month: hasDate ? MONTH_ABBR[d.getMonth()] : "",
        day: hasDate ? d.getDate() : 0,
        title: gw.title,
        time: hasDate ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "",
        format: "",
        location: titleCase(gw.geographicScope),
    };
}

function buildParams(filters: OpportunitiesFilters, pageSize: number, pageToken?: string, ascending?: boolean) {
    const params = new URLSearchParams();
    if (filters.searchQuery?.trim()) params.set("searchQuery", filters.searchQuery.trim());
    if (filters.category) params.append("categories", filters.category);
    if (filters.targetBeneficiary) params.append("targetBeneficiaries", filters.targetBeneficiary);
    if (filters.geographicScope) params.set("geographicScope", filters.geographicScope);
    params.set("pageSize", String(pageSize));
    if (pageToken) params.set("pageToken", pageToken);
    if (ascending !== undefined) params.set("ascending", String(ascending));
    return params;
}

export const opportunitiesService = () => ({
    list: async (
        filters: OpportunitiesFilters,
        pageSize = 8,
        pageToken?: string,
        ascending = false,
    ): Promise<PagedResponse<GatewayOpportunity>> => {
        const params = buildParams(filters, pageSize, pageToken, ascending);
        const res = await fetch(`/api/opportunities?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load opportunities");
        const page: PagedResponse<GatewayOpportunity> = await res.json();
        // Defensive: the gateway's status=APPROVED filter has been observed to not
        // actually filter server-side (confirmed on /big-ideas), so this is a public-
        // listing safety net against showing unreviewed submissions.
        return { ...page, items: page.items.filter((item) => item.status === "APPROVED") };
    },
    getOne: async (id: string): Promise<GatewayOpportunity> => {
        const res = await fetch(`/api/opportunities/${id}`);
        if (!res.ok) throw new Error("Failed to load opportunity");
        return res.json();
    },
    getCategoryAnalysis: async (): Promise<CategoryAnalysis[]> => {
        const res = await fetch("/api/opportunities/analysis");
        if (!res.ok) throw new Error("Failed to load category analysis");
        return res.json();
    },
    getUpcomingEvents: async (pageSize = 10): Promise<GatewayOpportunity[]> => {
        const params = buildParams({ category: "EVENTS" }, pageSize);
        const res = await fetch(`/api/opportunities?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load events");
        const page: PagedResponse<GatewayOpportunity> = await res.json();
        return page.items.filter((item) => item.status === "APPROVED");
    },
});
