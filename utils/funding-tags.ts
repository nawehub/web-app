export const fundingTags = [
    "Entrepreneurs", "Funding", "Investment", "Startups", "Business Opportunity", "Innovation", "Technology", "Venture", "Proof of Concept (PoC)", "Prototype",
    "Networking", "Mentorship", "Gender Equality", "Sustainability", "Clean Energy", "Local", "Global", "Education", "Agriculture", "Software Engineering", "FinTech",
    "Healthcare", "BioTech", "AI"
]

type fundingOpportunity = {
    "id": string,
    "title": string,
    "description": string,
    "fundingProvider": string,
    "amountMin": number,
    "amountMax": number,
    "currency": string,
    "applicationDeadline": Date,
    "status": "OPEN" | "UPCOMING" | "CLOSED" | "ARCHIVED",
    "type": 'Grant' | 'Loan' | 'Accelerator' | 'Pitch_Competition' | 'Venture_Capital' | 'Angel_Investment' | 'Crowdfunding' | 'Other',
    "eligibilitySummary": string,
    "isFeatured": boolean,
    "tags": [
        "Local",
        "SME"
    ], // Can be a list of tags a user can select from
    "criteria": [
        {
            "key": "Location",
            "value": "Sierra Leone",
            "type": 'string' | 'boolean' | 'list' | 'number',
            "required": true
        }
    ], // List of eligibility criteria for the opportunity
    createdAt: Date,
    updatedAt: Date,
}