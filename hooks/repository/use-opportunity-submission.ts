"use client";

import { useMutation } from "@tanstack/react-query";
import { opportunitySubmissionService } from "@/lib/services/opportunity-submission";
import type { OpportunitySubmissionForm } from "@/types/opportunity-submission";

export function useOpportunitySubmissionMutation() {
    return useMutation({
        mutationFn: ({ data, flier }: { data: OpportunitySubmissionForm; flier: File | null }) =>
            opportunitySubmissionService().submit(data, flier),
    });
}
