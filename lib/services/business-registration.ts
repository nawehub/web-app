import { format } from "date-fns";
import type { BusinessRegistrationForm, BusinessRegistrationResponse } from "@/types/business-registration";
import { BUSINESS_CATEGORIES } from "@/types/business-registration";

/** Strips a leading regional-indicator flag emoji (e.g. "🇸🇱 Sierra Leone" -> "Sierra Leone"). */
function stripFlagEmoji(name: string): string {
    return name.replace(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u, "").trim();
}

function categoryToParam(label: string): string {
    return BUSINESS_CATEGORIES.find((c) => c.label === label)?.value ?? "OTHER";
}

const ISO_DATE = "yyyy-MM-dd";

/**
 * Builds the exact multipart body web-api-gateway's `POST /api/v1/businesses`
 * expects: a `businessMeta` part typed as JSON (so Spring can bind it to
 * `BusinessDto.BusinessMetaDto`), and an optional `idScan` file part.
 */
function toFormData(data: BusinessRegistrationForm, idScan: File | null): FormData {
    const businessMeta = {
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        ownerName: data.ownerName,
        ownerAddress: data.ownerAddress,
        placeOfBirth: data.placeOfBirth,
        dateOfBirth: format(data.dateOfBirth, ISO_DATE),
        gender: data.gender.toUpperCase(),
        nationality: stripFlagEmoji(data.nationality),
        mothersName: data.mothersName,
        contactNumber: data.contactNumber,
        email: data.email,
        businessCategory: categoryToParam(data.businessCategory),
        registerDate: data.registerDate ? format(data.registerDate, ISO_DATE) : undefined,
        businessActivities: data.businessActivities,
        businessEntityType: data.businessEntityType,
        registrationNumber: data.registrationNumber || undefined,
        isPublicRegister: true,
        createNawehubAccount: data.createNawehubAccount,
        isAlreadyRegistered: data.isAlreadyRegistered,
        ninPassport: data.ninPassport,
        occupation: data.occupation || undefined,
        docType: data.docType,
    };

    const formData = new FormData();
    formData.append("businessMeta", new Blob([JSON.stringify(businessMeta)], { type: "application/json" }));
    if (idScan) formData.append("idScan", idScan);
    return formData;
}

export const businessRegistrationService = () => ({
    register: async (data: BusinessRegistrationForm, idScan: File | null): Promise<BusinessRegistrationResponse> => {
        const res = await fetch("/api/businesses/register", {
            method: "POST",
            body: toFormData(data, idScan),
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body?.message || "Registration failed. Please check your details and try again.");
        }
        return body;
    },
});
