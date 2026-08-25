export interface NextBigIdea {
    id: string;
    title: string;
    founder: string;
    district: string;
    oneLineDescription: string;
    description: string;
    coverImage: string;
    stage: string;
    stageValue: string;
    testedWithCustomers: boolean;
    problemStatement: string;
    proposedSolution: string;
    targetCustomers: string;
    marketSize: string;
    innovationDescription: string;
    growthPlan: string;
}

export const STAGE_COLORS: Record<string, string> = {
    CONCEPT_ONLY: "bg-slate-500",
    RESEARCH_COMPLETED: "bg-blue-600",
    PROTOTYPE_DEVELOPED: "bg-amber-500",
    TESTING_PILOT: "bg-purple-600",
    ALREADY_OPERATING: "bg-emerald-600",
};
