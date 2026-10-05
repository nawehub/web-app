import type { IdeaTrackingSummary } from "@/types/idea-submission";

export class IdeaNotFoundError extends Error {
    constructor() {
        super("We couldn't find an idea with that tracking ID. Double-check it and try again.");
        this.name = "IdeaNotFoundError";
    }
}

export const ideaSubmissionService = () => ({
    getByTrackingId: async (trackingId: string): Promise<IdeaTrackingSummary> => {
        const res = await fetch(`/api/big-ideas/by-tracking-id/${encodeURIComponent(trackingId.trim())}`);
        if (res.status === 404 || res.status === 400) throw new IdeaNotFoundError();
        if (!res.ok) throw new Error("Something went wrong while looking up your idea. Please try again.");
        return res.json();
    },
});
