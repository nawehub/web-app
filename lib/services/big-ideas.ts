import type { PagedResponse } from "@/lib/gateway";
import { ideaStageFromParam, ideaStageToParam } from "@/lib/gateway-enums";
import type { NextBigIdea } from "@/types/next-big-idea";

/** Mirrors IdeaModel.IdeaSummary on web-api-gateway. */
export interface GatewayIdea {
    id: string;
    applicant: {
        fullName: string;
        gender: string;
        age: number;
        location: string;
        occupation: string;
        submissionType: string;
    };
    ideaName: string;
    oneLineDescription: string;
    description: string;
    problemStatement: string;
    problemAudience: string;
    currentSolution: string;
    proposedSolution: string;
    innovationDescription: string;
    inspiration: string;
    targetCustomers: string;
    customerLocation: string;
    marketSize: string;
    competitors: string;
    competitiveAdvantage: string;
    revenueModel: string;
    productOrService: string;
    pricingStrategy: string;
    mainCosts: string;
    startupCapitalNeeded: string;
    firstYearRevenueEstimate: string;
    potentialPartners: string;
    stage: string;
    testedWithCustomers: boolean;
    testingLearnings: string;
    existingResources: string;
    challengesAndRisks: string;
    riskMitigationPlan: string;
    socialImpact: string;
    environmentalImpact: string;
    estimatedJobsCreated: string;
    growthPlan: string;
    whySelected: string;
    supportingMaterials: { type: string; url: string; uploadedAt: string }[];
    status: string;
    declineReason: string | null;
    createTime: string;
    updateTime: string;
}

export interface BigIdeasFilters {
    searchQuery?: string;
    stage?: string | null;
}

const PLACEHOLDER_COVER = "/placeholder.jpg";

export function toNextBigIdea(gw: GatewayIdea): NextBigIdea {
    const photo = gw.supportingMaterials.find((m) => m.url)?.url;
    return {
        id: gw.id,
        title: gw.ideaName,
        founder: gw.applicant.fullName,
        district: gw.applicant.location,
        oneLineDescription: gw.oneLineDescription,
        description: gw.description,
        coverImage: photo || PLACEHOLDER_COVER,
        stage: ideaStageFromParam(gw.stage),
        stageValue: gw.stage,
        testedWithCustomers: gw.testedWithCustomers,
        problemStatement: gw.problemStatement,
        proposedSolution: gw.proposedSolution,
        targetCustomers: gw.targetCustomers,
        marketSize: gw.marketSize,
        innovationDescription: gw.innovationDescription,
        growthPlan: gw.growthPlan,
    };
}

function buildParams(filters: BigIdeasFilters, pageSize: number, pageToken?: string, ascending?: boolean) {
    const params = new URLSearchParams();
    if (filters.searchQuery?.trim()) params.set("searchQuery", filters.searchQuery.trim());
    if (filters.stage) params.set("stage", ideaStageToParam(filters.stage));
    params.set("pageSize", String(pageSize));
    if (pageToken) params.set("pageToken", pageToken);
    if (ascending !== undefined) params.set("ascending", String(ascending));
    return params;
}

export const bigIdeasService = () => ({
    list: async (
        filters: BigIdeasFilters,
        pageSize = 9,
        pageToken?: string,
        ascending = false,
    ): Promise<PagedResponse<GatewayIdea>> => {
        const params = buildParams(filters, pageSize, pageToken, ascending);
        const res = await fetch(`/api/big-ideas?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load ideas");
        const page: PagedResponse<GatewayIdea> = await res.json();
        // Defensive: the gateway's status=APPROVED filter has been observed to not
        // actually filter server-side, so this is a public-listing safety net against
        // showing unreviewed submissions, not just belt-and-braces.
        return { ...page, items: page.items.filter((item) => item.status === "APPROVED") };
    },
    getOne: async (id: string): Promise<GatewayIdea> => {
        const res = await fetch(`/api/big-ideas/${id}`);
        if (!res.ok) throw new Error("Failed to load idea");
        return res.json();
    },
});
