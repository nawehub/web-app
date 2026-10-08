/** Mirrors web-api-gateway's DonationModel. Mobile money is in leones (SLE), card in US dollars. */
export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";
export type DonationMethod = "MOBILE_MONEY" | "CARD";

export interface Amount {
    value: number;
    currency: string;
}

export interface Donation {
    id: string;
    status: DonationStatus;
    method: DonationMethod;
    amount: Amount;
    /** Whether the USSD code / checkout URL is available yet. */
    ready: boolean;
    ussdCode: string | null;
    checkoutUrl: string | null;
    instructions: { title: string | null; steps: string[]; expiryText: string | null } | null;
    expiresAt: string | null;
    failureReason: string | null;
    createTime: string | null;
    updateTime: string | null;
}

export interface StartDonationRequest {
    fullName: string;
    email?: string;
    phone?: string;
    anonymous: boolean;
    amount: number;
    method: DonationMethod;
    /** CARD only: where Monime sends the donor back; "{donationId}" is filled in by the server. */
    returnUrl?: string;
}

export interface FundSummary {
    /** The leone total (mobile money). */
    raised: Amount;
    /** Every total the fund holds - SLE, then USD (card). */
    raisedByCurrency: Amount[];
    donationCount: number;
    recent: { donorName: string; amount: Amount; time: string | null }[];
    asOf: string;
}

/** The currency each way of paying settles in, and what the amount picker offers. */
export const DONATION_OPTIONS: Record<DonationMethod, { currency: string; min: number; max: number; presets: number[]; initial: string }> = {
    MOBILE_MONEY: { currency: "SLE", min: 5, max: 1_000_000, presets: [50, 100, 250, 500], initial: "100" },
    CARD: { currency: "USD", min: 5, max: 50_000, presets: [5, 10, 25, 50], initial: "10" },
};

/** "SLE 100", "$25", "$10.50". */
export function formatAmount(value: number, currency: string) {
    if (currency === "USD")
        return `$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
    return `${currency} ${value.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`;
}
