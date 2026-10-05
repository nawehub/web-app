/** Mirrors web-api-gateway's CompetitionModel.CompetitionView (public view). */
export type CompetitionState = "PUBLISHED" | "SHORTLISTING" | "PITCH_VIDEO" | "FINALS" | "COMPLETED" | "CANCELLED";

export interface Competition {
    id: string;
    title: string;
    tagline: string | null;
    description: string;
    eligibilityRequirements: string;
    eligibleIdeaStages: string[];
    applicationOpensAt: string;
    applicationClosesAt: string;
    pitchVideoDeadline: string;
    totalFinalists: number;
    evaluationCriteria: { id: string; name: string; description: string | null; weight: number }[];
    finalPitch: { format: "PHYSICAL" | "VIRTUAL" | null; venue: string | null; scheduledAt: string | null } | null;
    prizes: { rank: number; title: string; description: string | null }[];
    state: CompetitionState;
    cancelReason: string | null;
    stats: { submitted: number; shortlisted: number; pitchVideos: number; finalists: number; winners: number };
}

export interface CompetitionEntrant {
    applicationId: string;
    ideaId: string;
    idea: { ideaName: string; oneLineDescription: string | null; stage: string | null; applicantName: string | null; applicantLocation: string | null };
    state: string;
    winnerRank: number | null;
}

export interface CompetitionEntrants {
    shortlisted: CompetitionEntrant[];
    finalists: CompetitionEntrant[];
    winners: CompetitionEntrant[];
}

export interface CompetitionPage {
    items: Competition[];
    nextPageToken: string | null;
    totalCount: number;
}

/** Where entrepreneurs apply: the Entrepreneur Portal. */
export const PORTAL_COMPETITIONS_URL = "https://app.nawehub.com/competitions";
