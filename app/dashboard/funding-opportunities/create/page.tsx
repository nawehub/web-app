"use client"

import React, {FormEvent, useState, useTransition} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Progress} from "@/components/ui/progress"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {CalendarIcon, ChevronLeft, ChevronRight, PlusCircleIcon} from "lucide-react"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {useRouter} from "next/navigation"
import {CustomCombobox} from "@/components/ui/combobox";
import {useCreateOpportunityMutation, useListProvidersQuery} from "@/hooks/repository/use-funding";
import {createMinimalOpp} from "@/lib/services/funding";
import {useToast} from "@/hooks/use-toast";
import {Icons} from "@/components/ui/icon";
import QuillEditor from "@/components/QuillEditor";
import {formatResponse} from "@/utils/format-response";

const initialFormData: createMinimalOpp = {
    title: "",
    description: "",
    providerId: "",
    amountMin: 0.00,
    amountMax: 0.00,
    about: "",
    applicationDeadline: new Date(),
    applyLink: ""
}

const steps = [
    {id: 1, title: "Basic Information", description: "Enter the basic details of the funding opportunity"},
    {id: 2, title: "Funding Benefit", description: "Specify the funding amount and terms"},
    {id: 3, title: "Funding Details", description: "Give details about the funding opportunity"},
    {id: 4, title: "Review & Submit", description: "Review all information before submitting"},
]

export default function CreateFundingOpportunity() {
    const newOpportunity = useCreateOpportunityMutation()
    const {data} = useListProvidersQuery();
    const [currentStep, setCurrentStep] = useState(1)
    const [providerId, setProviderId] = useState("");
    const [formData, setFormData] = useState<createMinimalOpp>(initialFormData)
    const [isPending, startTransition] = useTransition()
    const [providerName, setProviderName] = useState("")
    const {toast} = useToast();
    const router = useRouter()

    const updateFormData = (field: keyof createMinimalOpp, value: any) => {
        setFormData((prev) => ({...prev, [field]: value}))
    }

    const getProvider = (pId: string) => {
        if (data) {
            const provider = data.providers.find((p) => p.id === pId)
            if (provider && provider.id) {
                formData.providerId = provider.id
                setProviderName(provider.name)
            }
        }
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        startTransition((async () => {
            try {
                const response = await newOpportunity.mutateAsync(formData);
                toast({
                    title: 'Create Opportunity',
                    description: response.message,
                    variant: 'default',
                });
                router.push("/dashboard/funding-opportunities")
            } catch (error) {
                toast({
                    title: 'Registration failed',
                    description: `${error instanceof Error ? formatResponse(error.message) : 'An unknown error occurred'}`,
                    variant: 'destructive',
                });
            }
        }))
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.title && formData.description && formData.providerId && formData.applyLink
            case 2:
                return formData.amountMin && formData.amountMax && formData.applicationDeadline
            case 3:
                return formData.about
            case 4:
                return true // Review step
            default:
                return false
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -20}}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="title">Opportunity Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => updateFormData("title", e.target.value)}
                                placeholder="Enter the funding opportunity title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => updateFormData("description", e.target.value)}
                                placeholder="Provide a detailed description of the funding opportunity"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fundingProvider">Funding Provider *</Label>
                            <CustomCombobox
                                placeholder="Select funding provider"
                                searchPlaceholder={'Search provider...'}
                                data={data ? data.providers : []}
                                searchField={'name'}
                                displayField={'name'}
                                valueField={'id'}
                                value={providerId}
                                onSelectAction={(value) => {
                                    setProviderId(value)
                                    getProvider(value)
                                }}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="applyLink">Application Link *</Label>
                            <Input
                                id="applyLink"
                                type="url"
                                value={formData.applyLink}
                                onChange={(e) => updateFormData("applyLink", e.target.value)}
                                placeholder="Link people can go to apply for this funding opportunity"
                            />
                        </div>
                    </motion.div>
                )

            case 2:
                return (
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -20}}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amountMin">Minimum Amount *</Label>
                                <Input
                                    id="amountMin"
                                    type="number"
                                    value={formData.amountMin}
                                    onChange={(e) => updateFormData("amountMin", Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amountMax">Maximum Amount *</Label>
                                <Input
                                    id="amountMax"
                                    type="number"
                                    value={formData.amountMax}
                                    onChange={(e) => updateFormData("amountMax", Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Application Deadline *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.applicationDeadline && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {formData.applicationDeadline ? (
                                            format(formData.applicationDeadline, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.applicationDeadline}
                                        onSelect={(date) => updateFormData("applicationDeadline", date)}
                                        autoFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -20}}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <Label htmlFor="status">Detailed About This Opportunity</Label>
                            <QuillEditor placeholder={""} value={formData.about}
                                         onChange={(value) => updateFormData("about", value)}/>
                        </div>
                    </motion.div>
                )

            case 4:
                return (
                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: -20}}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Review Your Funding Opportunity</h3>

                            <div className="grid gap-4">
                                <div className="p-4 border rounded-md">
                                    <h4 className="font-medium mb-2">Basic Information</h4>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-medium">Title:</span> {formData.title}
                                        </p>
                                        <p>
                                            <span className="font-medium">Provider:</span> {providerName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Type:</span> {formData.applyLink}
                                        </p>
                                        <p>
                                            <span className="font-medium">Description:</span> {formData.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border rounded-md">
                                    <h4 className="font-medium mb-2">Funding Details</h4>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span
                                                className="font-medium">Amount Range:</span> SLE {formData.amountMin} -{" "}
                                            {formData.amountMax}
                                        </p>
                                        <p>
                                            <span className="font-medium">Deadline:</span>{" "}
                                            {formData.applicationDeadline ? format(formData.applicationDeadline, "PPP") : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                {(formData.about && formData.about.length > 0) && (
                                    <div className="p-4 border rounded-md">
                                        <h4 className="font-medium mb-2">About Opportunity</h4>
                                        <div className="space-y-2">
                                            <div
                                                className="prose prose-sm max-w-none dark:prose-invert"
                                                dangerouslySetInnerHTML={{ __html: formData.about }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <div className="flex-1 space-y-4 pt-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Funding Opportunity</h2>
                    <p className="text-muted-foreground">Add a new funding opportunity to the platform</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
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
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                                )}
                            >
                                {step.id}
                            </div>
                            <div className="text-xs text-center mt-2 max-w-20">
                                <div className="font-medium">{step.title}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                        <div className="flex justify-between mt-8">
                            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                <ChevronLeft className="mr-2 h-4 w-4"/>
                                Previous
                            </Button>

                            {currentStep === steps.length ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'}/>
                                    ) : (
                                        <PlusCircleIcon className={'h-4 w-4 mr-2'}/>
                                    )}
                                    Create Opportunity
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
        </div>
    )
}
