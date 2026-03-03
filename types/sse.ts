// ─── Money ───────────────────────────────────────────────────────────────────
export interface MoneyPayload {
  amount: number;
  currency: string;
}

// ─── Top Contributors ─────────────────────────────────────────────────────────
export interface ContributorPayload {
  contributorId: string;
  firstName: string;
  lastName: string;
  nationality: string;
  anonymous: boolean;
  totalContributions: MoneyPayload;
  totalContributionsCount: number;
}

export interface TopContributorsPayload {
  occurredAt: number;
  contributors: ContributorPayload[];
}

// ─── District Rankings ────────────────────────────────────────────────────────
export interface DistrictRankingPayload {
  districtId: string;
  districtName: string;
  totalContributors: number;
  totalContributions: MoneyPayload;
}

export interface DistrictRankingsPayload {
  occurredAt: number;
  rankings: DistrictRankingPayload[];
}

// ─── Payment Events ───────────────────────────────────────────────────────────
export interface PaymentInstruction {
  title: string;
  steps: string[];
  expiryMessage: string;
}

export interface PaymentDetail {
  type: "PAYMENT_CODE" | "CHECKOUT_SESSION";
  actionUrlCode: string;
  expiresInSeconds: number;
  expiresAt: number;
  instruction?: PaymentInstruction; // only for PAYMENT_CODE
}

export interface PaymentAttachedPayload {
  contributionId: string;
  status: string; // PAYMENT_PENDING
  payment: PaymentDetail;
}

export interface PaymentTerminalPayload {
  contributionId: string;
  type: "PAYMENT_CODE" | "CHECKOUT_SESSION";
  status: "PAYMENT_COMPLETED" | "PAYMENT_CANCELLED" | "PAYMENT_FAILED" | "PAYMENT_EXPIRED";
}

// ─── SSE Event discriminated union ───────────────────────────────────────────
export type SseEventType =
  | "contribution.top.contributors"
  | "contribution.district.rankings"
  | "contribution.payment.attached"
  | "contribution.payment.terminal";

export const TOP_CONTRIBUTORS_EVENT_TYPE = "contribution.top.contributors";
export const DISTRICT_RANKINGS_EVENT_TYPE = "contribution.district.rankings";
export const PAYMENT_ATTACHED_EVENT_TYPE = "contribution.payment.attached";
export const PAYMENT_TERMINAL_EVENT_TYPE = "contribution.payment.terminal";

export type SseEvent =
  | { type: "contribution.top.contributors"; data: TopContributorsPayload }
  | { type: "contribution.district.rankings"; data: DistrictRankingsPayload }
  | { type: "contribution.payment.attached"; data: PaymentAttachedPayload }
  | { type: "contribution.payment.terminal"; data: PaymentTerminalPayload };
