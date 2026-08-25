"use client";

import { useMutation } from "@tanstack/react-query";
import { ideaSubmissionService } from "@/lib/services/idea-submission";
import type { IdeaSubmissionForm } from "@/types/idea-submission";

export function useIdeaSubmissionMutation() {
    return useMutation({
        mutationFn: (data: IdeaSubmissionForm) => ideaSubmissionService().submit(data),
    });
}

export function useAttachSupportingMaterialMutation() {
    return useMutation({
        mutationFn: ({ ideaId, materialType, file }: { ideaId: string; materialType: string; file: File }) =>
            ideaSubmissionService().attachSupportingMaterial(ideaId, materialType, file),
    });
}
