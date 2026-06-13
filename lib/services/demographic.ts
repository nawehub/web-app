import {api4app} from "@/lib/api4app";
import {ListDistrictChiefdomsResponse, ListRegionDistrictsResponse, Region} from "@/types/demographs/demograph-types";

export const demographicService = () => {
    return {
        getRegionDistricts: async (region: Region) => {
            const response = await api4app('/demographic/discover/' + region + '/districts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return response as Promise<ListRegionDistrictsResponse>
        },
        getDistrictChiefdoms: async (districtId: string) => {
            const response = await api4app('/demographic/discover/' + districtId + '/chiefdoms', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            return response as Promise<ListDistrictChiefdomsResponse>
        },
    }
}