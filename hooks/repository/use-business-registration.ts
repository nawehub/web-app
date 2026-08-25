"use client";

import { useMutation } from "@tanstack/react-query";
import { businessRegistrationService } from "@/lib/services/business-registration";
import type { BusinessRegistrationForm } from "@/types/business-registration";

export function usePublicBusinessRegistrationMutation() {
    return useMutation({
        mutationFn: ({ data, idScan }: { data: BusinessRegistrationForm; idScan: File | null }) =>
            businessRegistrationService().register(data, idScan),
    });
}
