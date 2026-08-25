import { z } from "zod";
import { ClipboardList, Building2, Users, Image as ImageIcon, Send } from "lucide-react";

/**
 * Public opportunity submission wizard. Mirrors web-api-gateway's
 * `OpportunityDto.CreateOpportunityDto` field-for-field so the payload this
 * form builds needs no guesswork to match what `POST /api/v1/opportunities`
 * (multipart: `opportunity` JSON part + optional `flier` file part) accepts.
 */
export const opportunitySubmissionSchema = z
    .object({
        title: z.string({ message: "Opportunity title is required" }).min(5, "Title must be at least 5 characters").max(150, "Title must be at most 150 characters"),
        categories: z.array(z.string()).min(1, "Select at least one category").max(9, "Select at most 9 categories"),
        categoryOther: z.string().optional(),
        description: z.string({ message: "Description is required" }).min(20, "Description must be at least 20 characters").max(5000, "Description must be at most 5000 characters"),

        organizationName: z.string({ message: "Organization name is required" }).min(2, "Organization name is required").max(120, "Organization name must be at most 120 characters"),
        organizationTypes: z.array(z.string()).min(1, "Select at least one organization type").max(6, "Select at most 6 organization types"),
        organizationTypeOther: z.string().optional(),

        targetBeneficiaries: z.array(z.string()).min(1, "Select at least one target beneficiary").max(6, "Select at most 6 target beneficiaries"),
        targetBeneficiaryOther: z.string().optional(),
        eligibilityCriteria: z.string().max(2000, "Max length is 2000 characters").optional(),
        deadline: z.date({ message: "Application deadline is required" }),

        applicationLink: z.string({ message: "Application link is required" }).url("Enter a valid URL starting with http:// or https://"),
        contactEmail: z.string({ message: "Contact email is required" }).email("Enter a valid email address"),
        contactPhone: z.string({ message: "Contact phone is required" }).min(7, "Enter a valid phone number").max(20, "Phone number is too long"),
        additionalContact: z.string().max(200, "Max length is 200 characters").optional(),

        geographicScope: z.string({ message: "Geographic scope is required" }).min(1, "Select a geographic scope"),
        geographicScopeOther: z.string().optional(),

        submittedBy: z.string({ message: "Your name is required" }).min(2, "Your name must be at least 2 characters").max(100, "Your name must be at most 100 characters"),
        declared: z.boolean(),
    })
    .refine((data) => !data.categories.includes("OTHER") || !!data.categoryOther?.trim(), {
        message: "Please specify the custom category",
        path: ["categoryOther"],
    })
    .refine((data) => !data.organizationTypes.includes("OTHER") || !!data.organizationTypeOther?.trim(), {
        message: "Please specify the custom organization type",
        path: ["organizationTypeOther"],
    })
    .refine((data) => !data.targetBeneficiaries.includes("OTHER") || !!data.targetBeneficiaryOther?.trim(), {
        message: "Please specify the custom target beneficiary group",
        path: ["targetBeneficiaryOther"],
    })
    .refine((data) => data.geographicScope !== "OTHER" || !!data.geographicScopeOther?.trim(), {
        message: "Please specify the custom geographic scope",
        path: ["geographicScopeOther"],
    })
    .refine((data) => data.declared, {
        message: "Please confirm the declaration before submitting",
        path: ["declared"],
    });

export type OpportunitySubmissionForm = z.infer<typeof opportunitySubmissionSchema>;

export const opportunitySubmissionDefaults: Partial<OpportunitySubmissionForm> = {
    title: "",
    categories: [],
    categoryOther: "",
    description: "",
    organizationName: "",
    organizationTypes: [],
    organizationTypeOther: "",
    targetBeneficiaries: [],
    targetBeneficiaryOther: "",
    eligibilityCriteria: "",
    applicationLink: "",
    contactEmail: "",
    contactPhone: "",
    additionalContact: "",
    geographicScope: "",
    geographicScopeOther: "",
    submittedBy: "",
    declared: false,
};

export const OPPORTUNITY_WIZARD_STEPS = [
    { id: "details", title: "Opportunity Details", description: "What is this opportunity about", icon: ClipboardList },
    { id: "provider", title: "Provider & Eligibility", description: "Who is offering it and who can apply", icon: Building2 },
    { id: "contact", title: "Contact & Reach", description: "How applicants get in touch", icon: Users },
    { id: "media", title: "Banner & Submitter", description: "Add a banner and your details", icon: ImageIcon },
    { id: "review", title: "Review & Submit", description: "Check everything before you submit", icon: Send },
] as const;

/** Mirrors OpportunityModel.OpportunitySummary as returned by a successful create. */
export interface OpportunitySubmissionResponse {
    id: string;
    title: string;
    status: string;
    createTime: string;
}
