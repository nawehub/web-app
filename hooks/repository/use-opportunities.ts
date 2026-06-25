import { useQuery } from "@tanstack/react-query";
import { loadOpportunities } from "@/lib/opportunities-store";
import { Opportunity } from "@/types/opportunities";

/**
 * Public opportunities listing.
 *
 * Returns the full set (seed merged with any admin edits saved in the browser);
 * the page applies search, type, sector, stage and sort client-side. When a
 * backend exists this can delegate to opportunitiesService().opportunities.list.
 */
export function useOpportunitiesQuery() {
    return useQuery<Opportunity[]>({
        queryKey: ["opportunities"],
        queryFn: async () => loadOpportunities(),
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });
}
