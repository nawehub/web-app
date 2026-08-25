/**
 * web-api-gateway's ProtoEnums.parse (see OpportunityDto/EntrepreneurDto/IdeaDto
 * on the gateway) uppercases a value and turns spaces/hyphens into underscores
 * before prefixing it and matching a proto enum constant - so most UI labels
 * pass straight through this generic slug. Fields where the enum name isn't a
 * clean slug of the display label get an explicit dictionary below instead.
 */
export function toEnumParam(label: string): string {
    return label.trim().toUpperCase().replace(/[-\s]+/g, "_");
}

export function fromEnumParam(value: string): string {
    return value
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

/** Opportunity.GeographicScope - "Sierra Leone" doesn't slug to SIERRA_LEONE_ONLY. */
export const GEOGRAPHIC_SCOPE_PARAM: Record<string, string> = {
    "Sierra Leone": "SIERRA_LEONE_ONLY",
    Africa: "AFRICA",
    Global: "GLOBAL",
};

/**
 * Opportunity.GeographicScope - full option set (incl. Other) for the
 * submission wizard's radio group, as explicit label/value pairs rather
 * than relying on slugging (the label doesn't slug cleanly to the enum name).
 */
export const GEOGRAPHIC_SCOPE_OPTIONS: { label: string; value: string }[] = [
    { label: "Sierra Leone Only", value: "SIERRA_LEONE_ONLY" },
    { label: "Africa", value: "AFRICA" },
    { label: "Global", value: "GLOBAL" },
    { label: "Other", value: "OTHER" },
];

/** Opportunity.Category - full option set, label/value pairs (labels don't slug cleanly). */
export const OPPORTUNITY_CATEGORIES: { label: string; value: string }[] = [
    { label: "Grants & Funding", value: "GRANTS" },
    { label: "Competitions & Challenges", value: "COMPETITIONS" },
    { label: "Events & Conferences", value: "EVENTS" },
    { label: "Training & Capacity Building", value: "TRAINING" },
    { label: "Fellowships", value: "FELLOWSHIPS" },
    { label: "Scholarships", value: "SCHOLARSHIPS" },
    { label: "Incubator & Accelerator Programs", value: "INCUBATORS" },
    { label: "Jobs & Internships", value: "JOBS" },
    { label: "Climate & Circular Economy", value: "CLIMATE" },
    { label: "Women-Focused Opportunities", value: "WOMEN" },
    { label: "Youth Innovation", value: "YOUTH" },
    { label: "Other", value: "OTHER" },
];

/** Opportunity.OrganizationType - full option set, label/value pairs. */
export const ORGANIZATION_TYPES: { label: string; value: string }[] = [
    { label: "Development Partner", value: "DEVELOPMENT_PARTNER" },
    { label: "NGO", value: "NGO" },
    { label: "Innovation Hub", value: "INNOVATION_HUB" },
    { label: "Private Sector Organization", value: "PRIVATE_SECTOR" },
    { label: "Tech Hub", value: "TECH_HUB" },
    { label: "University / Research Institution", value: "UNIVERSITY_RESEARCH" },
    { label: "Foundation", value: "FOUNDATION" },
    { label: "Government Agency", value: "GOVERNMENT_AGENCY" },
    { label: "Other", value: "OTHER" },
];

/** Opportunity.TargetBeneficiary - matches TARGET_BENEFICIARIES in types/opportunities.ts, plus "Other". */
export const OPPORTUNITY_TARGET_BENEFICIARIES: { label: string; value: string }[] = [
    { label: "Entrepreneurs", value: "ENTREPRENEURS" },
    { label: "Students", value: "STUDENTS" },
    { label: "Innovators", value: "INNOVATORS" },
    { label: "Researchers", value: "RESEARCHERS" },
    { label: "Startups", value: "STARTUPS" },
    { label: "Farmers", value: "FARMERS" },
    { label: "SMEs", value: "SMES" },
    { label: "Persons with Disabilities", value: "PERSONS_WITH_DISABILITIES" },
    { label: "Women-led Businesses", value: "WOMEN_LED_BUSINESSES" },
    { label: "Youth", value: "YOUTH" },
    { label: "Other", value: "OTHER" },
];

/**
 * Idea.Gender - scoped inside the bigidea proto, distinct from the commonapis
 * Gender used by GENDER_OPTIONS/genderToParam above (different enum values:
 * GENDER_OTHER exists here, and "prefer not to say" is PREFER_NOT_TO_SAY,
 * not PREFER_NOT_SAY).
 */
export const IDEA_GENDER_OPTIONS: { label: string; value: string }[] = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
    { label: "Prefer Not to Say", value: "PREFER_NOT_TO_SAY" },
];

/** Idea.SubmissionType - note the British "ORGANISATION" spelling on the wire. */
export const IDEA_SUBMISSION_TYPES: { label: string; value: string }[] = [
    { label: "Individual", value: "INDIVIDUAL" },
    { label: "Team", value: "TEAM" },
    { label: "Existing Business", value: "EXISTING_BUSINESS" },
    { label: "Organisation", value: "ORGANISATION" },
];

/** Idea.MaterialType - used by the optional post-submission supporting-material upload step. */
export const IDEA_MATERIAL_TYPES: { label: string; value: string }[] = [
    { label: "Prototype Photo", value: "PROTOTYPE_PHOTO" },
    { label: "Video", value: "VIDEO" },
    { label: "Business Plan", value: "BUSINESS_PLAN" },
    { label: "Pitch Deck", value: "PITCH_DECK" },
    { label: "Other", value: "OTHER" },
];

/** Idea.IdeaStage - real, filterable facet (replaces the old fake "category" tabs). */
export const IDEA_STAGES = [
    "Concept Only",
    "Research Completed",
    "Prototype Developed",
    "Testing / Pilot",
    "Already Operating",
] as const;

export function ideaStageToParam(label: string): string {
    if (label === "Testing / Pilot") return "TESTING_PILOT";
    return toEnumParam(label);
}

export function ideaStageFromParam(value: string): string {
    if (value === "TESTING_PILOT") return "Testing / Pilot";
    return fromEnumParam(value);
}

/** Gender (commonapis) */
export const GENDER_OPTIONS = ["Male", "Female", "Prefer Not to Say"] as const;

export function genderToParam(label: string): string {
    if (label === "Prefer Not to Say") return "PREFER_NOT_SAY";
    return toEnumParam(label);
}

/**
 * Entrepreneur Skill enum (~50 values, entrepreneurdata/skill.proto) - powers
 * the "Skills" filter that replaced the old fabricated "Industry" filter.
 */
export const SKILL_OPTIONS: { label: string; value: string }[] = [
    "Business Strategy", "Business Modeling", "Leadership", "Fundraising",
    "Pitching / Presenting", "Operations Management", "Legal / Compliance", "Governance",
    "Product Management", "Product Design (UI/UX)", "User Research", "Prototyping", "Agile / Scrum",
    "Software Development", "Web Development", "Mobile Development", "AI / Machine Learning",
    "Data Science / Analytics", "Cloud Infrastructure", "Cybersecurity", "Hardware / IoT",
    "Digital Marketing", "Growth Hacking", "Content Creation", "Social Media Management",
    "SEO / SEM", "Branding", "Public Relations", "B2B Sales", "B2C Sales",
    "Financial Modeling", "Accounting", "Valuation", "Budgeting / Forecasting", "Unit Economics",
    "Impact Measurement", "Community Engagement", "Supply Chain / Logistics",
    "Partnership Building", "Grant Writing",
    "Negotiation", "Team Building / Recruiting", "Problem Solving", "Time Management",
].map((label) => ({
    label,
    value: toEnumParam(label.replace(/\//g, " ").replace(/[()]/g, "")),
}));
