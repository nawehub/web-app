import { useQuery } from "@tanstack/react-query";
import { entrepreneursService } from "@/lib/services/entrepreneurs";
import { VettedEntrepreneursFilters } from "@/types/entrepreneurs";

export function useVettedEntrepreneursQuery(filters: VettedEntrepreneursFilters = {}) {
    return useQuery({
        queryKey: ["vetted-entrepreneurs", filters],
        queryFn: () => entrepreneursService().entrepreneurs.list(filters),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    });
}

export function usePublicProfileQuery(id: string | undefined) {
    return useQuery({
        queryKey: ["public-profile", id],
        queryFn: () => entrepreneursService().entrepreneurs.getPublicProfile(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });
}
