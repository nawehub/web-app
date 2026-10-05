"use client";

import { useQuery } from "@tanstack/react-query";
import { ideaSubmissionService } from "@/lib/services/idea-submission";

export function useIdeaTrackingQuery(trackingId: string | null) {
    return useQuery({
        queryKey: ["idea-tracking", trackingId],
        queryFn: () => ideaSubmissionService().getByTrackingId(trackingId!),
        enabled: Boolean(trackingId),
        retry: false,
    });
}
