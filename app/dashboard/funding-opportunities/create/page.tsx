"use client"

import React, {FormEvent, useState, useTransition} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {CalendarIcon, ChevronLeft, ChevronRight, Plus, PlusCircleIcon, X} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {CustomCombobox} from "@/components/ui/combobox";
import {useCreateOpportunityMutation, useListProvidersQuery} from "@/hooks/repository/use-funding";
import {createOpportunityForm} from "@/lib/services/funding";
import {useToast} from "@/hooks/use-toast";
import {Icons} from "@/components/ui/icon";
import { fundingTypes, criteriaTypes, currencies } from "@/types/funding";

const initialFormData: createOpportunityForm = {
    title: "",
    description: "",
    providerId: "",
    amountMin: 0.00,
    amountMax: 0.00,
    currency: "",
    applicationDeadline: new Date(),
    status: "",
    type: "",
    eligibilitySummary: "",
    isFeatured: false,
    tags: [],
    criteria: [],
}

const steps = [
    { id: 1, title: "Basic Information", description: "Enter the basic details of the funding opportunity" },
    { id: 2, title: "Funding Details", description: "Specify the funding amount and terms" },
    { id: 3, title: "Eligibility & Criteria", description: "Define eligibility requirements and criteria" },
    { id: 4, title: "Additional Settings", description: "Configure tags and additional settings" },
    { id: 5, title: "Review & Submit", description: "Review all information before submitting" },
]

export default function CreateFundingOpportunity() {
    const newOpportunity = useCreateOpportunityMutation()
    const { data } = useListProvidersQuery();
    const [currentStep, setCurrentStep] = useState(1)
    const [providerId, setProviderId] = useState("");
    const [formData, setFormData] = useState<createOpportunityForm>(initialFormData)
    const [newTag, setNewTag] = useState("")
    const [isPending, startTransition] = useTransition()
    const [providerName, setProviderName] = useState("")
    const { toast } = useToast();
    const [newCriteria, setNewCriteria] = useState({
        key: "",
        value: "",
        type: "String",
        required: false,
    })
    const router = useRouter()

    const updateFormData = (field: keyof createOpportunityForm, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            updateFormData("tags", [...formData.tags, newTag.trim()])
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        updateFormData(
            "tags",
            formData.tags.filter((tag) => tag !== tagToRemove),
        )
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

    const addCriteria = () => {
        if (newCriteria.key.trim() && newCriteria.value.trim()) {
            updateFormData("criteria", [...formData.criteria, { ...newCriteria }])
            setNewCriteria({ key: "", value: "", type: "string", required: false })
        }
    }

    const removeCriteria = (index: number) => {
        updateFormData(
            "criteria",
            formData.criteria.filter((_, i) => i !== index),
        )
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
                    description: `${error instanceof Error ? error.message : 'An unknown error occurred'}`,
                    variant: 'destructive',
                });
            }
        }))
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.title && formData.description && formData.providerId && formData.type
            case 2:
                return formData.amountMin && formData.amountMax && formData.applicationDeadline
            case 3:
                return formData.eligibilitySummary
            case 4:
                return true // Optional step
            case 5:
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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
                            <Label htmlFor="type">Funding Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select funding type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fundingTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                )

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={"Select currency"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                        <CalendarIcon className="mr-2 h-4 w-4" />
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

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => updateFormData("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select opportunity status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                    <SelectItem value="Archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="eligibilitySummary">Eligibility Summary *</Label>
                            <Textarea
                                id="eligibilitySummary"
                                value={formData.eligibilitySummary}
                                onChange={(e) => updateFormData("eligibilitySummary", e.target.value)}
                                placeholder="Provide a summary of eligibility requirements"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Eligibility Criteria</Label>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <Input
                                    placeholder="Criteria key"
                                    value={newCriteria.key}
                                    onChange={(e) => setNewCriteria((prev) => ({ ...prev, key: e.target.value }))}
                                />
                                <Input
                                    placeholder="Criteria value"
                                    value={newCriteria.value}
                                    onChange={(e) => setNewCriteria((prev) => ({ ...prev, value: e.target.value }))}
                                />
                                <Select
                                    value={newCriteria.type}
                                    onValueChange={(value) => setNewCriteria((prev) => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select criteria type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {criteriaTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="required"
                                        checked={newCriteria.required}
                                        onCheckedChange={(checked) => setNewCriteria((prev) => ({ ...prev, required: checked as boolean }))}
                                    />
                                    <Label htmlFor="required" className="text-sm">
                                        Required
                                    </Label>
                                </div>
                            </div>

                            <Button type="button" onClick={addCriteria} size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Criteria
                            </Button>

                            {formData.criteria.length > 0 && (
                                <div className="space-y-2">
                                    {formData.criteria.map((criteria, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">{criteria.key}:</span>
                                                    <span>{criteria.value}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {criteria.type}
                                                    </Badge>
                                                    {criteria.required && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCriteria(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div className="space-y-4">
                            <Label>Tags</Label>

                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Add a tag"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyUp={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                                            <span>{tag}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 ml-1"
                                                onClick={() => removeTag(tag)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={(checked) => updateFormData("isFeatured", checked as boolean)}
                            />
                            <Label htmlFor="isFeatured">Feature this opportunity</Label>
                        </div>
                    </motion.div>
                )

            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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
                                            <span className="font-medium">Type:</span> {formData.type}
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
                                            <span className="font-medium">Amount Range:</span> {formData.currency} {formData.amountMin} -{" "}
                                            {formData.amountMax}
                                        </p>
                                        <p>
                                            <span className="font-medium">Deadline:</span>{" "}
                                            {formData.applicationDeadline ? format(formData.applicationDeadline, "PPP") : "Not set"}
                                        </p>
                                        <p>
                                            <span className="font-medium">Status:</span> {formData.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border rounded-md">
                                    <h4 className="font-medium mb-2">Eligibility</h4>
                                    <div className="space-y-1 text-sm">
                                        <p>
                                            <span className="font-medium">Summary:</span> {formData.eligibilitySummary}
                                        </p>
                                        {formData.criteria.length > 0 && (
                                            <div>
                                                <span className="font-medium">Criteria:</span>
                                                <ul className="list-disc list-inside ml-4 mt-1">
                                                    {formData.criteria.map((criteria, index) => (
                                                        <li key={index}>
                                                            {criteria.key}: {criteria.value} ({criteria.type})
                                                            {criteria.required && <span className="text-red-500"> *</span>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(formData.tags.length > 0 || formData.isFeatured) && (
                                    <div className="p-4 border rounded-md">
                                        <h4 className="font-medium mb-2">Additional Settings</h4>
                                        <div className="space-y-1 text-sm">
                                            {formData.tags.length > 0 && (
                                                <div>
                                                    <span className="font-medium">Tags:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {formData.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {formData.isFeatured && (
                                                <p>
                                                    <span className="font-medium">Featured:</span> Yes
                                                </p>
                                            )}
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
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Funding Opportunity</h2>
                    <p className="text-muted-foreground">Add a new funding opportunity to the platform</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
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
                    <Progress value={(currentStep / steps.length) * 100} className="h-2" />
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
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                            </Button>

                            {currentStep === steps.length ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Icons.spinner className={'h-4 w-4 mr-2 animate-spin'} />
                                    ) : (
                                        <PlusCircleIcon className={'h-4 w-4 mr-2'} />
                                    )}
                                    Create Opportunity
                                </Button>
                            ) : (
                                <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
