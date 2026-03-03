"use client"

import React, { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Heart, ChevronLeft, ChevronRight, MapPin, Users,
  CreditCard, CheckCircle, Search, XIcon,
} from "lucide-react"
import { paymentProviders, currencies } from "@/lib/lyd-data"
import type { LYDProfile, LYDDonation, MakeDonationRequest } from "@/types/lyd"
import { allDistricts } from "@/types/demographs"
import { useMakeDonationMutation, useProfileWithContributionQuery } from "@/hooks/repository/use-lyd"
import { useToast } from "@/components/ui/use-toast"
import { countries } from "@/utils/countries"
import { CustomCombobox } from "@/components/ui/combobox"
import { formatResponse } from "@/utils/format-response"
import { NotFoundConfirmDialog } from "@/app/lyd/_components/NotFoundConfirmDialog"
import { PaymentStatusModal } from "@/app/lyd/_components/payment-status-modal"
import { useIsMobile } from "@/hooks/use-mobile"

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
    firstName: "", lastName: "", gender: "",
    phoneNumber: "", email: "", nationality: "", isAnonymous: false,
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
  { id: 1, title: "Personal Info",    description: "Your details",             icon: Users },
  { id: 2, title: "Contribution",     description: "Set your contribution",    icon: Heart },
  { id: 3, title: "Payment Method",   description: "How you'll pay",           icon: CreditCard },
  { id: 4, title: "Target Selection", description: "Choose district/chiefdom", icon: MapPin },
  { id: 5, title: "Confirmation",     description: "Review & submit",          icon: CheckCircle },
]

export function DonationForm({ onSubmitAction, onCancelAction }: DonationFormProps) {
  const [searchTerm, setSearchTerm]           = useState("")
  const [currentStep, setCurrentStep]         = useState(1)
  const [formData, setFormData]               = useState<FormData>(initialFormData)
  const [isPending, startTransition]          = useTransition()
  const donate                                = useMakeDonationMutation()
  const [isLoading, setIsLoading]             = useState(false)
  const { data, refetch }                     = useProfileWithContributionQuery(searchTerm)
  const [isExisting, setIsExisting]           = useState(false)
  const { toast }                             = useToast()
  const [paymentOptions, setPaymentOptions]   = useState({ method: "", provider: "" })
  const [isNewContrib, setIsNewContrib]       = useState(false)
  const [isInit, setIsInit]                   = useState(true)
  const [open404, setOpen404]                 = useState(false)
  const isMobile                              = useIsMobile()

  // ── Payment modal state ────────────────────────────────────────────────────
  const [contributionId, setContributionId]   = useState<string | null>(null)
  const [showPayment, setShowPayment]         = useState(false)

  const updateFormData = (field: string, value: any) => {
    if (field.startsWith("profile.")) {
      const key = field.split(".")[1]
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const selectedDistrict    = allDistricts.find(d => d.name === formData.district)
  const availableChiefdoms  = selectedDistrict?.chiefdoms ?? []

  const nextStep = () => { if (currentStep < steps.length) setCurrentStep(s => s + 1) }
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s === 4 ? s - 2 : s - 1)
  }

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const req: MakeDonationRequest = {
          profile:         formData.profile,
          amount:          Number.parseFloat(formData.amount.toString()),
          target:          formData.target as "District" | "Chiefdom",
          district:        formData.district,
          paymentMethod:   formData.paymentMethod as "Momo" | "Bank" | "Card",
          paymentProvider: formData.paymentProvider,
          currency:        formData.currency as MakeDonationRequest["currency"],
          targetValue:     formData.targetValue,
        }

        const response = await donate.mutateAsync(req)

        if (response?.contributionId) {
          // Open payment modal - SSE drives it from here
          setContributionId(response.contributionId)
          setShowPayment(true)
        } else {
          toast({ title: "Contribution submitted", description: response?.message, className: "bg-green-50 dark:bg-green-900" })
          onSubmitAction(req)
        }
      } catch (e) {
        toast({
          title: "Contribution failed",
          description: e instanceof Error ? formatResponse(e.message) : "An error occurred",
          variant: "destructive",
        })
      }
    })
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    setContributionId(null)
    toast({ title: "Contribution confirmed 🎉", description: "Thank you! Your contribution has been received.", className: "bg-green-50 dark:bg-green-900" })
    onSubmitAction({})
  }

  const handlePaymentClose = () => {
    setShowPayment(false)
    setContributionId(null)
    // Returns user to form step 5 to retry
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.profile.firstName && formData.profile.lastName && formData.profile.phoneNumber && formData.profile.gender && formData.profile.nationality)
      case 2: return formData.amount >= 5
      case 3: return !!(formData.paymentMethod && formData.paymentProvider)
      case 4: return !!(formData.target && formData.district && formData.targetValue)
      case 5: return true
      default: return false
    }
  }

  const fmtCurrency = (amount: number, currency: string) => {
    const info = currencies.find(c => c.code === currency)
    return `${info?.symbol}${amount.toLocaleString()}`
  }

  const handleSearch = async () => {
    if (!searchTerm) return
    setIsLoading(true)
    try {
      const result = await refetch()
      if (result.data) {
        setFormData({ ...formData,
          profile: {
            firstName: result.data.firstName, lastName: result.data.lastName,
            phoneNumber: result.data.phoneNumber, email: result.data.email,
            nationality: result.data.nationality, isAnonymous: result.data.isAnonymous ?? false,
            gender: result.data.gender,
          },
          currency: result.data.currency,
          paymentMethod: result.data.paymentMethod,
          paymentProvider: result.data.paymentProvider,
        })
        getPayMethod(result.data.paymentMethod)
        getPayProvider(result.data.paymentProvider)
        setIsExisting(true); setIsNewContrib(false); setIsInit(false)
      } else {
        setIsExisting(false)
        setOpen404(true)
        updateFormData("profile.phoneNumber", searchTerm)
      }
    } finally { setIsLoading(false) }
  }

  const getPayMethod = (val: string) => {
    const map: Record<string, string> = { Momo: "Mobile Money", Bank: "Bank Transfer", Card: "Credit/Debit Card" }
    setPaymentOptions(prev => ({ ...prev, method: map[val] ?? "" }))
  }
  const getPayProvider = (val: string) => {
    const map: Record<string, string> = { m17: "Orange Money", m18: "Afri Money" }
    setPaymentOptions(prev => ({ ...prev, provider: map[val] ?? "" }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        if (!isExisting && isNewContrib && !isInit) {
          return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input value={formData.profile.firstName} onChange={e => updateFormData("profile.firstName", e.target.value)} placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input value={formData.profile.lastName} onChange={e => updateFormData("profile.lastName", e.target.value)} placeholder="Enter your last name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.profile.gender} onValueChange={v => updateFormData("profile.gender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Prefer_Not_To_Say">Prefer Not to Say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nationality *</Label>
                  <CustomCombobox placeholder="Select nationality" searchPlaceholder="Search country…" data={countries} searchField="name" displayField="name" valueField="name" value={formData.profile.nationality} onSelectAction={v => updateFormData("profile.nationality", v)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input disabled value={formData.profile.phoneNumber} placeholder="+232 XX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={formData.profile.email} onChange={e => updateFormData("profile.email", e.target.value)} placeholder="your.email@example.com" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="anon" checked={formData.profile.isAnonymous} onCheckedChange={v => updateFormData("profile.isAnonymous", v)} />
                <Label htmlFor="anon" className="text-sm">Make my donation anonymous (won't appear in public rankings)</Label>
              </div>
            </motion.div>
          )
        } else {
          if (isExisting && currentStep === 1) setCurrentStep(2)
          return null
        }

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            {!isExisting && (
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={v => updateFormData("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map(c => (
                      <SelectItem key={c.code} value={c.code} disabled={c.disabled}>{c.symbol} {c.name} ({c.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Contribution Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencies.find(c => c.code === formData.currency)?.symbol}</span>
                <Input type="number" min="5" value={formData.amount} onChange={e => updateFormData("amount", e.target.value)} placeholder="Enter amount" className="pl-8" />
              </div>
              <p className="text-xs text-muted-foreground">Minimum: {fmtCurrency(5, formData.currency)}</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[5, 10, 15, 20, 25, 30].map(a => (
                <Button key={a} variant="outline" size="sm" onClick={() => updateFormData("amount", a)} className="text-xs">{fmtCurrency(a, formData.currency)}</Button>
              ))}
            </div>
            {formData.amount >= 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Thank you for your generosity!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">Your donation of {fmtCurrency(formData.amount, formData.currency)} will make a real difference.</p>
              </motion.div>
            )}
          </motion.div>
        )

      case 3:
        if (!isExisting) {
          return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={v => { updateFormData("paymentMethod", v); updateFormData("paymentProvider", ""); getPayMethod(v) }}>
                  <SelectTrigger><SelectValue placeholder="Choose payment method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Momo">Mobile Money</SelectItem>
                    <SelectItem value="Bank" disabled>Bank Transfer</SelectItem>
                    <SelectItem value="Card" disabled>Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.paymentMethod && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  <Label>Payment Provider *</Label>
                  <Select value={formData.paymentProvider} onValueChange={v => { updateFormData("paymentProvider", v); getPayProvider(v) }}>
                    <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                    <SelectContent>
                      {paymentProviders[formData.paymentMethod as keyof typeof paymentProviders]?.map(p => (
                        <SelectItem key={p.id} value={p.id} disabled={p.id !== "m17"}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </motion.div>
          )
        } else {
          setCurrentStep(4)
          return null
        }

      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2">
              <Label>Donation Target *</Label>
              <Select value={formData.target} onValueChange={v => { updateFormData("target", v); updateFormData("targetId", "") }}>
                <SelectTrigger><SelectValue placeholder="Choose your target" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="District">Entire District</SelectItem>
                  <SelectItem value="Chiefdom">Specific Chiefdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District *</Label>
              <Select value={formData.district} onValueChange={v => { updateFormData("district", v); updateFormData("targetValue", formData.target === "District" ? v : "") }}>
                <SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger>
                <SelectContent>
                  {allDistricts.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {formData.target === "Chiefdom" && formData.district && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                <Label>Chiefdom *</Label>
                <Select value={formData.targetValue} onValueChange={v => updateFormData("targetValue", v)}>
                  <SelectTrigger><SelectValue placeholder="Select a chiefdom" /></SelectTrigger>
                  <SelectContent>
                    {availableChiefdoms.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
            {formData.district && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-primary" /><span className="font-medium">Your Selection</span></div>
                <p className="text-sm text-muted-foreground">
                  Contributing to: <span className="font-medium text-foreground">
                    {formData.target === "District" ? `${selectedDistrict?.name} District` : `${formData.targetValue} (${selectedDistrict?.name} District)`}
                  </span>
                </p>
              </motion.div>
            )}
          </motion.div>
        )

      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Review Your Contribution</h3>
              <p className="text-muted-foreground">Please confirm your details before proceeding</p>
            </div>
            <div className="space-y-4">
              {!isExisting && (
                <div className="p-4 border rounded-lg text-sm space-y-1">
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <p><span className="font-medium">Name:</span> {formData.profile.firstName} {formData.profile.lastName}</p>
                  <p><span className="font-medium">Phone:</span> {formData.profile.phoneNumber}</p>
                  <p><span className="font-medium">Nationality:</span> {formData.profile.nationality}</p>
                  {formData.profile.isAnonymous && <p className="text-orange-600"><span className="font-medium">Anonymous:</span> Yes</p>}
                </div>
              )}
              <div className="p-4 border rounded-lg text-sm space-y-1">
                <h4 className="font-medium mb-2">Contribution Details</h4>
                <p><span className="font-medium">Amount:</span> {fmtCurrency(formData.amount, formData.currency)}</p>
                <p><span className="font-medium">Target:</span> {formData.target === "District" ? `${selectedDistrict?.name} District` : `${formData.targetValue} (${selectedDistrict?.name} District)`}</p>
                <p><span className="font-medium">Payment:</span> {paymentOptions.method} via {paymentOptions.provider}</p>
              </div>
            </div>
          </motion.div>
        )

      default: return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isExisting && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Love Your District</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">Every Leone counts towards district development projects. Join thousands of Sierra Leoneans building a better future together.</p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Phone Number</Label>
            <Input id="search" type="tel" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="+232 XX XXX XXX" className="mt-1" />
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={handleSearch} disabled={!searchTerm || isLoading} className="bg-primary">
              {isLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Searching…</> : <><Search className="h-4 w-4 mr-2" />Search</>}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 pb-2">
        {isExisting ? (
          <div>
            <p className="text-lg">Hello {formData.profile.firstName} {formData.profile.lastName}!</p>
            <p className="text-muted-foreground text-sm">Welcome back. Your total contribution so far is SLE {data?.totalContributions} — thank you!</p>
          </div>
        ) : isNewContrib && currentStep > 1 ? (
          <div>
            <p className="text-lg">Hello {formData.profile.firstName} {formData.profile.lastName}!</p>
            <p className="text-muted-foreground text-sm">Welcome to Love Your District! Every contribution makes a lasting impact on your district and chiefdom.</p>
          </div>
        ) : null}
      </motion.div>

      {!isInit && (
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {isExisting && currentStep === 2 ? "Would you like to contribute again? Here's your chance:" : steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            <div className="flex justify-between mt-8 gap-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancelAction}>
                  {isMobile ? <XIcon className="h-4 w-4" /> : "Cancel"}
                </Button>
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && " Previous"}
                </Button>
              </div>
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit} disabled={!isStepValid(currentStep) || isPending} className="bg-primary">
                  <Heart className="h-4 w-4 mr-2" />
                  {isPending ? "Processing…" : isMobile ? "Contribute" : "Make Contribution"}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!isStepValid(currentStep)}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <NotFoundConfirmDialog open={open404} onOpenChangeAction={setOpen404} onContinueAction={() => { setIsExisting(false); setIsNewContrib(true); setIsInit(false) }} />

      {/* SSE-driven payment modal — opened right after submit */}
      <PaymentStatusModal
        contributionId={contributionId}
        open={showPayment}
        onClose={handlePaymentClose}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
