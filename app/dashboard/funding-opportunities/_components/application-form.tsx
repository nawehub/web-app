"use client"

import React, {useState, useTransition} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Progress} from "@/components/ui/progress"
import {ChevronLeft, ChevronRight, FileText, DollarSign, User, Building} from "lucide-react"
import {cn} from "@/lib/utils"
import {FundingOpportunity, businessStages} from "@/types/funding"
import {useSession} from "next-auth/react";
import {CustomCombobox} from "@/components/ui/combobox";
import {useListBusinessQuery} from "@/hooks/repository/use-business";
import {ApplyForm} from "@/lib/services/funding";
import {useApplyToOpportunityMutation} from "@/hooks/repository/use-funding";
import {useToast} from "@/hooks/use-toast";

interface ApplicationFormProps {
    opportunity: FundingOpportunity
    onSubmitAction: () => void
    onCancelAction: () => void
}

const initialFormData: ApplyForm = {
    opportunityId: "",
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    businessName: "",
    businessDescription: "",
    businessStage: "",
    criteriaResponse: [],
    notes: "",
    applicationStatus: ""
}

const steps = [
    {id: 1, title: "Personal Information", description: "Your contact details", icon: User},
    {id: 2, title: "Business Information", description: "About your business", icon: Building},
    {id: 3, title: "Funding Details", description: "Funding requirements", icon: DollarSign},
    {id: 4, title: "Criteria", description: "Funding Criteria", icon: FileText},
]

export function ApplicationForm({opportunity, onSubmitAction, onCancelAction}: ApplicationFormProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<ApplyForm>({
        ...initialFormData,
        criteriaResponse: opportunity.criteria.map((criteria) => ({
            key: criteria.key,
            value: "",
        })),
    })
    const [businessId, setBusinessId] = useState<string>("")
    const {data} = useListBusinessQuery("")
    const [isPending, startTransition] = useTransition();
    const apply = useApplyToOpportunityMutation()
    const {toast} = useToast();

    const {data: session} = useSession();

    const getBusiness = (bId: string) => {
        if (data) {
            const business = data.businesses.find((b) => b.id === bId)
            if (business && business.id) {
                setFormData(prevState => ({
                    ...prevState,
                    businessName: business.businessName,
                }))
            }
        }
    }

    const prefillFromSession = () => {
        if (session) {
            let firstName = session.user.firstName
            let lastName = session.user.lastName
            let email = session.user.email
            let phone = session.user.phone
            setFormData(prevState => ({
                ...prevState,
                applicantName: `${firstName} ${lastName}`,
                applicantEmail: email,
                applicantPhone: phone,
            }))
        }
    }

    const updateFormData = (field: keyof ApplyForm, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const updateCriteriaResponse = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            criteriaResponse: prev.criteriaResponse.map((response) =>
                response.key === key ? {...response, value} : response,
            ),
        }))
    }

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        const applyData: ApplyForm = {
            ...formData,
            opportunityId: opportunity.id,
            applicationStatus: "Submitted",
        }
        try {
            startTransition(async () => {
                const response = await apply.mutateAsync(applyData)
                toast({
                    title: 'Create Opportunity',
                    description: response.message,
                    variant: 'default',
                });
                onSubmitAction()
            })
        } catch (e) {
            toast({
                title: 'Registration failed',
                description: `${e instanceof Error ? e.message : 'An unknown error occurred'}`,
                variant: 'destructive',
            });
        }
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.applicantName && formData.applicantEmail && formData.applicantPhone
            case 2:
                return formData.businessName && formData.businessDescription && formData.businessStage
            case 3:
                return formData.notes
            case 4:
                const requiredCriteria = opportunity.criteria.filter((c) => c.required)
                return requiredCriteria.every((criteria) =>
                    formData.criteriaResponse.find((response) => response.key === criteria.key && response.value.trim()),
                )
            default:
                return false
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="applicant_name">Full Name *</Label>
                            <Input
                                id="applicant_name"
                                value={formData.applicantName}
                                onChange={(e) => updateFormData("applicantName", e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="applicant_email">Email Address *</Label>
                            <Input
                                id="applicant_email"
                                type="email"
                                value={formData.applicantEmail}
                                onChange={(e) => updateFormData("applicantEmail", e.target.value)}
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="applicant_phone">Phone Number *</Label>
                            <Input
                                id="applicant_phone"
                                value={formData.applicantPhone}
                                onChange={(e) => updateFormData("applicantPhone", e.target.value)}
                                placeholder="+232 XX XXX XXX"
                            />
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name *</Label>
                            <Input
                                id="business_name"
                                value={formData.businessName}
                                onChange={(e) => updateFormData("businessName", e.target.value)}
                                placeholder="Enter your business name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_description">Business Description *</Label>
                            <Textarea
                                id="business_description"
                                value={formData.businessDescription}
                                onChange={(e) => updateFormData("businessDescription", e.target.value)}
                                placeholder="Describe your business, products/services, and target market"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="business_stage">Business Stage *</Label>
                            <Select
                                value={formData.businessStage}
                                onValueChange={(value) => updateFormData("businessStage", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your business stage"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {businessStages.map((stage) => (
                                        <SelectItem key={stage} value={stage}>
                                            {stage.replace("_", "")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Funding Range</h4>
                            <p className="text-sm text-muted-foreground">
                                This opportunity offers funding between{" "}
                                <span
                                    className="font-medium">{formatCurrency(opportunity.amountMin, opportunity.currency)}</span> and{" "}
                                <span
                                    className="font-medium">{formatCurrency(opportunity.amountMax, opportunity.currency)}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Summary of your application (This will help us in the review Process)
                                *</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => updateFormData("notes", e.target.value)}
                                placeholder={"Application summary"}
                            />
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        {/* Criteria Section */}
                        {opportunity.criteria.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-medium">Eligibility Criteria</h4>
                                {opportunity.criteria.map((criteria) => {
                                    const response = formData.criteriaResponse.find((r) => r.key === criteria.key)
                                    return (
                                        <div key={criteria.key} className="space-y-2">
                                            <Label>
                                                {criteria.key}
                                                {criteria.required && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            {criteria.type === "string" ? (
                                                <Input
                                                    value={response?.value || ""}
                                                    onChange={(e) => updateCriteriaResponse(criteria.key, e.target.value)}
                                                    placeholder={`Enter ${criteria.key.toLowerCase()}`}
                                                />
                                            ) : criteria.type === "number" ? (
                                                <Input
                                                    type="number"
                                                    value={response?.value || ""}
                                                    onChange={(e) => updateCriteriaResponse(criteria.key, e.target.value)}
                                                    placeholder={`Enter ${criteria.key.toLowerCase()}`}
                                                />
                                            ) : (
                                                <Textarea
                                                    value={response?.value || ""}
                                                    onChange={(e) => updateCriteriaResponse(criteria.key, e.target.value)}
                                                    placeholder={`Enter ${criteria.key.toLowerCase()}`}
                                                    rows={2}
                                                />
                                            )}
                                            <p className="text-xs text-muted-foreground">Expected: {criteria.value}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Apply for {opportunity.title}</h2>
                <p className="text-muted-foreground">Complete the application form to apply for this funding
                    opportunity</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}
          </span>
                    <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
                </div>
                <Progress value={(currentStep / steps.length) * 100} className="h-2"/>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => {
                    const StepIcon = step.icon
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2",
                                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                )}
                            >
                                <StepIcon className="h-5 w-5"/>
                            </div>
                            <div className="text-xs text-center max-w-20">
                                <div className="font-medium">{step.title}</div>
                                <div className="text-muted-foreground">{step.description}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    {currentStep === 1 ? (
                        <div className={"flex"}>
                            <div>
                                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                            </div>
                            <div className={"ml-auto"}>
                                <Button variant="outline" onClick={prefillFromSession}>
                                    Prefill with your user details
                                    <ChevronRight className="ml-2 h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ) : currentStep === 2 ? (
                        <div className={"flex"}>
                            <div>
                                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                            </div>
                            <div className={"ml-auto"}>
                                <CustomCombobox
                                    placeholder="Select a business"
                                    searchPlaceholder={'Search businesses...'}
                                    data={data ? data.businesses : []}
                                    searchField={'businessName'}
                                    displayField={'businessName'}
                                    valueField={'id'}
                                    value={businessId}
                                    onSelectAction={(value) => {
                                        setBusinessId(value)
                                        getBusiness(value)
                                    }}/>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {renderStepContent()}

                    <div className="flex justify-between mt-8">
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={onCancelAction}>
                                Cancel
                            </Button>
                            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                <ChevronLeft className="mr-2 h-4 w-4"/>
                                Previous
                            </Button>
                        </div>

                        {currentStep === steps.length ? (
                            <Button onClick={handleSubmit} disabled={!isStepValid(currentStep) || isPending}>
                                Submit Application
                            </Button>
                        ) : (
                            <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                                Next
                                <ChevronRight className="ml-2 h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
