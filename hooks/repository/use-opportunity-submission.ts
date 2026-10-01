"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { opportunitySubmissionService } from "@/lib/services/opportunity-submission";
import type { OpportunitySubmissionForm } from "@/types/opportunity-submission";

export function useOpportunitySubmissionMutation() {
    return useMutation({
        mutationFn: ({ data, flier }: { data: OpportunitySubmissionForm; flier: File | null }) =>
            opportunitySubmissionService().submit(data, flier),
    });
}

export function useOpportunityTrackingQuery(trackingId: string | null) {
    return useQuery({
        queryKey: ["opportunity-tracking", trackingId],
        queryFn: () => opportunitySubmissionService().getByTrackingId(trackingId!),
        enabled: Boolean(trackingId),
        retry: false,
    });
}
