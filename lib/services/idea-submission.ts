import type { IdeaSubmissionForm, IdeaSubmissionResponse } from "@/types/idea-submission";

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
 * Builds the exact JSON body web-api-gateway's `POST /api/v1/big-ideas`
 * expects (`IdeaDto.CreateIdeaDto`) - all the optional free-text fields are
 * dropped when blank rather than sent as empty strings.
 */
function toPayload(data: IdeaSubmissionForm) {
    const { applicant, ...rest } = data;
    return {
        ...omitEmpty(rest as Record<string, unknown>),
        applicant: { ...omitEmpty(applicant as unknown as Record<string, unknown>), age: Number(applicant.age) },
    };
}

export const ideaSubmissionService = () => ({
    submit: async (data: IdeaSubmissionForm): Promise<IdeaSubmissionResponse> => {
        const res = await fetch("/api/big-ideas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toPayload(data)),
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body?.message || "Submission failed. Please check your details and try again.");
        }
        return body;
    },
    attachSupportingMaterial: async (ideaId: string, materialType: string, file: File): Promise<IdeaSubmissionResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`/api/big-ideas/${ideaId}/supporting-material?materialType=${encodeURIComponent(materialType)}`, {
            method: "POST",
            body: formData,
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body?.message || "Failed to attach the supporting material.");
        }
        return body;
    },
});
