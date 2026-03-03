// ─── Shared ───────────────────────────────────────────────────────────────────

export interface MoneyPayload {
  amount: number
  currency: string
}

// ─── Global leaderboard events ────────────────────────────────────────────────

export interface ContributorPayload {
  contributorId: string
  firstName: string
  lastName: string
  nationality: string
  anonymous: boolean
  totalContributions: MoneyPayload
  totalContributionsCount: number
}

export interface TopContributorsPayload {
  occurredAt: number
  contributors: ContributorPayload[]
}

export interface DistrictRankingPayload {
  districtId: string
  districtName: string
  totalContributors: number
  totalContributions: MoneyPayload
}

export interface DistrictRankingsPayload {
  occurredAt: number
  rankings: DistrictRankingPayload[]
}

// ─── Per-contribution payment events ─────────────────────────────────────────

export interface PaymentInstruction {
  title: string
  steps: string[]
  expiryMessage: string
}

export interface PaymentDetail {
  type: "PAYMENT_CODE" | "CHECKOUT_SESSION"
  actionUrlCode: string
  expiresInSeconds: number
  expiresAt: number
  instruction?: PaymentInstruction // only for PAYMENT_CODE
}

export interface PaymentAttachedPayload {
  contributionId: string
  status: "PAYMENT_PENDING"
  payment: PaymentDetail
}

export interface PaymentTerminalPayload {
  contributionId: string
  type: "PAYMENT_CODE" | "CHECKOUT_SESSION"
  status: "PAYMENT_COMPLETED" | "PAYMENT_CANCELLED" | "PAYMENT_FAILED" | "PAYMENT_EXPIRED"
}

// ─── Discriminated union (used by raw hook) ───────────────────────────────────

export type SseEvent =
  | { type: "TOP_CONTRIBUTORS"; data: TopContributorsPayload }
  | { type: "DISTRICT_RANKINGS"; data: DistrictRankingsPayload }
  | { type: "PAYMENT_ATTACHED"; data: PaymentAttachedPayload }
  | { type: "PAYMENT_TERMINAL"; data: PaymentTerminalPayload }
