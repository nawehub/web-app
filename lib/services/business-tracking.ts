import type { BusinessRegistrationResponse } from "@/types/business-registration";

export class BusinessNotFoundError extends Error {
    constructor() {
        super("We couldn't find a registration with that tracking ID. Double-check it and try again.");
        this.name = "BusinessNotFoundError";
    }
}

export const businessTrackingService = () => ({
    getByTrackingId: async (trackingId: string): Promise<BusinessRegistrationResponse> => {
        const res = await fetch(`/api/businesses/by-tracking-id/${encodeURIComponent(trackingId.trim())}`);
        if (res.status === 404) throw new BusinessNotFoundError();
        if (!res.ok) throw new Error("Something went wrong while looking up your registration. Please try again.");
        return res.json();
    },
});
