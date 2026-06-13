export enum Region {
    REGION_UNSPECIFIED = "REGION_UNSPECIFIED",
    REGION_EAST = "REGION_EAST",
    REGION_WEST = "REGION_WEST",
    REGION_NORTH = "REGION_NORTH",
    REGION_NORTH_WEST = "REGION_NORTH_WEST",
    REGION_SOUTH = "REGION_SOUTH"
}

export interface District {
    id: string;
    name: string;
    region: String;
    createdBy: string;
    createTime: string; // ISO-8601 format
    updateTime: string;
}

export interface Chiefdom {
    id: string;
    name: string;
    districtId: string;
    createdBy: string;
    createTime: string;
    updateTime: string;
}

export type ListRegionDistrictsResponse = Array<District>;

export type ListDistrictChiefdomsResponse = Array<Chiefdom>;