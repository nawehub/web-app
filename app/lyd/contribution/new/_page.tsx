"use client"

import React, {useCallback, useEffect, useRef, useState, useTransition} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {Heart, ChevronLeft, ChevronRight, MapPin, Users, CreditCard, CheckCircle, Search, XIcon} from "lucide-react"
import {currencies} from "@/lib/lyd-data"
import type {LYDContributor, MakeContributionRequest, Money} from "@/types/lyd"

import {
    useMakeContributionMutation,
    useProfileWithContributionQuery,
} from "@/hooks/repository/use-lyd"
import {useToast} from "@/components/ui/use-toast"
import {countries} from "@/utils/countries"
import {CustomCombobox} from "@/components/ui/combobox"
import {formatResponse} from "@/utils/format-response"
import {NotFoundConfirmDialog} from "@/app/lyd/contribution/new/_components/NotFoundConfirmDialog"
import {PaymentStatusModal, Phase} from "@/app/lyd/contribution/new/_components/payment-status-modal"
import {usePaymentSse} from "@/hooks/use-sse"
import type {PaymentAttachedPayload, PaymentTerminalPayload} from "@/types/sse"
import {useIsMobile} from "@/hooks/use-mobile"
import {useListDistrictChiefdomsQuery, useListDistrictsQuery} from "@/hooks/repository/use-demographics";
import {Chiefdom, District} from "@/types/demographs/demograph-types";
import {useRouter} from "next/navigation";
import AppHeader from "@/components/public/app-header";
import {ContributionResponse} from "@/lib/services/lyd";

interface FormData {
    contributor: Omit<LYDContributor, "id" | "createdAt" | "updatedAt">
    id: string
    districtId: string
    target: "District" | "Chiefdom" | ""
    targetId: string
    paymentMethod: "CheckoutSession" | "Payment_Code" | ""
    amount: Money,
    successUrl?: string,
    cancelUrl?: string,
}

const initialFormData: FormData = {
    contributor: {
        firstName: "",
        lastName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        nationality: "",
        isAnonymous: false,
    },
    id: "",
    districtId: "",
    target: "",
    targetId: "",
    paymentMethod: "",
    amount: {
        currency: "SLE",
        amount: 0,
    },
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/lyd/contribution/new/success`,
    cancelUrl: "http://localhost:3000/lyd/contribution/new",
}

// http://localhost:3000/files/new-contribution/success?id=

const steps = [
    {id: 1, title: "Personal Info", description: "Your details", icon: Users},
    {id: 2, title: "Contribution", description: "Set your contribution", icon: Heart},
    {id: 3, title: "Payment Method", description: "How you'll pay", icon: CreditCard},
    {id: 4, title: "Target Selection", description: "Choose district/chiefdom", icon: MapPin},
    {id: 5, title: "Confirmation", description: "Review & submit", icon: CheckCircle},
]

export default function ContributionForm() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [isPending, startTransition] = useTransition()
    const contribute = useMakeContributionMutation()
    const [isLoading, setIsLoading] = useState(false)
    const {data, refetch} = useProfileWithContributionQuery(searchTerm)
    const [isExistingContributory, setIsExistingContributory] = useState(false)
    const {toast} = useToast()
    const [paymentOptions, setPaymentOptions] = useState<"Payment_Code" | "CheckoutSession">()
    const [isNewContribConfirm, setIsNewContribConfirm] = useState(false)
    const [isInit, setIsInit] = useState(true)
    const [open404Dialog, setOpen404Dialog] = useState(false)
    const isMobile = useIsMobile()
    const [currentIdempotencyKey, setCurrentIdempotencyKey] = useState("");

    const router = useRouter()

    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
    const [selectedChiefdom, setSelectedChiefdom] = useState<Chiefdom | null>(null)

    const {data: districts = [], isLoading: districtsLoading} = useListDistrictsQuery();
    let {
        data: chiefdoms,
        isLoading: chiefdomsLoading
    } = useListDistrictChiefdomsQuery(selectedDistrict?.id ?? '');

    // ── Payment SSE state ──────────────────────────────────────────────────────
    const [activeContribution, setActiveContribution] = useState<ContributionResponse | null>(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    // SSE-driven state — lifted here so the stream opens the instant
    // activeContribution is set, before the modal even renders.
    const [ssePhase, setSsePhase] = useState<Phase>("awaiting")
    const [sseCountdown, setSseCountdown] = useState<number | null>(null)

    // Initialised to a no-op — updated to the real function after it's declared below
    const onSuccessRef = useRef<() => void>(() => {})
    const activeContributionRef = useRef(activeContribution)
    activeContributionRef.current = activeContribution

    const handleAttached = useCallback((data: PaymentAttachedPayload) => {
        if (data.payment.expiresInSeconds > 0) {
            setSseCountdown(data.payment.expiresInSeconds)
        }
    }, [])

    const handleTerminal = useCallback((data: PaymentTerminalPayload) => {
        setSseCountdown(null)
        switch (data.status) {
            case "PAYMENT_COMPLETED":
                setSsePhase("completed")
                // Give the success animation in the modal a moment, then redirect
                setTimeout(() => {
                    router.push(`/files/new-contribution/success?id=${activeContributionRef.current?.contributionId ?? ""}`)
                }, 2_200)
                break
            case "PAYMENT_CANCELLED": setSsePhase("cancelled"); break
            case "PAYMENT_FAILED":    setSsePhase("failed");    break
            case "PAYMENT_EXPIRED":   setSsePhase("expired");   break
        }
    }, [])

    // Subscribe immediately when contributionId is known — before modal renders
    usePaymentSse({
        contributionId: activeContribution?.contributionId ?? null,
        onAttached: handleAttached,
        onTerminal: handleTerminal,
    })

    const updateFormData = (field: string, value: any) => {
        if (field.startsWith("contributor.")) {
            const profileField = field.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                contributor: {...prev.contributor, [profileField]: value},
            }))
        } else if (field.startsWith("amount.")) {
            const amountField = field.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                amount: {...prev.amount, [amountField]: value},
            }))
        } else {
            setFormData((prev) => ({...prev, [field]: value}))
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1)
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

    useEffect(() => {
        if (currentStep === steps.length && !currentIdempotencyKey) {
            setCurrentIdempotencyKey(crypto.randomUUID());
        }
    }, [selectedDistrict, currentStep, currentIdempotencyKey]);

    const handleSubmit = () => {
        if (isPending || contribute.isPending) {
            console.warn("Submit blocked: Request already in progress");
            return;
        }
        startTransition(async () => {
            try {
                const contributionRequest: MakeContributionRequest = {
                    contributor: formData.contributor,
                    districtId: formData.districtId,
                    target: formData.target as "District" | "Chiefdom",
                    targetId: formData.targetId,
                    paymentMethod: formData.paymentMethod as "CheckoutSession" | "Payment_Code",
                    amount: formData.amount,
                    successUrl: formData.successUrl as string,
                    cancelUrl: formData.cancelUrl as string,
                };

                // 3. Pass the "Locked" key
                const response = await contribute.mutateAsync({
                    data: contributionRequest,
                    idempotencyKey: currentIdempotencyKey
                });

                if (response?.contributionId) {
                    setSsePhase("awaiting")
                    setSseCountdown(null)
                    setActiveContribution(response)
                    setShowPaymentModal(true)
                    setCurrentIdempotencyKey("")
                }
            } catch (e: any) {
                const isConflict = e.message?.includes("409") || e.status === 409;

                toast({
                    title: isConflict ? "Already Received" : "Error",
                    description: isConflict
                        ? "This contribution is already being processed. Check your status modal."
                        : formatResponse(e.message),
                    variant: isConflict ? "default" : "destructive",
                });

                if (isConflict) {
                    setCurrentIdempotencyKey(""); // Clear to allow a fresh attempt if they want
                }
            }
        });
    }

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false)
        setActiveContribution(null)
        setSsePhase("awaiting")
        setSseCountdown(null)
        toast({
            title: "Contribution Confirmed 🎉",
            description: "Thank you! Your contribution has been successfully received.",
            className: "bg-green-50 dark:bg-green-900",
        })
    }
    // Keep ref current so the stable SSE callback always calls the latest version
    onSuccessRef.current = handlePaymentSuccess

    const handlePaymentModalClose = () => {
        setShowPaymentModal(false)
        setActiveContribution(null)
        setSsePhase("awaiting")
        setSseCountdown(null)
    }

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return (
                    formData.contributor.firstName &&
                    formData.contributor.lastName &&
                    formData.contributor.phoneNumber &&
                    formData.contributor.gender &&
                    formData.contributor.nationality
                )
            case 2:
                return formData.amount && formData.amount.amount >= 5
            case 3:
                return formData.paymentMethod && paymentOptions
            case 4:
                return formData.target && formData.districtId && formData.targetId
            case 5:
                return true
            default:
                return false
        }
    }

    const formatCurrencyLocal = (amount: number, currency: string) => {
        const currencyInfo = currencies.find((c) => c.code === currency)
        return `${currencyInfo?.symbol}${amount.toLocaleString()}`
    }

    const handleSearch = async () => {
        setIsLoading(true)
        if (!searchTerm) return
        try {
            const result = await refetch()
            if (result.data) {
                setFormData({
                    ...formData,
                    contributor: {
                        firstName: result.data.firstName,
                        lastName: result.data.lastName,
                        phoneNumber: result.data.phoneNumber,
                        email: result.data.email,
                        nationality: result.data.nationality,
                        isAnonymous: result.data.isAnonymous || false,
                        gender: result.data.gender,
                    },
                })
                updateFormData("contributor.isAnonymous", result.data.isAnonymous || false)
                setIsExistingContributory(true)
                setIsNewContribConfirm(false)
                setIsInit(false)
            } else {
                setIsExistingContributory(false)
                setOpen404Dialog(true)
                updateFormData("contributor.phoneNumber", searchTerm)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    function startFreshContrib() {
        setIsExistingContributory(false)
        setIsNewContribConfirm(true)
        setIsInit(false)
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
                                        value={formData.contributor.firstName}
                                        onChange={(e) => updateFormData("contributor.firstName", e.target.value)}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.contributor.lastName}
                                        onChange={(e) => updateFormData("contributor.lastName", e.target.value)}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.contributor.gender}
                                        onValueChange={(value) => updateFormData("contributor.gender", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your gender"/>
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
                                        searchPlaceholder="Search country..."
                                        data={countries}
                                        searchField="name"
                                        displayField="name"
                                        valueField="name"
                                        value={formData.contributor.nationality}
                                        onSelectAction={(value) => updateFormData("contributor.nationality", value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        disabled
                                        value={formData.contributor.phoneNumber}
                                        onChange={(e) => updateFormData("contributor.phoneNumber", e.target.value)}
                                        placeholder="+232 XX XXX XXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.contributor.email}
                                        onChange={(e) => updateFormData("contributor.email", e.target.value)}
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isAnonymous"
                                    checked={formData.contributor.isAnonymous}
                                    onCheckedChange={(checked) => updateFormData("contributor.isAnonymous", checked)}
                                />
                                <Label htmlFor="isAnonymous" className="text-sm">
                                    Make my donation anonymous (your name won't appear in public rankings)
                                </Label>
                            </div>
                        </motion.div>
                    )
                } else {
                    if (currentStep === 1 && isExistingContributory) {
                        setCurrentStep(2)
                    }
                    return null
                }

            case 2:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                        {!isExistingContributory && (
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    value={formData.amount.currency}
                                    onValueChange={(value) => updateFormData("amount.currency", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.code} value={currency.code}
                                                        disabled={currency.disabled}>
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
                                <span
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  {currencies.find((c) => c.code === formData.amount.currency)?.symbol}
                                </span>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="5"
                                    value={formData.amount.amount}
                                    onChange={(e) => updateFormData("amount.amount.", e.target.value)}
                                    placeholder="Enter amount"
                                    className="pl-8"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Minimum donation: {formatCurrencyLocal(5, formData.amount.currency)}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {[5, 10, 15, 20, 25, 30].map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFormData("amount.amount", amount.toString())}
                                    className="text-xs"
                                >
                                    {formatCurrencyLocal(amount, formData.amount.currency)}
                                </Button>
                            ))}
                        </div>

                        {formData.amount.amount >= 5 && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.95}}
                                animate={{opacity: 1, scale: 1}}
                                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <Heart className="h-4 w-4 text-green-600"/>
                                    <span className="font-medium text-green-800 dark:text-green-200">
                                        Thank you for your generosity!
                                    </span>
                                </div>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Your contribution
                                    of {formatCurrencyLocal(formData.amount.amount, formData.amount.currency)} will make
                                    a real
                                    difference in community development.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                            <Select
                                value={formData.paymentMethod}
                                onValueChange={(value) => {
                                    updateFormData("paymentMethod", value)
                                    setPaymentOptions(value as "Payment_Code" | "CheckoutSession")
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose payment method"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Payment_Code">Mobile Money</SelectItem>
                                    <SelectItem value="CheckoutSession">Credit/Debit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                )


            case 4:
                return (
                    <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="target">Contribution Target *</Label>
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
                                value={formData.districtId}
                                onValueChange={(value) => {
                                    updateFormData("districtId", value)
                                    setSelectedDistrict(districts.find((d) => d.id === value) || null)
                                    if (formData.target === "District") {
                                        updateFormData("targetId", value)
                                    } else {
                                        updateFormData("targetId", "")
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a district"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.id} value={district.id}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.target === "Chiefdom" && formData.districtId && chiefdoms && chiefdoms.length > 0 && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                className="space-y-2"
                            >
                                <Label htmlFor="chiefdom">Chiefdom *</Label>
                                <Select
                                    value={formData.targetId}
                                    onValueChange={(value) => {
                                        updateFormData("targetId", value)
                                        setSelectedChiefdom(chiefdoms.find(chiefdom => chiefdom.id === value) || null)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a chiefdom"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chiefdoms.map((chiefdom) => (
                                            <SelectItem key={chiefdom.id} value={chiefdom.id}>
                                                {chiefdom.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        )}

                        {formData.districtId && (
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
                                            : selectedChiefdom?.name}{" "}
                                        {formData.target === "Chiefdom"
                                            ? `(${selectedDistrict?.name} District)`
                                            : "District"}
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
                            <p className="text-muted-foreground">
                                Please confirm your contribution details before proceeding
                            </p>
                        </div>

                        <div className="space-y-4">
                            {!isExistingContributory && (
                                <div className="p-4 border rounded-lg">
                                    <h4 className="font-medium mb-2">Personal Information</h4>
                                    <div className="text-sm space-y-1">
                                        <p>
                                            <span
                                                className="font-medium">Name:</span> {formData.contributor.firstName}{" "}
                                            {formData.contributor.lastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Email:</span> {formData.contributor.email}
                                        </p>
                                        <p>
                                            <span
                                                className="font-medium">Phone:</span> {formData.contributor.phoneNumber}
                                        </p>
                                        <p>
                                            <span
                                                className="font-medium">Nationality:</span> {formData.contributor.nationality}
                                        </p>
                                        {formData.contributor.isAnonymous && (
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
                                        {formatCurrencyLocal(formData.amount.amount, formData.amount.currency)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Target:</span>{" "}
                                        {formData.target === "District"
                                            ? selectedDistrict?.name + " District"
                                            : selectedChiefdom?.name + ` (${selectedDistrict?.name} District)`}
                                    </p>
                                    <p>
                                        <span
                                            className="font-medium">Payment:</span> via{" "} {paymentOptions === "Payment_Code" ? "Mobile Money" : "Credit/Debit Card"}
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
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true}/>
            <div className={`flex-1 container mx-auto px-4 py-8 ${isMobile ? "mt-20" : "mt-16"}`}>
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    {!isExistingContributory && (
                        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-8 w-8 text-primary"/>
                                <h1 className="text-3xl font-bold">Love Your District</h1>
                            </div>
                            <p className="text-muted-foreground max-w-2xl">
                                Every Leone counts towards district development projects that create lasting impact.
                                Join
                                thousands of Sierra Leoneans building a better future together.
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
                                    type="tel"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="+232 XX XXX XXX"
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex flex-col justify-end">
                                <Button onClick={handleSearch} disabled={!searchTerm || isLoading}
                                        className="bg-primary">
                                    {isLoading ? (
                                        <>
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4 mr-2"/>
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Motivation Info */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-3 pb-2"
                    >
                        {isExistingContributory ? (
                            <div>
                                <p className="text-lg">
                                    Hello {formData.contributor.firstName} {formData.contributor.lastName}!
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    We're delighted to welcome you back. Great people like you continue to make a
                                    difference
                                    in the development of their districts and chiefdoms. So far, your total contribution
                                    is {" "}
                                    {data?.totalContributions.amount} {data?.totalContributions.currency} — thank you
                                    for your generosity!
                                </p>
                            </div>
                        ) : (
                            isNewContribConfirm &&
                            currentStep > 1 && (
                                <div>
                                    <p className="text-lg">
                                        Hello {formData.contributor.firstName} {formData.contributor.lastName}!
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Welcome to Love Your District! Great people like you always make a lasting
                                        impact by
                                        supporting the growth and development of their district and chiefdom.
                                    </p>
                                </div>
                            )
                        )}
                    </motion.div>

                    {/* Step Content */}
                    {!isInit && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>
                                    {isExistingContributory && currentStep === 2
                                        ? "Would you like to contribute again? Here's your chance:"
                                        : steps[currentStep - 1].description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                                <div className="flex justify-between mt-8 space-x-2">
                                    <div className="flex space-x-2">
                                        <Button variant="outline" onClick={() => router.push("/files")}>
                                            {isMobile ? <XIcon className="mr-2 h-4 w-4"/> : <span>Cancel</span>}
                                        </Button>
                                        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                                            <ChevronLeft className={isMobile ? "mr-1 h-2 w-2" : "mr-2 h-4 w-4"}/>
                                            {isMobile ? <span>Back</span> : <span>Previous</span>}
                                        </Button>
                                    </div>

                                    {currentStep === steps.length ? (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!isStepValid(currentStep) || isPending || contribute.isPending}
                                            className="bg-primary"
                                        >
                                            <Heart className={isMobile ? "mr-1 h-2 w-2" : "mr-2 h-4 w-4"}/>
                                            {isPending || contribute.isPending
                                                ? "Processing…"
                                                : isMobile
                                                    ? "Contribute"
                                                    : "Make Contribution"}
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

                    <NotFoundConfirmDialog
                        open={open404Dialog}
                        onOpenChangeAction={setOpen404Dialog}
                        onContinueAction={startFreshContrib}
                    />

                    {/* Payment Status Modal — driven entirely by SSE */}
                    <PaymentStatusModal
                        contributionResponse={activeContribution}
                        open={showPaymentModal}
                        ssePhase={ssePhase}
                        sseCountdown={sseCountdown}
                        onCloseAction={handlePaymentModalClose}
                        onSuccessAction={handlePaymentSuccess}
                    />
                </div>
            </div>
        </div>

    )
}