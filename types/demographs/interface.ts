export interface District {
	name: string;
	chiefdoms: string[];
}

export interface Region {
	name: string;
	districts: District[];
}