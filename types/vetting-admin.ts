export type VettingStatus = "pending" | "review" | "approved" | "changes" | "rejected";

export type CheckStatus = "pending" | "approved" | "rejected";

export type TrustKey =
    | "identity"
    | "references"
    | "activity"
    | "venture"
    | "community"
    | "impact";

export interface VettingTrust {
    identity: number;
    references: number;
    activity: number;
    venture: number;
    community: number;
    impact: number;
}

export interface VettingChecks {
    national_id: CheckStatus;
    selfie: CheckStatus;
    contact: CheckStatus;
    references: CheckStatus;
    business: CheckStatus;
}

export interface VettingCase {
    id: string;
    status: VettingStatus;
    submitted: string;
    priority: boolean;
    trust: VettingTrust;
    entRating: string;
    checks: VettingChecks;
    venRatings: Record<string, string>;
    notes: string;
    reviewer?: string;
}

export type VettingFilter = "all" | VettingStatus | "featured";

export interface TrustWeight {
    k: TrustKey;
    label: string;
    w: number;
    desc: string;
}

export interface CheckItem {
    k: keyof VettingChecks;
    label: string;
    kind: string;
    hint: string;
}

export interface StatusMeta {
    label: string;
    cls: VettingStatus | "pending" | "review" | "approved" | "changes" | "rejected";
}
