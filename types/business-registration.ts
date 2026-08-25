import { z } from "zod";
import {
    Briefcase,
    Building2,
    IdCard,
    User,
} from "lucide-react";

/**
 * Public business registration wizard - kept deliberately separate from
 * `types/business.ts` / `lib/services/business.ts` (the dashboard's
 * authenticated registration + management flows, which still target the
 * legacy backend and must not be touched here). This schema mirrors
 * web-api-gateway's `BusinessDto.BusinessMetaDto` field-for-field so the
 * payload this form builds needs no guesswork to match what
 * `POST /api/v1/businesses` (multipart: `businessMeta` JSON + optional
 * `idScan` file) actually accepts.
 */
export const businessRegistrationSchema = z
    .object({
        businessName: z
            .string({ message: "Business name is required" })
            .min(3, "Business name must be at least 3 characters")
            .max(100, "Business name must be at most 100 characters"),
        businessCategory: z.string({ message: "Business category is required" }).min(1, "Select a business category"),
        businessEntityType: z.string({ message: "Business entity type is required" }).min(1, "Select a business entity type"),
        businessAddress: z.string({ message: "Business address is required" }).min(1, "Business address is required"),
        businessActivities: z.string({ message: "Business activities are required" }).min(1, "Describe your business activities"),

        ownerName: z.string({ message: "Owner name is required" }).min(1, "Owner name is required"),
        placeOfBirth: z.string({ message: "Place of birth is required" }).min(1, "Place of birth is required"),
        dateOfBirth: z.date({ message: "Date of birth is required" }),
        gender: z.enum(["Male", "Female"], { message: "Select a gender" }),
        ownerAddress: z.string({ message: "Owner address is required" }).min(1, "Owner address is required"),
        contactNumber: z.string({ message: "Contact number is required" }).min(6, "Enter a valid contact number"),
        email: z.string({ message: "Email is required" }).email("Enter a valid email address"),
        mothersName: z.string({ message: "Mother's name is required" }).min(1, "Mother's name is required"),
        nationality: z.string({ message: "Nationality is required" }).min(1, "Select a nationality"),

        ninPassport: z.string({ message: "NIN or passport number is required" }).min(1, "NIN or passport number is required"),
        occupation: z.string().optional(),
        docType: z.enum(["NATIONAL_ID", "PASSPORT"], { message: "Select an identity document type" }),
        isAlreadyRegistered: z.boolean(),
        registrationNumber: z.string().optional(),
        registerDate: z.date().optional(),
        createNawehubAccount: z.boolean(),
    })
    .refine((data) => !data.isAlreadyRegistered || !!data.registrationNumber?.trim(), {
        message: "Registration number is required for an already-registered business",
        path: ["registrationNumber"],
    })
    .refine((data) => !data.isAlreadyRegistered || !!data.registerDate, {
        message: "Registration date is required for an already-registered business",
        path: ["registerDate"],
    });

export type BusinessRegistrationForm = z.infer<typeof businessRegistrationSchema>;

export const businessRegistrationDefaults: Partial<BusinessRegistrationForm> = {
    businessName: "",
    businessCategory: "",
    businessEntityType: "",
    businessAddress: "",
    businessActivities: "",
    ownerName: "",
    placeOfBirth: "",
    ownerAddress: "",
    contactNumber: "",
    email: "",
    mothersName: "",
    nationality: "",
    ninPassport: "",
    occupation: "",
    registrationNumber: "",
    isAlreadyRegistered: false,
    createNawehubAccount: true,
    docType: "NATIONAL_ID",
};

/** Business.Category enum on the gateway - label -> exact enum value. */
export const BUSINESS_CATEGORIES: { label: string; value: string }[] = [
    { label: "Agriculture", value: "AGRICULTURE" },
    { label: "Technology", value: "TECHNOLOGY" },
    { label: "Fashion & Textiles", value: "FASHION_TEXTILES" },
    { label: "Food & Beverage", value: "FOOD_BEVERAGE" },
    { label: "Healthcare", value: "HEALTHCARE" },
    { label: "Education", value: "EDUCATION" },
    { label: "Construction", value: "CONSTRUCTION" },
    { label: "Transportation", value: "TRANSPORTATION" },
    { label: "Retail", value: "RETAIL" },
    { label: "Manufacturing", value: "MANUFACTURING" },
    { label: "Services", value: "SERVICES" },
    { label: "Tourism", value: "TOURISM" },
    { label: "Mining", value: "MINING" },
    { label: "Energy", value: "ENERGY" },
    { label: "Other", value: "OTHER" },
];

/**
 * business_entity_type is a plain string on the gateway (no enum) - these
 * labels are sent to the server verbatim, so no value/mapping needed.
 */
export const BUSINESS_ENTITY_TYPES: { name: string; descriptions: string[] }[] = [
    {
        name: "Sole Proprietorship",
        descriptions: [
            "Owned and run by a single individual",
            "No legal separation between owner and business — the owner holds full personal liability for debts and obligations",
        ],
    },
    {
        name: "Partnership",
        descriptions: [
            "Involves two or more individuals sharing ownership, profits, and liabilities.",
            "1. General Partnership – all partners are equally liable.",
            "2. Limited Partnership – includes general partners (full liability) and limited partners whose liability is capped to their investment.",
        ],
    },
    {
        name: "Private Limited Company (Ltd or LLC)",
        descriptions: [
            "Most commonly used business structure for small to medium enterprises.",
            "Offers limited liability to shareholders.",
            "Shares are not publicly traded.",
            "Minimum one shareholder and typically two directors; no legal minimum capital but a nominal share capital is common.",
        ],
    },
    {
        name: "Public Limited Company (PLC)",
        descriptions: [
            "Can offer shares to the public and generally has no restrictions on share transfers.",
            "Subject to stricter disclosure, governance, and higher capital requirements.",
        ],
    },
    {
        name: "Company Limited by Guarantee (CLG)",
        descriptions: [
            "Designed for non-profits, charities, or social enterprises.",
            "Has no share capital; members' liability is limited to a predetermined amount they guarantee.",
            "Profits are reinvested to further the organization's objectives, not distributed.",
        ],
    },
    {
        name: "Unlimited Company",
        descriptions: [
            "Members bear unlimited liability for debts.",
            "This structure is less common and typically only used where such liability is required to instill creditor confidence.",
        ],
    },
    {
        name: "Foreign Company Operations",
        descriptions: [
            "Foreign-based companies may operate in Sierra Leone under two primary forms:",
            "Branch Office – an extension of the parent company, not a separate legal entity, making the parent directly liable.",
            "Subsidiary – a locally incorporated, separate legal entity.",
        ],
    },
];

export const IDENTITY_DOC_TYPES: { label: string; value: "NATIONAL_ID" | "PASSPORT" }[] = [
    { label: "National ID", value: "NATIONAL_ID" },
    { label: "Passport", value: "PASSPORT" },
];

export function getDate15YearsAgo(): Date {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 15);
    return d;
}

export const REGISTRATION_WIZARD_STEPS = [
    { id: "business", title: "Business Details", description: "Tell us about the business", icon: Building2 },
    { id: "owner", title: "Owner Details", description: "Who owns this business", icon: User },
    { id: "identity", title: "Identity Verification", description: "Confirm the owner's identity", icon: IdCard },
    { id: "review", title: "Review & Submit", description: "Check everything before you submit", icon: Briefcase },
] as const;

/** Mirrors BusinessModel.BusinessSummary on web-api-gateway. */
export interface BusinessRegistrationResponse {
    id: string;
    trackingId: string;
    ownerId: string | null;
    businessName: string;
    businessAddress: string;
    ownerName: string;
    businessCategory: string;
    otherCategory: string | null;
    businessEntityType: string;
    businessActivities: string;
    registrationNumber: string | null;
    registerDate: string | null;
    status: string;
    rejectionReason: string | null;
    createTime: string;
    updateTime: string;
}
