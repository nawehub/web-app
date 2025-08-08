import type {
    FundingOpportunity,
    DashboardStats,
    RecentActivity,
    UserActivityData,
    FundingProvider, FundingApplication,
} from "@/types/funding"

export const mockStats: DashboardStats = {
    totalActiveUsers: 2847,
    totalFundingOpportunities: 156,
    totalRegisteredBusinesses: 1234,
    fundedProjects: 89,
}

export const mockRecentActivity: RecentActivity[] = [
    {
        id: "1",
        type: "application",
        description: "New application submitted for Tech Innovation Grant",
        timestamp: new Date("2024-01-15T10:30:00"),
        user: "John Doe",
    },
    {
        id: "2",
        type: "funding",
        description: "StartUp Accelerator Program funding approved",
        timestamp: new Date("2024-01-15T09:15:00"),
        user: "Jane Smith",
    },
    {
        id: "3",
        type: "registration",
        description: "New business registered: Green Energy Solutions",
        timestamp: new Date("2024-01-14T16:20:00"),
        user: "Mike Johnson",
    },
    {
        id: "4",
        type: "approval",
        description: "SME Development Grant application approved",
        timestamp: new Date("2024-01-14T16:20:00"),
        user: "Sarah Wilson",
    },
]

export const mockUserActivity: UserActivityData[] = [
    {month: "Jan", users: 1200},
    {month: "Feb", users: 1350},
    {month: "Mar", users: 1500},
    {month: "Apr", users: 1800},
    {month: "May", users: 2100},
    {month: "Jun", users: 2300},
    {month: "Jul", users: 2500},
    {month: "Aug", users: 2650},
    {month: "Sep", users: 2800},
    {month: "Oct", users: 2847},
    {month: "Nov", users: 2900},
    {month: "Dec", users: 3000},
]

export const mockFundingProviders: FundingProvider[] = [
    {
        id: "fup-1998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "Local Business Bank",
        description: "Offers micro-loans and business development support to local businesses.",
        websiteUrl: "https://www.localbank.sl",
        contactEmail: "info@localbank.sl",
        providerType: "Bank",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288110178",
        createdAt: new Date("2024-01-10"),
    },
    {
        id: "fup-2998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "Sierra Leone Development Foundation",
        description:
            "Non-profit organization focused on sustainable development and community empowerment through strategic funding initiatives.",
        websiteUrl: "https://www.sldf.org",
        contactEmail: "grants@sldf.org",
        providerType: "Foundation",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288220189",
        createdAt: new Date("2024-01-05"),
    },
    {
        id: "fup-3998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "Ministry of Trade and Industry",
        description: "Government agency providing funding and support for trade and industrial development projects.",
        websiteUrl: "https://www.mti.gov.sl",
        contactEmail: "funding@mti.gov.sl",
        providerType: "Government",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288330190",
        createdAt: new Date("2024-01-08"),
    },
    {
        id: "fup-4998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "Green Future Ventures",
        description: "Private equity firm specializing in clean energy and environmental sustainability investments.",
        websiteUrl: "https://www.greenfuture.com",
        contactEmail: "investments@greenfuture.com",
        providerType: "Private",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288440191",
        createdAt: new Date("2024-01-12"),
    },
    {
        id: "fup-5998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "West Africa NGO Network",
        description: "Regional NGO network providing capacity building and funding support to local organizations.",
        websiteUrl: "https://www.wangon.org",
        contactEmail: "programs@wangon.org",
        providerType: "NGO",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288550192",
        createdAt: new Date("2024-01-15"),
    },
    {
        id: "fup-6998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "TechCorp Solutions",
        description: "Technology corporation offering innovation grants and startup acceleration programs.",
        websiteUrl: "https://www.techcorp.sl",
        contactEmail: "innovation@techcorp.sl",
        providerType: "Corporate",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288660193",
        createdAt: new Date("2024-01-18"),
    },
    {
        id: "fup-7998d117-2e25-4faf-ad3f-9a511fb6aa9e",
        name: "Dr. Amara Kamara Foundation",
        description: "Individual philanthropist supporting education and healthcare initiatives in rural communities.",
        websiteUrl: "https://www.kamarafoundation.org",
        contactEmail: "contact@kamarafoundation.org",
        providerType: "Individual",
        createdBy: "usr-e9c301cb-3d5d-48f2-bbfc-7ac6f3d6b35a",
        contactPhone: "+23288770194",
        createdAt: new Date("2024-01-20"),
    },
]

export const mockFundingOpportunities: FundingOpportunity[] = [
        {
            id: "1",
            title: "Tech Innovation Grant 2024",
            description: "Supporting innovative technology startups with funding up to $100,000 for product development and market entry.",
            provider: {
                id: "1",
                name: "United Nations Women",
                description: "",
                websiteUrl: "",
                contactEmail: "",
                providerType: "Bank",
                createdBy: "",
                contactPhone: "",
                createdAt: new Date("2025-01-01")
            },
            amountMin: 10000,
            amountMax: 100000,
            currency: "USD",
            applicationDeadline: new Date("2025-10-30"),
            status: "Open",
            type: "Grant",
            eligibilitySummary: "Early-stage tech startups with innovative products",
            isFeatured: true,
            tags: ["Technology", "Innovation", "Startup"],
            criteria: [
                {key: "Location", value: "Sierra Leone", type: "string", required: true},
                {key: "Business Stage", value: "Early Stage", type: "string", required: true},
                {key: "Industry", value: "Technology", type: "string", required: false},
            ],
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
        },
        {
            id: "2",
            title: "SME Development Fund",
            description: "Comprehensive funding program for small and medium enterprises looking to expand their operations.",
            provider: {
                id: "2",
                name: "UNDP Sierra Leone",
                description: "",
                websiteUrl: "",
                contactEmail: "",
                providerType: "Bank",
                createdBy: "",
                contactPhone: "",
                createdAt: new Date("2024-01-01")
            },
            amountMin:
                5000,
            amountMax:
                50000,
            currency:
                "USD",
            applicationDeadline:
                new Date("2024-04-15"),
            status:
                "Open",
            type:
                "Loan",
            eligibilitySummary:
                "Established SMEs with 2+ years of operation",
            isFeatured:
                true,
            tags:
                ["SME", "Development", "Expansion"],
            criteria:
                [
                    {key: "Years in Operation", value: "2", type: "number", required: true},
                    {key: "Annual Revenue", value: "10000", type: "number", required: true},
                ],
            createdAt:
                new Date("2024-01-05"),
            updatedAt: new Date("2024-01-05")
        },
        {
            id: "3",
            title: "Green Energy Accelerator",
            description: "Accelerator program for renewable energy and sustainability-focused startups.",
            provider: {
                id: "3",
                name: "eWomen",
                description: "",
                websiteUrl: "",
                contactEmail: "",
                providerType: "Bank",
                createdBy: "",
                contactPhone: "",
                createdAt: new Date("2024-01-01")
            },
            amountMin: 25000,
            amountMax: 200000,
            currency: "USD",
            applicationDeadline: new Date("2024-05-01"),
            status: "Upcoming",
            type: "Accelerator",
            eligibilitySummary: "Clean energy and sustainability startups",
            isFeatured: false,
            tags: ["Green Energy", "Sustainability", "Climate"],
            criteria: [
                    {key: "Industry Focus", value: "Renewable Energy", type: "string", required: true},
                    {key: "Team Size", value: "3", type: "number", required: false},
            ],
            createdAt: new Date("2024-01-10"),
            updatedAt: new Date("2024-01-05")
        }
        ,
    ]
;

export const mockFundingApplications: FundingApplication[] = [
    {
        id: "app-1",
        opportunityId: "1",
        applicantName: "John Doe",
        applicantEmail: "john.doe@example.com",
        applicantPhone: "+23288123456",
        businessName: "TechStart Solutions",
        businessDescription: "AI-powered customer service platform for small businesses",
        businessStage: "Early Stage",
        funding_amount_requested: 75000,
        business_plan_url: "https://example.com/business-plan.pdf",
        pitch_deck_url: "https://example.com/pitch-deck.pdf",
        applicationStatus: "Under_Review",
        submissionDate: new Date("2024-01-20T14:30:00"),
        criteriaResponse: [
            {key: "Location", value: "Freetown, Sierra Leone"},
            {key: "Business Stage", value: "Early Stage"},
            {key: "Industry", value: "Technology"},
        ],
    },
    {
        id: "app-2",
        opportunityId: "1",
        applicantName: "Sarah Wilson",
        applicantEmail: "sarah.wilson@example.com",
        applicantPhone: "+23288234567",
        businessName: "EduTech Africa",
        businessDescription: "Online learning platform for African students",
        businessStage: "Startup",
        funding_amount_requested: 50000,
        applicationStatus: "Submitted",
        submissionDate: new Date("2024-01-22T09:15:00"),
        criteriaResponse: [
            {key: "Location", value: "Bo, Sierra Leone"},
            {key: "Business Stage", value: "Startup"},
            {key: "Industry", value: "Education Technology"},
        ],
    },
    {
        id: "app-3",
        opportunityId: "2",
        applicantName: "Michael Johnson",
        applicantEmail: "michael.johnson@example.com",
        applicantPhone: "+23288345678",
        businessName: "Agri-Fresh Ltd",
        businessDescription: "Organic farming and food processing company",
        businessStage: "Growth",
        funding_amount_requested: 30000,
        applicationStatus: "Approved",
        submissionDate: new Date("2024-01-18T11:45:00"),
        reviewed_at: new Date("2024-01-25T16:20:00"),
        notes: "Excellent business model with strong market potential",
        criteriaResponse: [
            {key: "Years in Operation", value: "3"},
            {key: "Annual Revenue", value: "25000"},
        ],
    },
    {
        id: "app-4",
        opportunityId: "1",
        applicantName: "Fatima Kamara",
        applicantEmail: "fatima.kamara@example.com",
        applicantPhone: "+23288456789",
        businessName: "HealthTech Innovations",
        businessDescription: "Mobile health monitoring solutions for rural communities",
        businessStage: "Early Stage",
        funding_amount_requested: 85000,
        applicationStatus: "Rejected",
        submissionDate: new Date("2024-01-15T13:20:00"),
        reviewed_at: new Date("2024-01-28T10:30:00"),
        notes: "Good concept but needs more market validation",
        criteriaResponse: [
            {key: "Location", value: "Kenema, Sierra Leone"},
            {key: "Business Stage", value: "Early Stage"},
            {key: "Industry", value: "Healthcare Technology"},
        ],
    },
]
