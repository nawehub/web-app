import type { Donation, FundSummary, StartDonationRequest } from "@/types/donation";

async function json<T>(res: Response, fallback: string): Promise<T> {
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        const message = body?.message || body?.error || fallback;
        throw new Error(typeof message === "string" ? message.replace(/^\d{3} [A-Z_]+ "?|"$/g, "") : fallback);
    }
    return body as T;
}

export const donationsService = () => ({
    start: async (request: StartDonationRequest): Promise<Donation> =>
        json(await fetch("/api/donations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        }), "We couldn't start your donation. Please try again."),
    get: async (id: string): Promise<Donation> =>
        json(await fetch(`/api/donations/${encodeURIComponent(id)}`, { cache: "no-store" }), "We couldn't load that donation."),
    summary: async (recent = 8): Promise<FundSummary> =>
        json(await fetch(`/api/donations/summary?recent=${recent}`), "Couldn't load the fund"),
});
