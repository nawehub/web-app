/**
 * Public tracking of ideas submitted on the website before submissions moved to the Entrepreneur
 * Portal. New ideas are created by signed-in entrepreneurs only.
 */

/** Mirrors IdeaModel.IdeaTrackingSummary on web-api-gateway - what a tracking ID reveals. */
export interface IdeaTrackingSummary {
    trackingId: string;
    ideaName: string;
    oneLineDescription: string;
    applicantName: string;
    stage: string;
    /** PENDING, PUBLISHED, IN_REVIEW, APPROVED or DECLINED */
    status: string;
    declineReason: string | null;
    supportingMaterialTypes: string[];
    /** Set once approved - the idea's public page is /next-big-idea/{publicIdeaId}. */
    publicIdeaId: string | null;
    createTime: string;
    updateTime: string;
}
