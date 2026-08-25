'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    AlertCircle,
    Building2,
    Calendar as CalendarIcon,
    CheckCircle2,
    Copy,
    FileCheck2,
    IdCard,
    Sparkles,
    Upload,
    X,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CustomCombobox } from "@/components/ui/combobox"
import { CustomDatePicker } from "@/components/ui/date-picker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiStepForm, useMultiStepForm, type FormStep } from "@/components/ui/multi-step-form"
import { countries } from "@/utils/countries"
import { formatResponse } from "@/utils/format-response"
import { usePublicBusinessRegistrationMutation } from "@/hooks/repository/use-business-registration"
import {
    BUSINESS_CATEGORIES,
    BUSINESS_ENTITY_TYPES,
    IDENTITY_DOC_TYPES,
    REGISTRATION_WIZARD_STEPS,
    businessRegistrationDefaults,
    businessRegistrationSchema,
    getDate15YearsAgo,
    type BusinessRegistrationForm,
    type BusinessRegistrationResponse,
} from "@/types/business-registration"

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB

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

function IdentityDocumentUpload({
    docType,
    onDocTypeChange,
    file,
    previewUrl,
    onFileChange,
    error,
}: {
    docType: "NATIONAL_ID" | "PASSPORT"
    onDocTypeChange: (type: "NATIONAL_ID" | "PASSPORT") => void
    file: File | null
    previewUrl: string | null
    onFileChange: (file: File | null) => void
    error: string | null
}) {
    function handleFiles(files: FileList | null) {
        const picked = files?.[0]
        if (!picked) return
        onFileChange(picked)
    }

    return (
        <div className="space-y-3">
            <Label>Identity Document *</Label>

            <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                {IDENTITY_DOC_TYPES.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => onDocTypeChange(value)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                            docType === value
                                ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {!file ? (
                <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault()
                        handleFiles(e.dataTransfer.files)
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Upload className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground">
                        A photo of your {docType === "NATIONAL_ID" ? "National ID" : "Passport"} &mdash; JPG, PNG or WEBP, up to 5MB
                    </span>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                    <div className="flex min-w-0 items-center gap-3">
                        {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl} alt="Identity document preview" className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover" />
                        ) : (
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <FileCheck2 className="h-5 w-5" />
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onFileChange(null)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {error ? (
                <p className="flex items-start gap-1.5 text-xs text-[hsl(var(--color-error))]">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            ) : (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Make sure all four corners are visible and the details are legible.
                </p>
            )}
        </div>
    )
}

const BUSINESS_FIELDS = ["businessName", "businessCategory", "businessEntityType", "businessAddress", "businessActivities"] as const
const OWNER_FIELDS = [
    "ownerName", "placeOfBirth", "dateOfBirth", "gender", "ownerAddress",
    "contactNumber", "email", "mothersName", "nationality",
] as const
const IDENTITY_FIELDS = ["ninPassport", "occupation", "docType", "isAlreadyRegistered", "registrationNumber", "registerDate"] as const

export default function RegisterForm() {
    const router = useRouter()
    const wizard = useMultiStepForm(REGISTRATION_WIZARD_STEPS.length)
    const register = usePublicBusinessRegistrationMutation()

    const [entityDescriptions, setEntityDescriptions] = useState<string[]>([])
    const [idScan, setIdScan] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const idScanPreviewUrl = useObjectUrl(idScan)
    const [result, setResult] = useState<BusinessRegistrationResponse | null>(null)

    const form = useForm<BusinessRegistrationForm>({
        resolver: zodResolver(businessRegistrationSchema),
        defaultValues: businessRegistrationDefaults,
        mode: "onBlur",
    })
    // Narrowly scoped: only this field needs to re-render the wizard live as the user
    // types elsewhere (it gates the registration-number/date reveal on step 3). Watching
    // the whole form here would re-render (and rebuild all 4 steps' content, including
    // every other step's live Controllers) on every keystroke in any field.
    const isAlreadyRegistered = useWatch({ control: form.control, name: "isAlreadyRegistered" })

    function handleFileChange(file: File | null) {
        if (file && !file.type.startsWith("image/")) {
            setFileError("Please upload an image file (JPG, PNG, or WEBP) — other file types aren't supported.")
            return
        }
        if (file && file.size > MAX_FILE_BYTES) {
            setFileError("That file is over 5MB — please upload a smaller copy.")
            return
        }
        setFileError(null)
        setIdScan(file)
    }

    async function validateIdentityStep() {
        const ok = await form.trigger(IDENTITY_FIELDS as unknown as (keyof BusinessRegistrationForm)[])
        if (!idScan) {
            setFileError("Please upload a photo of your identity document.")
            return false
        }
        return ok
    }

    async function onSubmit() {
        const data = form.getValues()
        try {
            const response = await register.mutateAsync({ data, idScan })
            setResult(response)
            wizard.nextStep()
        } catch (error) {
            toast("Registration failed", {
                description: error instanceof Error ? formatResponse(error.message) || error.message : "An unknown error occurred",
                className: "bg-[hsl(var(--color-error))] text-white",
            })
        }
    }

    const steps: FormStep[] = [
        {
            id: REGISTRATION_WIZARD_STEPS[0].id,
            title: REGISTRATION_WIZARD_STEPS[0].title,
            description: REGISTRATION_WIZARD_STEPS[0].description,
            validate: () => form.trigger(BUSINESS_FIELDS as unknown as (keyof BusinessRegistrationForm)[]),
            content: (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="businessName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. AgriSalone Ltd." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="businessCategory"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Category *</FormLabel>
                                    <FormControl>
                                        <CustomCombobox
                                            data={BUSINESS_CATEGORIES}
                                            searchField="label"
                                            displayField="label"
                                            valueField="label"
                                            value={field.value ?? ""}
                                            placeholder="Select your business category"
                                            searchPlaceholder="Search category..."
                                            onSelectAction={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="businessEntityType"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Entity Type *</FormLabel>
                                <FormControl>
                                    <CustomCombobox
                                        data={BUSINESS_ENTITY_TYPES}
                                        searchField="name"
                                        displayField="name"
                                        valueField="name"
                                        value={field.value ?? ""}
                                        placeholder="Select your business entity type"
                                        searchPlaceholder="Search entity type..."
                                        onSelectAction={(value) => {
                                            field.onChange(value)
                                            setEntityDescriptions(BUSINESS_ENTITY_TYPES.find((t) => t.name === value)?.descriptions ?? [])
                                        }}
                                    />
                                </FormControl>
                                {entityDescriptions.length > 0 && (
                                    <div className="space-y-1 rounded-xl bg-muted/50 p-3">
                                        {entityDescriptions.map((d, i) => (
                                            <p key={i} className="text-xs leading-relaxed text-muted-foreground">{d}</p>
                                        ))}
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="businessAddress"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Address *</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={2} placeholder="Street, town, district" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="businessActivities"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Activities *</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={5} placeholder="Briefly describe what the business does" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: REGISTRATION_WIZARD_STEPS[1].id,
            title: REGISTRATION_WIZARD_STEPS[1].title,
            description: REGISTRATION_WIZARD_STEPS[1].description,
            validate: () => form.trigger(OWNER_FIELDS as unknown as (keyof BusinessRegistrationForm)[]),
            content: (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="ownerName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner Name *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Full legal name" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="placeOfBirth"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Place of Birth *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Town / city" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="dateOfBirth"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth *</FormLabel>
                                    <FormControl>
                                        <CustomDatePicker
                                            date={field.value}
                                            setDateAction={field.onChange}
                                            isRequired
                                            isDisable={(date) => date > getDate15YearsAgo() || date < new Date("1900-01-01")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="gender"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender *</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex h-11 items-center gap-6">
                                            {(["Male", "Female"] as const).map((gender) => (
                                                <div className="flex items-center space-x-2" key={gender}>
                                                    <RadioGroupItem value={gender} id={`gender-${gender}`} />
                                                    <Label htmlFor={`gender-${gender}`} className="font-normal">{gender}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="ownerAddress"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Owner Address *</FormLabel>
                                <FormControl><Input {...field} placeholder="Current residential address" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="contactNumber"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner&rsquo;s Contact Number *</FormLabel>
                                    <FormControl><Input {...field} placeholder="+232 ..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner or Business Email *</FormLabel>
                                    <FormControl><Input {...field} type="email" placeholder="name@example.com" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="mothersName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mother&rsquo;s Name *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Mother's full name" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="nationality"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner&rsquo;s Nationality *</FormLabel>
                                    <FormControl>
                                        <CustomCombobox
                                            data={countries}
                                            searchField="name"
                                            displayField="name"
                                            valueField="name"
                                            value={field.value ?? ""}
                                            placeholder="Select your nationality"
                                            searchPlaceholder="Search country..."
                                            onSelectAction={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            ),
        },
        {
            id: REGISTRATION_WIZARD_STEPS[2].id,
            title: REGISTRATION_WIZARD_STEPS[2].title,
            description: REGISTRATION_WIZARD_STEPS[2].description,
            validate: validateIdentityStep,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="ninPassport"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="inline-flex items-center gap-1.5">
                                            <IdCard className="h-3.5 w-3.5" /> NIN / Passport Number *
                                        </span>
                                    </FormLabel>
                                    <FormControl><Input {...field} placeholder="Enter your NIN or passport number" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="occupation"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation</FormLabel>
                                    <FormControl><Input {...field} placeholder="What is your occupation?" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="isAlreadyRegistered"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                                <Checkbox id="isAlreadyRegistered" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                                <Label htmlFor="isAlreadyRegistered" className="cursor-pointer font-normal leading-snug">
                                    This business is already formally registered — I have a registration number and date.
                                </Label>
                            </div>
                        )}
                    />

                    {isAlreadyRegistered && (
                        <div className="grid animate-fade-in-up grid-cols-1 gap-5 rounded-2xl border border-border bg-card p-4 md:grid-cols-2">
                            <FormField
                                name="registrationNumber"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registration Number *</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g. BN-2024-00123" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="registerDate"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <span className="inline-flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> Registration Date *</span>
                                        </FormLabel>
                                        <FormControl>
                                            <CustomDatePicker date={field.value} setDateAction={field.onChange} isRequired isDisable={(date) => date > new Date()} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        name="docType"
                        control={form.control}
                        render={({ field }) => (
                            <IdentityDocumentUpload
                                docType={field.value}
                                onDocTypeChange={field.onChange}
                                file={idScan}
                                previewUrl={idScanPreviewUrl}
                                onFileChange={handleFileChange}
                                error={fileError}
                            />
                        )}
                    />
                </div>
            ),
        },
        {
            id: REGISTRATION_WIZARD_STEPS[3].id,
            title: REGISTRATION_WIZARD_STEPS[3].title,
            description: REGISTRATION_WIZARD_STEPS[3].description,
            // A plain snapshot (not a subscription) - the review step only needs to be
            // correct at the moment it's shown, which is whenever this array is rebuilt
            // (every render), not live on every keystroke elsewhere.
            content: (() => {
                const reviewValues = form.getValues()
                return (
                <div className="space-y-4">
                    <ReviewSection title="Business Information">
                        <ReviewRow label="Business Name" value={reviewValues.businessName} />
                        <ReviewRow label="Category" value={reviewValues.businessCategory} />
                        <ReviewRow label="Entity Type" value={reviewValues.businessEntityType} />
                        <ReviewRow label="Address" value={reviewValues.businessAddress} />
                        <ReviewRow label="Activities" value={reviewValues.businessActivities} />
                    </ReviewSection>

                    <ReviewSection title="Owner Information">
                        <ReviewRow label="Owner Name" value={reviewValues.ownerName} />
                        <ReviewRow label="Place of Birth" value={reviewValues.placeOfBirth} />
                        <ReviewRow label="Date of Birth" value={reviewValues.dateOfBirth?.toLocaleDateString()} />
                        <ReviewRow label="Gender" value={reviewValues.gender} />
                        <ReviewRow label="Owner Address" value={reviewValues.ownerAddress} />
                        <ReviewRow label="Contact Number" value={reviewValues.contactNumber} />
                        <ReviewRow label="Email" value={reviewValues.email} />
                        <ReviewRow label="Mother's Name" value={reviewValues.mothersName} />
                        <ReviewRow label="Nationality" value={reviewValues.nationality} />
                    </ReviewSection>

                    <ReviewSection title="Identity & Registration Status">
                        <ReviewRow label="NIN/Passport Number" value={reviewValues.ninPassport} />
                        <ReviewRow label="Occupation" value={reviewValues.occupation} />
                        <ReviewRow label="Document Type" value={IDENTITY_DOC_TYPES.find((d) => d.value === reviewValues.docType)?.label} />
                        <ReviewRow label="Already Registered" value={reviewValues.isAlreadyRegistered ? "Yes" : "No"} />
                        {reviewValues.isAlreadyRegistered && (
                            <>
                                <ReviewRow label="Registration Number" value={reviewValues.registrationNumber} />
                                <ReviewRow label="Registration Date" value={reviewValues.registerDate?.toLocaleDateString()} />
                            </>
                        )}
                        {idScanPreviewUrl && (
                            <div className="pt-3">
                                <span className="text-sm text-muted-foreground">Uploaded Document</span>
                                <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={idScanPreviewUrl} alt="Uploaded identity document" className="max-h-72 w-full object-contain" />
                                </div>
                            </div>
                        )}
                    </ReviewSection>

                    <FormField
                        name="createNawehubAccount"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                                <Checkbox id="createNawehubAccount" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                                <Label htmlFor="createNawehubAccount" className="cursor-pointer font-normal leading-snug">
                                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                                        <Sparkles className="h-3.5 w-3.5 text-primary" /> Create a NaweHub account for me
                                    </span>
                                    <span className="mt-0.5 block text-sm text-muted-foreground">
                                        We&rsquo;ll email login credentials so you can track your registration status and access the dashboard.
                                    </span>
                                </Label>
                            </div>
                        )}
                    />
                </div>
                )
            })(),
        },
    ]

    if (result) {
        return (
            <div className="mx-auto max-w-2xl">
                <Card className="border-primary/20">
                    <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <CheckCircle2 className="h-8 w-8" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Registration Submitted
                            </h2>
                            <p className="mt-2 max-w-md text-muted-foreground">
                                {result.businessName} has been submitted for review.
                                {form.getValues("createNawehubAccount")
                                    ? " Credentials to access your dashboard have been sent to your email."
                                    : " You can follow up using the tracking ID below."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard?.writeText(result.trackingId)
                                toast("Tracking ID copied")
                            }}
                            className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 font-mono text-sm text-foreground transition-colors hover:border-primary/40"
                        >
                            <Building2 className="h-4 w-4 text-primary" />
                            {result.trackingId}
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                        <p className="text-xs text-muted-foreground">Save this tracking ID — you&rsquo;ll need it to check your registration status.</p>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                            <Button variant="outline" onClick={() => router.push("/")}>Back to Home</Button>
                            <Button variant="outline" onClick={() => router.push(`/register-business/track?trackingId=${encodeURIComponent(result.trackingId)}`)}>
                                Track This Registration
                            </Button>
                            {form.getValues("createNawehubAccount") && (
                                <Button asChild><a href="https://app.nawehub.com">Sign In</a></Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                    Business Registration
                </h1>
                <p className="mt-2 text-muted-foreground">Fill in the details below to register your new business</p>
            </div>

            <Form {...form}>
                <Card className="overflow-visible p-6 sm:p-8">
                    <MultiStepForm
                        steps={steps}
                        currentStep={wizard.currentStep}
                        onStepChange={wizard.setCurrentStep}
                        onComplete={onSubmit}
                        allowStepNavigation
                        isSubmitting={register.isPending}
                        labels={{ submit: "Submit Registration", submitting: "Submitting..." }}
                    />
                </Card>
            </Form>
        </div>
    )
}
