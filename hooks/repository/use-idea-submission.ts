"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ideaSubmissionService } from "@/lib/services/idea-submission";
import type { IdeaSubmissionForm } from "@/types/idea-submission";

export function useIdeaSubmissionMutation() {
    return useMutation({
        mutationFn: ({ data, material }: { data: IdeaSubmissionForm; material?: { file: File; materialType: string } | null }) =>
            ideaSubmissionService().submit(data, material),
    });
}

export function useIdeaTrackingQuery(trackingId: string | null) {
    return useQuery({
        queryKey: ["idea-tracking", trackingId],
        queryFn: () => ideaSubmissionService().getByTrackingId(trackingId!),
        enabled: Boolean(trackingId),
        retry: false,
    });
}
