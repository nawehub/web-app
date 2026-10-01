import { format } from "date-fns";
import type { OpportunitySubmissionForm, OpportunitySubmissionResponse, OpportunityTrackingSummary } from "@/types/opportunity-submission";

const ISO_DATE = "yyyy-MM-dd";

/**
 * Builds the exact multipart body web-api-gateway's `POST /api/v1/opportunities`
 * expects: an `opportunity` part typed as JSON (so Spring can bind it to
 * `OpportunityDto.CreateOpportunityDto`), and an optional `flier` file part.
 */
function toFormData(data: OpportunitySubmissionForm, flier: File | null): FormData {
    const opportunity = {
        title: data.title,
        categories: data.categories,
        categoryOther: data.categoryOther || undefined,
        description: data.description,
        organizationName: data.organizationName,
        organizationTypes: data.organizationTypes,
        organizationTypeOther: data.organizationTypeOther || undefined,
        targetBeneficiaries: data.targetBeneficiaries,
        targetBeneficiaryOther: data.targetBeneficiaryOther || undefined,
        eligibilityCriteria: data.eligibilityCriteria || undefined,
        // The deadline is the last day to apply - send the end of that day as an ISO instant.
        deadline: `${format(data.deadline, ISO_DATE)}T23:59:59Z`,
        applicationLink: data.applicationLink,
        contactInfo: {
            email: data.contactEmail,
            phone: data.contactPhone,
            additionalContact: data.additionalContact || undefined,
        },
        geographicScope: data.geographicScope,
        geographicScopeOther: data.geographicScopeOther || undefined,
        submittedBy: data.submittedBy,
        submitterEmail: data.submitterEmail,
        createNawehubAccount: data.createNawehubAccount,
    };

    const formData = new FormData();
    formData.append("opportunity", new Blob([JSON.stringify(opportunity)], { type: "application/json" }));
    if (flier) formData.append("flier", flier);
    return formData;
}

export const opportunitySubmissionService = () => ({
    submit: async (data: OpportunitySubmissionForm, flier: File | null): Promise<OpportunitySubmissionResponse> => {
        const res = await fetch("/api/opportunities", {
            method: "POST",
            body: toFormData(data, flier),
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body?.message || "Submission failed. Please check your details and try again.");
        }
        return body;
    },
    getByTrackingId: async (trackingId: string): Promise<OpportunityTrackingSummary> => {
        const res = await fetch(`/api/opportunities/by-tracking-id/${encodeURIComponent(trackingId.trim())}`);
        const body = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(
                res.status === 404 || res.status === 400
                    ? "No opportunity matches that tracking ID. Please check it and try again."
                    : body?.message || "Couldn't look up that tracking ID right now. Please try again.",
            );
        }
        return body;
    },
});
