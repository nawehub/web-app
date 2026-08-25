'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ImagePlus,
    ShieldCheck,
    X,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CustomDatePicker } from "@/components/ui/date-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiStepForm, useMultiStepForm, type FormStep } from "@/components/ui/multi-step-form"
import { cn } from "@/lib/utils"
import { formatResponse } from "@/utils/format-response"
import { useOpportunitySubmissionMutation } from "@/hooks/repository/use-opportunity-submission"
import {
    GEOGRAPHIC_SCOPE_OPTIONS,
    OPPORTUNITY_CATEGORIES,
    OPPORTUNITY_TARGET_BENEFICIARIES,
    ORGANIZATION_TYPES,
} from "@/lib/gateway-enums"
import {
    OPPORTUNITY_WIZARD_STEPS,
    opportunitySubmissionDefaults,
    opportunitySubmissionSchema,
    type OpportunitySubmissionForm,
    type OpportunitySubmissionResponse,
} from "@/types/opportunity-submission"

const MAX_BANNER_BYTES = 10 * 1024 * 1024 // 10 MB

/** Object URL for a File preview, revoked on change/unmount so blob URLs don't leak. */
function useObjectUrl(file: File | null): string | null {
    const [url, setUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!file) {
            setUrl(null)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setUrl(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])
    return url
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
    if (!value) return null
    return (
        <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground sm:text-right">{value}</span>
        </div>
    )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <h4 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">{title}</h4>
            <div className="divide-y divide-border">{children}</div>
        </div>
    )
}

function CheckboxOptionGroup({
    options, value, onChange, columns = 2,
}: {
    options: { label: string; value: string }[]
    value: string[]
    onChange: (next: string[]) => void
    columns?: 1 | 2
}) {
    const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
    return (
        <div className={cn("grid gap-x-6 gap-y-2.5", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
            {options.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                    <Checkbox checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
                    {opt.label}
                </label>
            ))}
        </div>
    )
}

function BannerUpload({
    file, previewUrl, error, onChange,
}: {
    file: File | null
    previewUrl: string | null
    error: string | null
    onChange: (f: File | null) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (files: FileList | null) => {
        const picked = files?.[0]
        if (!picked) return
        onChange(picked)
    }

    return (
        <div className="space-y-3">
            {!file ? (
                <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <ImagePlus className="h-7 w-7" />
                    </span>
                    <div>
                        <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP — max 10 MB</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">Recommended: 1200 × 630 px (landscape)</p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </label>
            ) : (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
                    {previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="Opportunity banner preview" className="h-52 w-full object-cover" />
                    )}
                    <div className="flex items-center justify-between gap-3 border-t border-border bg-card/80 p-3 backdrop-blur-sm">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Remove banner image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-error))]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                </p>
            )}
        </div>
    )
}

const DETAILS_FIELDS = ["title", "categories", "categoryOther", "description"] as const
const PROVIDER_FIELDS = [
    "organizationName", "organizationTypes", "organizationTypeOther",
    "targetBeneficiaries", "targetBeneficiaryOther", "eligibilityCriteria", "deadline",
] as const
const CONTACT_FIELDS = [
    "applicationLink", "contactEmail", "contactPhone", "additionalContact",
    "geographicScope", "geographicScopeOther",
] as const
const MEDIA_FIELDS = ["submittedBy", "declared"] as const

export default function SubmitOpportunityForm() {
    const wizard = useMultiStepForm(OPPORTUNITY_WIZARD_STEPS.length)
    const submitMutation = useOpportunitySubmissionMutation()

    const [flier, setFlier] = useState<File | null>(null)
    const [flierError, setFlierError] = useState<string | null>(null)
    const flierPreviewUrl = useObjectUrl(flier)
    const [result, setResult] = useState<OpportunitySubmissionResponse | null>(null)

    const form = useForm<OpportunitySubmissionForm>({
        resolver: zodResolver(opportunitySubmissionSchema),
        defaultValues: opportunitySubmissionDefaults,
        mode: "onBlur",
    })

    // Narrowly scoped to just the 4 "Other"-reveal-gating fields - watching the
    // whole form here would re-render (and rebuild every step's content,
    // including live Controllers) on every keystroke in any field.
    const [categories, organizationTypes, targetBeneficiaries, geographicScope] = useWatch({
        control: form.control,
        name: ["categories", "organizationTypes", "targetBeneficiaries", "geographicScope"],
    })

    function handleFlierChange(file: File | null) {
        if (file && !file.type.startsWith("image/")) {
            setFlierError("Please upload an image file (PNG, JPG, or WEBP).")
            return
        }
        if (file && file.size > MAX_BANNER_BYTES) {
            setFlierError("Image is over 10 MB. Please upload a smaller file.")
            return
        }
        setFlierError(null)
        setFlier(file)
    }

    async function onSubmit() {
        const data = form.getValues()
        try {
            const response = await submitMutation.mutateAsync({ data, flier })
            setResult(response)
            wizard.nextStep()
        } catch (error) {
            toast("Submission failed", {
                description: error instanceof Error ? formatResponse(error.message) || error.message : "An unknown error occurred",
                className: "bg-[hsl(var(--color-error))] text-white",
            })
        }
    }

    const steps: FormStep[] = [
        {
            id: OPPORTUNITY_WIZARD_STEPS[0].id,
            title: OPPORTUNITY_WIZARD_STEPS[0].title,
            description: OPPORTUNITY_WIZARD_STEPS[0].description,
            validate: () => form.trigger(DETAILS_FIELDS as unknown as (keyof OpportunitySubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Opportunity Title *</FormLabel>
                                <FormControl><Input {...field} placeholder="Enter opportunity title" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="categories"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Opportunity Category *</FormLabel>
                                <FormControl>
                                    <CheckboxOptionGroup options={OPPORTUNITY_CATEGORIES} value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {categories?.includes("OTHER") && (
                        <FormField
                            name="categoryOther"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Other Category *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Please specify" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brief Description *</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={5} placeholder="Provide a concise summary of the opportunity, its purpose and benefits" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: OPPORTUNITY_WIZARD_STEPS[1].id,
            title: OPPORTUNITY_WIZARD_STEPS[1].title,
            description: OPPORTUNITY_WIZARD_STEPS[1].description,
            validate: () => form.trigger(PROVIDER_FIELDS as unknown as (keyof OpportunitySubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="organizationName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organization / Institution Name *</FormLabel>
                                <FormControl><Input {...field} placeholder="Enter organization or institution name" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="organizationTypes"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organization Type *</FormLabel>
                                <FormControl>
                                    <CheckboxOptionGroup options={ORGANIZATION_TYPES} value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {organizationTypes?.includes("OTHER") && (
                        <FormField
                            name="organizationTypeOther"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Other Organization Type *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Please specify" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="targetBeneficiaries"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Beneficiaries *</FormLabel>
                                <FormControl>
                                    <CheckboxOptionGroup options={OPPORTUNITY_TARGET_BENEFICIARIES} value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {targetBeneficiaries?.includes("OTHER") && (
                        <FormField
                            name="targetBeneficiaryOther"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Other Beneficiary Group *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Please specify" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="eligibilityCriteria"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eligibility Criteria</FormLabel>
                                <FormControl><Textarea {...field} rows={3} placeholder="Describe who is eligible to apply..." /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="deadline"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Deadline *</FormLabel>
                                <FormControl>
                                    <CustomDatePicker date={field.value} setDateAction={field.onChange} isRequired isDisable={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: OPPORTUNITY_WIZARD_STEPS[2].id,
            title: OPPORTUNITY_WIZARD_STEPS[2].title,
            description: OPPORTUNITY_WIZARD_STEPS[2].description,
            validate: () => form.trigger(CONTACT_FIELDS as unknown as (keyof OpportunitySubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="applicationLink"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Application Link *</FormLabel>
                                <FormControl><Input {...field} type="url" placeholder="https://" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="contactEmail"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email *</FormLabel>
                                    <FormControl><Input {...field} type="email" placeholder="example@organization.org" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="contactPhone"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Phone *</FormLabel>
                                    <FormControl><Input {...field} type="tel" placeholder="e.g. +232 76 123456" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="additionalContact"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Additional Contact Person</FormLabel>
                                <FormControl><Input {...field} placeholder="Full name and role (e.g. Program Officer)" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="geographicScope"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Geographic Scope *</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col gap-2.5">
                                        {GEOGRAPHIC_SCOPE_OPTIONS.map((opt) => (
                                            <div className="flex items-center space-x-2" key={opt.value}>
                                                <RadioGroupItem value={opt.value} id={`scope-${opt.value}`} />
                                                <Label htmlFor={`scope-${opt.value}`} className="font-normal">{opt.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {geographicScope === "OTHER" && (
                        <FormField
                            name="geographicScopeOther"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specify Other Scope *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Please specify" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            ),
        },
        {
            id: OPPORTUNITY_WIZARD_STEPS[3].id,
            title: OPPORTUNITY_WIZARD_STEPS[3].title,
            description: OPPORTUNITY_WIZARD_STEPS[3].description,
            validate: () => form.trigger(MEDIA_FIELDS as unknown as (keyof OpportunitySubmissionForm)[]),
            content: (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Banner Image (Optional)</Label>
                        <p className="text-xs text-muted-foreground">
                            Shown on the opportunity listing card and detail page.
                        </p>
                        <BannerUpload file={flier} previewUrl={flierPreviewUrl} error={flierError} onChange={handleFlierChange} />
                    </div>

                    <FormField
                        name="submittedBy"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Submitted By *</FormLabel>
                                <FormControl><Input {...field} placeholder="Your full name" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="declared"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                                <Checkbox id="declared" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                                <Label htmlFor="declared" className="cursor-pointer font-normal leading-snug text-muted-foreground">
                                    I confirm that the information submitted is accurate and that the opportunity is legitimate and
                                    intended to support entrepreneurs, innovators, startups, SMEs, or related beneficiaries.
                                </Label>
                            </div>
                        )}
                    />
                    {form.formState.errors.declared && (
                        <p className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-error))]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {form.formState.errors.declared.message}
                        </p>
                    )}
                </div>
            ),
        },
        {
            id: OPPORTUNITY_WIZARD_STEPS[4].id,
            title: OPPORTUNITY_WIZARD_STEPS[4].title,
            description: OPPORTUNITY_WIZARD_STEPS[4].description,
            // A plain snapshot (not a subscription) - the review step only needs to be
            // correct at the moment it's shown, which is whenever this array is rebuilt
            // (every render), not live on every keystroke elsewhere.
            content: (() => {
                const v = form.getValues()
                const categoryLabels = OPPORTUNITY_CATEGORIES.filter((c) => v.categories?.includes(c.value)).map((c) => c.label).join(", ")
                const orgTypeLabels = ORGANIZATION_TYPES.filter((o) => v.organizationTypes?.includes(o.value)).map((o) => o.label).join(", ")
                const beneficiaryLabels = OPPORTUNITY_TARGET_BENEFICIARIES.filter((b) => v.targetBeneficiaries?.includes(b.value)).map((b) => b.label).join(", ")
                const scopeLabel = GEOGRAPHIC_SCOPE_OPTIONS.find((s) => s.value === v.geographicScope)?.label
                return (
                    <div className="space-y-4">
                        <ReviewSection title="Opportunity Details">
                            <ReviewRow label="Title" value={v.title} />
                            <ReviewRow label="Categories" value={categoryLabels} />
                            <ReviewRow label="Description" value={v.description} />
                        </ReviewSection>

                        <ReviewSection title="Provider & Eligibility">
                            <ReviewRow label="Organization" value={v.organizationName} />
                            <ReviewRow label="Organization Type" value={orgTypeLabels} />
                            <ReviewRow label="Target Beneficiaries" value={beneficiaryLabels} />
                            <ReviewRow label="Eligibility" value={v.eligibilityCriteria} />
                            <ReviewRow label="Deadline" value={v.deadline?.toLocaleDateString()} />
                        </ReviewSection>

                        <ReviewSection title="Contact & Reach">
                            <ReviewRow label="Application Link" value={v.applicationLink} />
                            <ReviewRow label="Contact Email" value={v.contactEmail} />
                            <ReviewRow label="Contact Phone" value={v.contactPhone} />
                            <ReviewRow label="Additional Contact" value={v.additionalContact} />
                            <ReviewRow label="Geographic Scope" value={scopeLabel} />
                        </ReviewSection>

                        <ReviewSection title="Submitter">
                            <ReviewRow label="Submitted By" value={v.submittedBy} />
                            {flierPreviewUrl && (
                                <div className="pt-3">
                                    <span className="text-sm text-muted-foreground">Banner Image</span>
                                    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={flierPreviewUrl} alt="Uploaded banner" className="max-h-56 w-full object-cover" />
                                    </div>
                                </div>
                            )}
                        </ReviewSection>
                    </div>
                )
            })(),
        },
    ]

    if (result) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24">
                <Card className="border-primary/20">
                    <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <CheckCircle2 className="h-8 w-8" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Opportunity Submitted
                            </h2>
                            <p className="mt-2 max-w-md text-muted-foreground">
                                Thank you for helping us connect opportunities with entrepreneurs and innovators across Sierra Leone.
                                Our team will review &ldquo;{result.title}&rdquo; and get back to you shortly.
                            </p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link href="/opportunities">
                                <Button className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back to Opportunities
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    form.reset(opportunitySubmissionDefaults)
                                    setFlier(null)
                                    setResult(null)
                                    wizard.reset()
                                }}
                            >
                                Submit another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-14">
            <Form {...form}>
                <Card className="overflow-visible p-6 sm:p-8">
                    <MultiStepForm
                        steps={steps}
                        currentStep={wizard.currentStep}
                        onStepChange={wizard.setCurrentStep}
                        onComplete={onSubmit}
                        allowStepNavigation
                        isSubmitting={submitMutation.isPending}
                        labels={{ submit: "Submit Opportunity", submitting: "Submitting..." }}
                    />
                </Card>
            </Form>

            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-6 py-4 text-center text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span>
                    Thank you for helping us connect opportunities with entrepreneurs, innovators and SME owners.
                    Together, we build a stronger innovation and entrepreneurship ecosystem.
                </span>
            </div>
        </div>
    )
}
