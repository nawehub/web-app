import {demographsData} from "./data";

export const regions = demographsData.map((region) => region.name).sort();
export const districts = demographsData.flatMap((region) => region.districts).map((district) => district.name).sort();
export const chiefdoms = demographsData.flatMap((region) => region.districts).flatMap((district) => district.chiefdoms).sort();
export const districtChiefdoms = (district: string) => {
	const districtObject = demographsData.find((reg) => reg.districts.find((dist) => dist.name.toLowerCase() === district.toLowerCase()));
	if (!districtObject) return [];
	return districtObject.districts.find((dist) => dist.name.toLowerCase() === district.toLowerCase())?.chiefdoms;
}

export const allDistricts = demographsData.flatMap((region) => region.districts).map((district) => district);


export const regionDistricts = (region: string) => {
	const regionObject = demographsData.find((reg) => reg.name.toLowerCase() === region.toLowerCase());
	if (!regionObject) return [];
	return regionObject.districts.map((district) => district.name);
}

