import { z } from "zod";
import { User, Lightbulb, TrendingUp, Rocket, Send } from "lucide-react";

/**
 * Public "Next Big Idea" submission wizard. Mirrors web-api-gateway's
 * `IdeaDto.CreateIdeaDto` (incl. the nested `applicant` object) field-for-field
 * so the payload this form builds needs no guesswork to match what
 * `POST /api/v1/big-ideas` (plain JSON) accepts. Character limits below are
 * copied from the upstream `idea.proto` CEL validation rules so submissions
 * don't get rejected server-side.
 */
export const ideaSubmissionSchema = z.object({
    applicant: z.object({
        fullName: z.string({ message: "Full name is required" }).min(2, "Full name must be at least 2 characters").max(150, "Full name must be at most 150 characters"),
        gender: z.string({ message: "Gender is required" }).min(1, "Select a gender"),
        age: z.string({ message: "Age is required" }).refine((v) => {
            const n = Number(v);
            return Number.isInteger(n) && n >= 1 && n <= 120;
        }, "Age must be a whole number between 1 and 120"),
        phone: z.string({ message: "Phone number is required" }).min(7, "Enter a valid phone number").max(20, "Phone number is too long"),
        email: z.string({ message: "Email is required" }).email("Enter a valid email address"),
        location: z.string({ message: "Location is required" }).min(2, "Location must be at least 2 characters").max(150, "Location must be at most 150 characters"),
        occupation: z.string({ message: "Occupation is required" }).min(2, "Occupation must be at least 2 characters").max(150, "Occupation must be at most 150 characters"),
        submissionType: z.string({ message: "Submission type is required" }).min(1, "Select a submission type"),
    }),

    ideaName: z.string({ message: "Idea name is required" }).min(3, "Idea name must be at least 3 characters").max(150, "Idea name must be at most 150 characters"),
    oneLineDescription: z.string({ message: "A one-line description is required" }).min(10, "Must be at least 10 characters").max(200, "Must be at most 200 characters"),
    description: z.string({ message: "Description is required" }).min(20, "Description must be at least 20 characters").max(5000, "Description must be at most 5000 characters"),
    problemStatement: z.string({ message: "Problem statement is required" }).min(10, "Must be at least 10 characters").max(3000, "Must be at most 3000 characters"),
    problemAudience: z.string().max(2000, "Max length is 2000 characters").optional(),
    currentSolution: z.string().max(2000, "Max length is 2000 characters").optional(),
    proposedSolution: z.string({ message: "Proposed solution is required" }).min(10, "Must be at least 10 characters").max(3000, "Must be at most 3000 characters"),
    innovationDescription: z.string().max(2000, "Max length is 2000 characters").optional(),
    inspiration: z.string().max(2000, "Max length is 2000 characters").optional(),

    targetCustomers: z.string({ message: "Target customers is required" }).min(5, "Must be at least 5 characters").max(2000, "Must be at most 2000 characters"),
    customerLocation: z.string().max(1000, "Max length is 1000 characters").optional(),
    marketSize: z.string().max(2000, "Max length is 2000 characters").optional(),
    competitors: z.string().max(2000, "Max length is 2000 characters").optional(),
    competitiveAdvantage: z.string().max(2000, "Max length is 2000 characters").optional(),

    revenueModel: z.string({ message: "Revenue model is required" }).min(5, "Must be at least 5 characters").max(2000, "Must be at most 2000 characters"),
    productOrService: z.string().max(2000, "Max length is 2000 characters").optional(),
    pricingStrategy: z.string().max(1000, "Max length is 1000 characters").optional(),
    mainCosts: z.string().max(2000, "Max length is 2000 characters").optional(),
    startupCapitalNeeded: z.string().max(500, "Max length is 500 characters").optional(),
    firstYearRevenueEstimate: z.string().max(500, "Max length is 500 characters").optional(),
    potentialPartners: z.string().max(2000, "Max length is 2000 characters").optional(),

    stage: z.string({ message: "Stage is required" }).min(1, "Select a stage"),
    testedWithCustomers: z.boolean(),
    testingLearnings: z.string().max(2000, "Max length is 2000 characters").optional(),
    existingResources: z.string().max(2000, "Max length is 2000 characters").optional(),
    challengesAndRisks: z.string().max(2000, "Max length is 2000 characters").optional(),
    riskMitigationPlan: z.string().max(2000, "Max length is 2000 characters").optional(),

    socialImpact: z.string().max(2000, "Max length is 2000 characters").optional(),
    environmentalImpact: z.string().max(2000, "Max length is 2000 characters").optional(),
    estimatedJobsCreated: z.string().max(500, "Max length is 500 characters").optional(),
    growthPlan: z.string().max(2000, "Max length is 2000 characters").optional(),
    whySelected: z.string().max(2000, "Max length is 2000 characters").optional(),
});

export type IdeaSubmissionForm = z.infer<typeof ideaSubmissionSchema>;

export const ideaSubmissionDefaults: Partial<IdeaSubmissionForm> = {
    applicant: {
        fullName: "", gender: "", age: "", phone: "", email: "",
        location: "", occupation: "", submissionType: "",
    },
    ideaName: "", oneLineDescription: "", description: "", problemStatement: "",
    problemAudience: "", currentSolution: "", proposedSolution: "", innovationDescription: "", inspiration: "",
    targetCustomers: "", customerLocation: "", marketSize: "", competitors: "", competitiveAdvantage: "",
    revenueModel: "", productOrService: "", pricingStrategy: "", mainCosts: "",
    startupCapitalNeeded: "", firstYearRevenueEstimate: "", potentialPartners: "",
    stage: "", testedWithCustomers: false, testingLearnings: "", existingResources: "",
    challengesAndRisks: "", riskMitigationPlan: "",
    socialImpact: "", environmentalImpact: "", estimatedJobsCreated: "", growthPlan: "", whySelected: "",
};

export const IDEA_WIZARD_STEPS = [
    { id: "applicant", title: "About You", description: "Tell us who's submitting this idea", icon: User },
    { id: "idea", title: "The Idea", description: "What is the idea and problem it solves", icon: Lightbulb },
    { id: "market", title: "Market & Business", description: "Customers, competition and revenue", icon: TrendingUp },
    { id: "readiness", title: "Readiness & Impact", description: "How far along it is and its impact", icon: Rocket },
    { id: "review", title: "Review & Submit", description: "Check everything before you submit", icon: Send },
] as const;

/** Mirrors IdeaModel.IdeaSummary as returned by a successful create. */
export interface IdeaSubmissionResponse {
    id: string;
    ideaName: string;
    status: string;
    createTime: string;
}
