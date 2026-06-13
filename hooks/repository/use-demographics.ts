import {useQuery} from "@tanstack/react-query";
import {demographicService} from "@/lib/services/demographic";
import {Region} from "@/types/demographs/demograph-types";

export const useListDistrictsQuery = () => {
    return useQuery({
        queryKey: ['districts'],
        queryFn: async () => await demographicService().getRegionDistricts(Region.REGION_UNSPECIFIED),
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 60,    // 1 hour
        refetchOnWindowFocus: false,
    });
}

export const useListDistrictChiefdomsQuery = (districtId: string) => {
    return useQuery({
        queryKey: ['district-chiefdoms', districtId],
        queryFn: async () => await demographicService().getDistrictChiefdoms(districtId),
        staleTime: 1000 * 60 * 10, // 10 minutes
        gcTime: 1000 * 60 * 60,    // 1 hour
        refetchOnWindowFocus: false,
        retry: 1,
        enabled: !!districtId,
    });
}