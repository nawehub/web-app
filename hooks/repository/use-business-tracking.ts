"use client";

import { useMutation } from "@tanstack/react-query";
import { businessTrackingService } from "@/lib/services/business-tracking";

export function useTrackBusinessMutation() {
    return useMutation({
        mutationFn: (trackingId: string) => businessTrackingService().getByTrackingId(trackingId),
    });
}
