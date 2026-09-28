import type { IdeaSubmissionForm, IdeaSubmissionResponse, IdeaTrackingSummary } from "@/types/idea-submission";

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const key of Object.keys(obj) as (keyof T)[]) {
        const value = obj[key];
        if (value === "" || value === undefined) continue;
        out[key] = value;
    }
    return out;
}

/**
 * Builds the JSON body web-api-gateway expects for an idea (`IdeaDto.CreateIdeaDto`) - the
 * optional free-text fields are dropped when blank rather than sent as empty strings.
 */
function toIdeaPayload(data: IdeaSubmissionForm) {
    // createNawehubAccount is a submission option, not part of the idea.
    const { applicant, createNawehubAccount: _createNawehubAccount, ...rest } = data;
    return {
        ...omitEmpty(rest as Record<string, unknown>),
        applicant: { ...omitEmpty(applicant as unknown as Record<string, unknown>), age: Number(applicant.age) },
    };
}

export class IdeaNotFoundError extends Error {
    constructor() {
        super("We couldn't find an idea with that tracking ID. Double-check it and try again.");
        this.name = "IdeaNotFoundError";
    }
}

export const ideaSubmissionService = () => ({
    /**
     * Public submission (no account needed) - one multipart request to web-api-gateway's
     * POST /api/v1/big-ideas/submissions: the idea as a JSON part plus the optional file.
     * The idea goes straight to review and the submitter is emailed a tracking ID.
     */
    submit: async (
        data: IdeaSubmissionForm,
        material?: { file: File; materialType: string } | null,
    ): Promise<IdeaSubmissionResponse> => {
        const form = new FormData();
        form.append("idea", new Blob([JSON.stringify(toIdeaPayload(data))], { type: "application/json" }));
        const params = new URLSearchParams();
        if (data.createNawehubAccount) params.set("createNawehubAccount", "true");
        if (material) {
            form.append("material", material.file);
            params.set("materialType", material.materialType);
        }
        const res = await fetch(`/api/big-ideas/submissions?${params.toString()}`, { method: "POST", body: form });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body?.message || "Submission failed. Please check your details and try again.");
        }
        return body;
    },

    getByTrackingId: async (trackingId: string): Promise<IdeaTrackingSummary> => {
        const res = await fetch(`/api/big-ideas/by-tracking-id/${encodeURIComponent(trackingId.trim())}`);
        if (res.status === 404 || res.status === 400) throw new IdeaNotFoundError();
        if (!res.ok) throw new Error("Something went wrong while looking up your idea. Please try again.");
        return res.json();
    },
});
