"use client"

import React, {useState, useTransition} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {Heart, ChevronLeft, ChevronRight, MapPin, Users, CreditCard, CheckCircle, Search, XIcon} from "lucide-react"
import {paymentProviders, currencies} from "@/lib/lyd-data"
import type {LYDProfile, LYDDonation, MakeDonationRequest} from "@/types/lyd"
import {allDistricts} from "@/types/demographs";
import {
    useMakeDonationMutation,
    useProfileWithContributionQuery
} from "@/hooks/repository/use-lyd";
import {useToast} from "@/hooks/use-toast";
import {countries} from "@/utils/countries";
import {CustomCombobox} from "@/components/ui/combobox";
import {formatResponse} from "@/utils/format-response";
import {NotFoundConfirmDialog} from "@/app/lyd/_components/NotFoundConfirmDialog";
import {useIsMobile} from "@/hooks/use-mobile";

interface DonationFormProps {
    onSubmitAction: (donation: Partial<LYDDonation>) => void
    onCancelAction: () => void
}

interface FormData {
    profile: Omit<LYDProfile, "id" | "createdAt" | "updatedAt">
    amount: number
    target: "District" | "Chiefdom" | ""
    district: string
    paymentMethod: "Momo" | "Bank" | "Card" | ""
    paymentProvider: string
    currency: "SLE" | "USD" | "GBP" | "EUR" | ""
    targetValue: string
}

const initialFormData: FormData = {
    profile: {
        firstName: "",
        lastName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        nationality: "",
        isAnonymous: false,
    },
    amount: 0,
    target: "",
    district: "",
    paymentMethod: "",
    paymentProvider: "",
    currency: "SLE",
    targetValue: "",
}

const steps = [
    {id: 1, title: "Personal Info", description: "Your details", icon: Users},
    {id: 2, title: "Contribution", description: "Set your contribution", icon: Heart},
    {id: 3, title: "Payment Method", description: "How you'll pay", icon: CreditCard},
    {id: 4, title: "Target Selection", description: "Choose district/chiefdom", icon: MapPin},
    {id: 5, title: "Confirmation", description: "Review & submit", icon: CheckCircle},
]

export function DonationForm({onSubmitAction, onCancelAction}: DonationFormProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [isPending, startTransition] = useTransition()
    const donate = useMakeDonationMutation()
    const [isLoading, setIsLoading] = useState(false)
    const { data, refetch} = useProfileWithContributionQuery(searchTerm);
    const [isExistingContributory, setIsExistingContributory] = useState(false)
    const { toast } = useToast()
    const [paymentOptions, setPaymentOptions] = useState({method: "", provider: ""})
    const [isNewContribConfirm, setIsNewContribConfirm] = useState(false)
    const [isInit, setIsInit] = useState(true)
    const [open404Dialog, setOpen404Dialog] = useState(false)
    const isMobile = useIsMobile()

    const updateFormData = (field: string, value: any) => {
        if (field.startsWith("profile.")) {
            const profileField = field.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                profile: {...prev.profile, [profileField]: value},
            }))
        } else {
            setFormData((prev) => ({...prev, [field]: value}))
        }
    }

    const selectedDistrict = allDistricts.find((d) => d.name === formData.district)
    const availableChiefdoms = selectedDistrict?.chiefdoms || []

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            if (currentStep === 4) {
                setCurrentStep(currentStep - 2)
            } else {
                setCurrentStep(currentStep - 1)
            }

        }
    }

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const donationData: MakeDonationRequest = {
                    profile: formData.profile,
                    amount: Number.parseFloat(formData.amount.toString()),
                    target: formData.target as "District" | "Chiefdom",
                    district: formData.district,
                    paymentMethod: formData.paymentMethod as "Momo" | "Bank" | "Card",
                    paymentProvider: formData.paymentProvider,
                    currency: formData.currency as MakeDonationRequest["currency"],
                    targetValue: formData.targetValue
                }
                console.log({ donationData})
                const response = await donate.mutateAsync(donationData)
                toast({
                    title: "Development Contribution",
                    description: response.message,
                    className: "bg-green-50 dark:bg-green-900",
                })
                onSubmitAction(donationData)
            } catch (e) {
                console.log({e})
                toast({
                    title: "Development Contribution",
                    description: e instanceof Error ? formatResponse(e.message) : "An error occurred",
                    variant: "destructive",
                })
            }
        })
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return (
                    formData.profile.firstName &&
                    formData.profile.lastName &&
                    formData.profile.phoneNumber &&
                    formData.profile.gender &&
                    formData.profile.nationality
                )
            case 2:
                return formData.amount && formData.amount >= 5
            case 3:
                return formData.paymentMethod && formData.paymentProvider
            case 4:
                return formData.target && formData.district && formData.targetValue
            case 5:
                return true
            default:
                return false
        }
    }

    const formatCurrency = (amount: number, currency: string) => {
        const currencyInfo = currencies.find((c) => c.code === currency)
        return `${currencyInfo?.symbol}${amount.toLocaleString()}`
    }

    const handleSearch = async () => {
        setIsLoading(true)
        if (!searchTerm) return;
        try {
            const result = await refetch();
            if (result.data) {
                setFormData({
                    ...formData,
                    profile: {
                        firstName: result.data.firstName,
                        lastName: result.data.lastName,
                        phoneNumber: result.data.phoneNumber,
                        email: result.data.email,
                        nationality: result.data.nationality,
                        isAnonymous: result.data.isAnonymous || false,
                        gender: result.data.gender,
                    },
                    currency: result.data.currency,
                    paymentMethod: result.data.paymentMethod,
                    paymentProvider: result.data.paymentProvider
                })
                getPayMethod(result.data.paymentMethod)
                getPayProvider(result.data.paymentProvider)
                updateFormData("profile.isAnonymous", result.data.isAnonymous || false)

                setIsExistingContributory(true)
                setIsNewContribConfirm(false)
                setIsInit(false)
            } else {
                setIsExistingContributory(false)
                setOpen404Dialog(true)
                updateFormData("profile.phoneNumber", searchTerm)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    };

    function startFreshContrib() {
        setIsExistingContributory(false)
        setIsNewContribConfirm(true)
        setIsInit(false)
    }

    function getPayMethod(val: string) {
        if (val === "Momo") {
            setPaymentOptions((prev) => ({...prev, method: 'Mobile Money'}) )
        } else if (val === "Bank") {
            setPaymentOptions((prev) => ({...prev, method: 'Bank Transfer'}) )
        } else if (val === "Card") {
            setPaymentOptions((prev) => ({...prev, method: 'Credit/Debit Card'}) )
        }
    }

    function getPayProvider(val: string) {
        if (val === "m17") {
            setPaymentOptions((prev) => ({...prev, provider: 'Orange Money'}) )
        } else if (val === "m18") {
            setPaymentOptions((prev) => ({...prev, provider: 'Afri Money'}) )
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                if (!isExistingContributory && isNewContribConfirm && !isInit) {
                    return (
                        <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.profile.firstName}
                                        onChange={(e) => updateFormData("profile.firstName", e.target.value)}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.profile.lastName}
                                        onChange={(e) => updateFormData("profile.lastName", e.target.value)}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.profile.gender}
                                        onValueChange={(value) => updateFormData("profile.gender", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Prefer_Not_To_Say">Prefer Not to Say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality *</Label>
                                    <CustomCombobox
                                        placeholder="Select your nationality"
                                        searchPlaceholder={'Search country...'}
                                        data={countries}
                                        searchField={'name'}
                                        displayField={'name'}
                                        valueField={'name'}
                                        value={formData.profile.nationality}
                                        onSelectAction={(value) => updateFormData('profile.nationality', value)}/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        disabled
                                        value={formData.profile.phoneNumber}
                                        onChange={(e) => updateFormData("profile.phoneNumber", e.target.value)}
                                        placeholder="+232 XX XXX XXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.profile.email}
                                        onChange={(e) => updateFormData("profile.email", e.target.value)}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isAnonymous"
                                    checked={formData.profile.isAnonymous}
                                    onCheckedChange={(checked) => updateFormData("profile.isAnonymous", checked)}
                                />
                                <Label htmlFor="isAnonymous" className="text-sm">
                                    Make my donation anonymous (your name won't appear in public rankings)
                                </Label>
                            </div>
                        </motion.div>
                    )
                } else {
                    if (currentStep == 1 && isExistingContributory) {
                        setCurrentStep(2)
                    }
                    return
                }

            case 2:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                        {!isExistingContributory && (
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={formData.currency}
                                        onValueChange={(value) => updateFormData("currency", value)}>
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code} disabled={currency.disabled}>
                                                {currency.symbol} {currency.name} ({currency.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="amount">Contribution Amount *</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  {currencies.find((c) => c.code === formData.currency)?.symbol}
                                </span>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="5"
                                    value={formData.amount}
                                    onChange={(e) => updateFormData("amount", e.target.value)}
                                    placeholder="Enter amount"
                                    className="pl-8"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Minimum
                                donation: {formatCurrency(5, formData.currency)}</p>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[5, 10, 15, 20, 25, 30].map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFormData("amount", amount.toString())}
                                    className="text-xs"
                                >
                                    {formatCurrency(amount, formData.currency)}
                                </Button>
                            ))}
                        </div>

                        {formData.amount >= 5 && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <Heart className="h-4 w-4 text-green-600"/>
                                    <span className="font-medium text-green-800 dark:text-green-200">Thank you for your generosity!</span>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Your donation of {formatCurrency(formData.amount, formData.currency)} will make a
                                    real difference in community development.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )

            case 3:
                if (!isExistingContributory) {
                    return (
                        <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="payMethod">Payment Method *</Label>
                                <Select
                                    value={formData.paymentMethod}
                                    onValueChange={(value) => {
                                        updateFormData("paymentMethod", value)
                                        updateFormData("paymentProvider", "")
                                        getPayMethod(value)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose payment method"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Momo" onSelect={() => setPaymentOptions((prev) => ({...prev, method: 'Mobile Money'}) )}>Mobile Money</SelectItem>
                                        <SelectItem value="Bank" disabled>Bank Transfer</SelectItem>
                                        <SelectItem value="Card" disabled>Credit/Debit Card</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.paymentMethod && (
                                <motion.div
                                    initial={{opacity: 0, height: 0}}
                                    animate={{opacity: 1, height: "auto"}}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="paymentProvider">Payment Provider *</Label>
                                    <Select
                                        value={formData.paymentProvider}
                                        onValueChange={(value) => {
                                            updateFormData("paymentProvider", value)
                                            getPayProvider(value)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select provider"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentProviders[formData.paymentMethod as keyof typeof paymentProviders]?.map((provider) => (
                                                <SelectItem key={provider.id} value={provider.id} disabled={provider.id !== 'm17'}>
                                                    {provider.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                } else {
                    setCurrentStep(4)
                    return
                }

            case 4:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="target">Donation Target *</Label>
                            <Select
                                value={formData.target}
                                onValueChange={(value) => {
                                    updateFormData("target", value)
                                    updateFormData("targetId", "")
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose your target"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="District">Entire District</SelectItem>
                                    <SelectItem value="Chiefdom">Specific Chiefdom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Select
                                value={formData.district}
                                onValueChange={(value) => {
                                    updateFormData("district", value)
                                    if (formData.target === "District") {
                                        updateFormData("targetValue", value)
                                    } else {
                                        updateFormData("targetValue", "")
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a district"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {allDistricts.map((district) => (
                                        <SelectItem key={district.name} value={district.name}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.target === "Chiefdom" && formData.district && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                className="space-y-2"
                            >
                                <Label htmlFor="chiefdom">Chiefdom *</Label>
                                <Select value={formData.targetValue}
                                        onValueChange={(value) => updateFormData("targetValue", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a chiefdom"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableChiefdoms.map((chiefdom) => (
                                            <SelectItem key={chiefdom} value={chiefdom}>
                                                {chiefdom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        )}

                        {formData.district && (
                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                className="p-4 bg-primary/5 rounded-lg border border-primary/20"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <MapPin className="h-4 w-4 text-primary"/>
                                    <span className="font-medium">Your Selection</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    You're contributing to:{" "}
                                    <span className="font-medium text-foreground">
                                        {formData.target === "District"
                                            ? selectedDistrict?.name
                                            : formData.targetValue } {" "}
                                        {formData.target === "Chiefdom" ? `(${selectedDistrict?.name} District)` : "District"}
                                    </span>
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )

            case 5:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-6">
                        <div className="text-center">
                            <Heart className="h-12 w-12 text-primary mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Review Your Contribution</h3>
                            <p className="text-muted-foreground">Please confirm your contribution details before proceeding</p>
                        </div>

                        <div className="space-y-4">
                            {!isExistingContributory && (
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Personal Information</h4>
                                    <div className="text-sm space-y-1">
                                        <p>
                                        <span
                                            className="font-medium">Name:</span> {formData.profile.firstName} {formData.profile.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span> {formData.profile.email}
                                        </p>
                                        <p>
                                            <span className="font-medium">Phone:</span> {formData.profile.phoneNumber}
                                        </p>
                                        <p>
                                            <span className="font-medium">Nationality:</span> {formData.profile.nationality}
                                        </p>
                                        {formData.profile.isAnonymous && (
                                            <p className="text-orange-600">
                                                <span className="font-medium">Anonymous:</span> Yes
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Contribution Details</h4>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className="font-medium">Amount:</span>{" "}
                                        {formatCurrency(formData.amount, formData.currency)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Target:</span>{" "}
                                        {formData.target === "District"
                                            ? selectedDistrict?.name + " District"
                                            : formData.targetValue +
                                            ` (${selectedDistrict?.name} District)`}
                                    </p>
                                    <p>
                                        <span
                                            className="font-medium">Payment:</span> {paymentOptions.method} via {paymentOptions.provider}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            {!isExistingContributory && (
                <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Heart className="h-8 w-8 text-primary"/>
                        <h1 className="text-3xl font-bold">Love Your District</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Every Leone counts towards district development projects that create lasting impact. Join thousands
                        of Sierra
                        Leoneans building a better future together.
                    </p>
                </motion.div>
            )}

            {/* Search Bar */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="mb-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Label htmlFor="searchTerm">Phone Number</Label>
                        <Input
                            id="searchTerm"
                            type={"tel"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={ "+232 XX XXX XXX"}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <Button onClick={handleSearch} disabled={!searchTerm || isLoading} className="bg-primary">
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Motivation Info */}
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                className="mb-3 pb-2"
            >
                {isExistingContributory ? (
                    <div>
                        <p className={'text-lg'}>Hello {formData.profile.firstName} {formData.profile.lastName}!</p>
                        <p className={'text-muted-foreground text-sm'}>
                            We're delighted to welcome you back.
                            Great people like you continue to make a difference in the development of their districts and chiefdoms. So far, your total contribution is SLE {data?.totalContributions} — thank you for your generosity!
                        </p>
                    </div>
                ) : isNewContribConfirm && currentStep > 1 && (
                    <div>
                        <p className={'text-lg'}>Hello {formData.profile.firstName} {formData.profile.lastName}!</p>
                        <p className={'text-muted-foreground text-sm'}>
                            Welcome to Love Your District! Great people like you always make a lasting impact by supporting the growth and development of their district and chiefdom.
                        </p>
                    </div>
                )}
            </motion.div>
            {/* Step Content */}
            {!isInit && (
                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                        <CardDescription>
                            {isExistingContributory  && currentStep == 2 ? "Would you like to contribute again? Here's your chance:" : steps[currentStep - 1].description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                        <div className="flex justify-between mt-8 space-x-2">
                            <div className="flex space-x-2">
                                <Button variant="outline" onClick={onCancelAction}>
                                    {isMobile ? (<XIcon className="mr-2 h-4 w-4"/>
                                    ): (<span>Cancel</span>)}
                                </Button>
                                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                    <ChevronLeft className={isMobile ? "mr-1 h-2 w-2" : "mr-2 h-4 w-4"}/>
                                    {isMobile ? (<span>Back</span>): (<span>Previous</span>)}
                                </Button>
                            </div>

                            {currentStep === steps.length ? (
                                <Button onClick={handleSubmit} disabled={!isStepValid(currentStep) || isPending} className="bg-primary">
                                    <Heart className={isMobile ? "mr-1 h-2 w-2" : "mr-2 h-4 w-4"} />
                                    {isMobile ? 'Contribute' : 'Make Contribution'}
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
            )}
            <NotFoundConfirmDialog open={open404Dialog} onOpenChangeAction={setOpen404Dialog} onContinueAction={startFreshContrib} />
        </div>
    )
}
