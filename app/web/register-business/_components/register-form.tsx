import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck2, X, AlertCircle, IdCard, CheckCircle2, Pencil, Eye } from "lucide-react";
import { Icons } from "@/components/ui/icon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CustomCombobox } from "@/components/ui/combobox";
import { CustomDatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { countries } from "@/utils/countries";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerBizForm } from "@/lib/services/business";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessFormData, steps, initData, getDate15YearsAgo, categories, businessTypes } from "@/types/business";
import { useRouter } from "next/navigation";
import { RegisterResponse } from "@/store/auth";
import { useRegisterPublicBusinessMutation } from "@/hooks/repository/use-business";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatResponse } from "@/utils/format-response";

type IdentityDocType = 'national_id' | 'passport'

// See file header note #1 — delete this once BusinessFormData itself has
// these two fields.
type FormDataWithIdentity = BusinessFormData & {
    identityDocumentType: IdentityDocType
    identityDocument: File | null
}

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB

/** Generates a preview URL for a File via URL.createObjectURL, revoking the previous one on change/unmount so blob URLs don't leak. */
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

function StepBadge({ n }: { n: string }) {
    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 [font-family:var(--font-mono)] text-sm font-semibold text-primary">
            {n}
        </span>
    )
}

/** Read-only label/value row for the review dialog. Renders nothing if the value is empty, so optional fields don't leave a blank row. */
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
                                    documentType,
                                    onDocumentTypeChange,
                                    file,
                                    previewUrl,
                                    onFileChange,
                                    error,
                                }: {
    documentType: IdentityDocType
    onDocumentTypeChange: (type: IdentityDocType) => void
    file: File | null
    previewUrl: string | null
    onFileChange: (file: File | null) => void
    error: string | null
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleFiles(files: FileList | null) {
        const picked = files?.[0]
        if (!picked) return
        onFileChange(picked)
    }

    return (
        <div className="space-y-3">
            <Label>Identity Document *</Label>

            <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                {(['national_id', 'passport'] as const).map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onDocumentTypeChange(type)}
                        className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                            documentType === type
                                ? 'bg-card text-foreground shadow-[var(--shadow-sm)]'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {type === 'national_id' ? 'National ID' : 'Passport'}
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
                    <span className="text-sm font-medium text-foreground">
                        Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                        A photo of your {documentType === 'national_id' ? 'National ID' : 'Passport'} &mdash; JPG, PNG or WEBP, up to 5MB
                    </span>
                    <input
                        ref={inputRef}
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
                            <img
                                src={previewUrl}
                                alt="Identity document preview"
                                className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
                            />
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

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState<FormDataWithIdentity>({
        ...initData,
        identityDocumentType: 'national_id',
        identityDocument: null,
    })
    const [fileError, setFileError] = useState<string | null>(null)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const identityPreviewUrl = useObjectUrl(formData.identityDocument)
    const router = useRouter()
    const register = useRegisterPublicBusinessMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("Registering your business");
    const [typeDescription, setTypeDescription] = useState<string[]>([]);

    const form = useForm<z.infer<typeof registerBizForm>>({
        resolver: zodResolver(registerBizForm)
    });

    const updateFormData = (field: keyof FormDataWithIdentity, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (file: File | null) => {
        if (file && !file.type.startsWith('image/')) {
            setFileError("Please upload an image file (JPG, PNG, or WEBP) — other file types aren't supported.")
            return
        }
        if (file && file.size > MAX_FILE_BYTES) {
            setFileError("That file is over 5MB — please upload a smaller copy.")
            return
        }
        setFileError(null)
        updateFormData('identityDocument', file)
    }

    const openReview = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsReviewOpen(true);
    }

    const confirmAndSubmit = () => {
        setIsReviewOpen(false);
        setIsDialogOpen(true);
        startTransition(async () => {
            // NOTE: this still sends `data` as a plain object the same way the
            // form did before — but `identityDocument` is now a File, which a
            // JSON request body can't carry. See file header note #3:
            // useRegisterPublicBusinessMutation likely needs a multipart/
            // form-data path for this to actually upload.
            const data: z.infer<typeof registerBizForm> = {
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth),
                gender: formData.gender as z.infer<typeof registerBizForm>["gender"],
                isPublicRegister: true
            }
            try {
                const response: RegisterResponse = await register.mutateAsync(data);
                toast('Registration Successful', {
                    description: response.message,
                    className: "bg-[hsl(var(--color-success))] text-white",
                    duration: 10000,
                });
                form.reset();
                setMessage(response.message);
                setTitle("Registration Successful");
            } catch (error) {
                toast('Registration failed', {
                    description: `${error instanceof Error ? formatResponse(error.message) : 'An unknown error occurred'}`,
                    className: "bg-[hsl(var(--color-error))] text-white",
                });
            }
        });
    };

    const isStepValid = () => {
        return formData.businessName && formData.businessAddress && formData.businessActivities && formData.businessEntityType && formData.category && formData.ownerName && formData.ownerAddress && formData.placeOfBirth && formData.dateOfBirth
            && formData.nationality && formData.mothersName && formData.email && formData.contactNumber && formData.gender && formData.ninOrPassport && formData.identityDocument;
    }

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                    Business Registration
                </h1>
                <p className="mt-2 text-muted-foreground">Fill in the details below to register your new business</p>

                {/* Step map */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                    {steps.map((step, idx) => (
                        <div
                            key={step.title}
                            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 [font-family:var(--font-mono)] text-xs font-semibold text-primary">
                                {idx + 1}
                            </span>
                            <span className="font-medium text-foreground">{step.title}</span>
                        </div>
                    ))}
                </div>

                <Form {...form}>
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-4"
                    >
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <StepBadge n="01" />
                                    <div>
                                        <CardTitle className="[font-family:var(--font-display)]">{steps[0].title}</CardTitle>
                                        <CardDescription>{steps[0].description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-3 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'businessName'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="businessName">Business Name *</Label>
                                                    <Input
                                                        id="businessName"
                                                        {...field}
                                                        value={formData.businessName}
                                                        onChange={(e) => updateFormData('businessName', e.target.value)}
                                                        type={'text'}
                                                        required
                                                        placeholder="Enter business name"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'category'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Business Category</Label>
                                                    <CustomCombobox
                                                        {...field}
                                                        placeholder="Select your business category"
                                                        searchPlaceholder={'Search category...'}
                                                        data={categories}
                                                        searchField={'name'}
                                                        displayField={'name'}
                                                        valueField={'name'}
                                                        onSelectAction={(value) => {
                                                            updateFormData('category', value)
                                                            field.onChange(value)
                                                        }} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'businessEntityType'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Business Entity Type</Label>
                                                    <CustomCombobox
                                                        {...field}
                                                        placeholder="Select your business category"
                                                        searchPlaceholder={'Search business entity type...'}
                                                        data={businessTypes}
                                                        searchField={'name'}
                                                        displayField={'name'}
                                                        valueField={'name'}
                                                        onSelectAction={(value) => {
                                                            updateFormData('businessEntityType', value)
                                                            field.onChange(value)
                                                            setTypeDescription(businessTypes.filter(type => {
                                                                return type.name == value
                                                            })[0].descriptions)
                                                        }} />
                                                    {typeDescription.length > 0 && (
                                                        typeDescription.map((description, index) => (
                                                            <p key={index} className="text-xs text-muted-foreground">
                                                                {description}
                                                            </p>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <FormField
                                            name={'businessAddress'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="businessAddress">Business Address</Label>
                                                    <Textarea
                                                        id="businessAddress"
                                                        {...field}
                                                        value={formData.businessAddress}
                                                        onChange={(e) => updateFormData('businessAddress', e.target.value)}
                                                        required
                                                        rows={2}
                                                        placeholder="Enter business address"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        name={'businessActivities'}
                                        control={form.control}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <Label htmlFor="businessActivities">Business Activities</Label>
                                                <Textarea
                                                    id="businessActivities"
                                                    {...field}
                                                    value={formData.businessActivities}
                                                    onChange={(e) => updateFormData('businessActivities', e.target.value)}
                                                    required
                                                    placeholder="Enter business activities here..."
                                                    rows={6}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Please provide a brief description of your business activities.
                                                </p>
                                            </div>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <StepBadge n="02" />
                                    <div>
                                        <CardTitle className="[font-family:var(--font-display)]">{steps[1].title}</CardTitle>
                                        <CardDescription>{steps[1].description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-3 space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'ownerName'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerName">Owner Name *</Label>
                                                    <Input
                                                        id="ownerName"
                                                        {...field}
                                                        value={formData.ownerName}
                                                        onChange={(e) => updateFormData('ownerName', e.target.value)}
                                                        required
                                                        type={'text'}
                                                        placeholder="Enter business owner name"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'placeOfBirth'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                                                            <Input
                                                                id="placeOfBirth"
                                                                {...field}
                                                                value={formData.placeOfBirth}
                                                                onChange={(e) => updateFormData('placeOfBirth', e.target.value)}
                                                                required
                                                                type={'text'}
                                                                placeholder="Enter business owner address"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'dateOfBirth'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className={'space-y-2'}>
                                                    <FormLabel>Date of Birth *</FormLabel>
                                                    <FormControl>
                                                        <div>
                                                            <CustomDatePicker
                                                                date={field.value}
                                                                setDateAction={(e) => {
                                                                    field.onChange(e)
                                                                    updateFormData('dateOfBirth', e)
                                                                }}
                                                                isRequired={false}
                                                                isDisable={(date) =>
                                                                    date > getDate15YearsAgo() || date < new Date("1900-01-01")
                                                                }
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Gender <br /> <span className={"pb-4 text-xs"}>Select owner gender</span></Label>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={(e) => {
                                                                field.onChange(e)
                                                                updateFormData('gender', e)
                                                            }}
                                                            defaultValue={field.value}
                                                        >
                                                            {['Male', 'Female'].map((gender, index) => (
                                                                <div className='flex flex-row items-center space-x-3' key={index}>
                                                                    <RadioGroupItem value={gender} />
                                                                    <Label htmlFor={gender} className='font-normal'>
                                                                        {gender}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            name={'ownerAddress'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerAddress">Owner Address *</Label>
                                                    <Input
                                                        id="ownerAddress"
                                                        {...field}
                                                        value={formData.ownerAddress}
                                                        onChange={(e) => updateFormData('ownerAddress', e.target.value)}
                                                        required
                                                        type={'text'}
                                                        placeholder="Enter business owner address"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'contactNumber'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="contactNumber">Owner's Contact Number *</Label>
                                                    <Input
                                                        id="contactNumber"
                                                        {...field}
                                                        value={formData.contactNumber}
                                                        onChange={(e) => updateFormData('contactNumber', e.target.value)}
                                                        required
                                                        type={'text'}
                                                        placeholder="Enter contact number"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'email'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Owner Or Business Email *</Label>
                                                    <Input
                                                        id="email"
                                                        {...field}
                                                        value={formData.email}
                                                        onChange={(e) => updateFormData('email', e.target.value)}
                                                        required
                                                        type={'text'}
                                                        placeholder="Enter email"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'mothersName'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="mothersName">Mother's Name *</Label>
                                                    <Input
                                                        id="mothersName"
                                                        {...field}
                                                        value={formData.mothersName}
                                                        onChange={(e) => updateFormData('mothersName', e.target.value)}
                                                        required
                                                        type={'text'}
                                                        placeholder="Enter mother's name"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'nationality'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="nationality">Owner's Nationality</Label>
                                                    <CustomCombobox
                                                        {...field}
                                                        placeholder="Select your nationality"
                                                        searchPlaceholder={'Search country...'}
                                                        data={countries}
                                                        searchField={'name'}
                                                        displayField={'name'}
                                                        valueField={'name'}
                                                        value={formData.nationality}
                                                        onSelectAction={(value) => {
                                                            field.onChange(value)
                                                            updateFormData('nationality', value)
                                                        }} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <StepBadge n="03" />
                                    <div>
                                        <CardTitle className="[font-family:var(--font-display)]">{steps[2].title}</CardTitle>
                                        <CardDescription>{steps[2].description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-3 space-y-6">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            name={'ninOrPassport'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="ninOrPassport">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <IdCard className="h-3.5 w-3.5" />
                                                            Nin/Passport Number *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="ninOrPassport"
                                                        {...field}
                                                        value={formData.ninOrPassport}
                                                        onChange={(e) => updateFormData('ninOrPassport', e.target.value)}
                                                        type={'text'}
                                                        required
                                                        placeholder="Enter your NIN or PASSPORT number"
                                                    />
                                                </div>
                                            )}
                                        />

                                        <FormField
                                            name={'occupation'}
                                            control={form.control}
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <Label htmlFor="occupation">Occupation</Label>
                                                    <Input
                                                        id="occupation"
                                                        {...field}
                                                        value={formData.occupation}
                                                        onChange={(e) => updateFormData('occupation', e.target.value)}
                                                        type={'text'}
                                                        required
                                                        placeholder="What is your occupation?"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <IdentityDocumentUpload
                                        documentType={formData.identityDocumentType}
                                        onDocumentTypeChange={(type) => updateFormData('identityDocumentType', type)}
                                        file={formData.identityDocument}
                                        previewUrl={identityPreviewUrl}
                                        onFileChange={handleFileChange}
                                        error={fileError}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6 flex items-end justify-end space-x-2">
                            <Button variant="outline" onClick={() => router.push("/")}>
                                Cancel
                            </Button>

                            <Button
                                onClick={(event) => openReview(event)}
                                disabled={!isStepValid() || isPending}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Eye className={'mr-2 h-4 w-4'} />
                                Review & Submit
                            </Button>
                        </div>
                    </motion.form>
                </Form>
            </motion.div>

            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-medium [font-family:var(--font-display)]">
                            Review Your Information
                        </DialogTitle>
                        <DialogDescription>
                            Double check everything below before submitting — you can go back and edit
                            anything that isn&rsquo;t right.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <ReviewSection title="Business Information">
                            <ReviewRow label="Business Name" value={formData.businessName} />
                            <ReviewRow label="Category" value={formData.category} />
                            <ReviewRow label="Entity Type" value={formData.businessEntityType} />
                            <ReviewRow label="Address" value={formData.businessAddress} />
                            <ReviewRow label="Activities" value={formData.businessActivities} />
                        </ReviewSection>

                        <ReviewSection title="Owner Information">
                            <ReviewRow label="Owner Name" value={formData.ownerName} />
                            <ReviewRow label="Place of Birth" value={formData.placeOfBirth} />
                            <ReviewRow
                                label="Date of Birth"
                                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : ''}
                            />
                            <ReviewRow label="Gender" value={formData.gender} />
                            <ReviewRow label="Owner Address" value={formData.ownerAddress} />
                            <ReviewRow label="Contact Number" value={formData.contactNumber} />
                            <ReviewRow label="Email" value={formData.email} />
                            <ReviewRow label="Mother's Name" value={formData.mothersName} />
                            <ReviewRow label="Nationality" value={formData.nationality} />
                        </ReviewSection>

                        <ReviewSection title="Identity & Occupation">
                            <ReviewRow label="NIN/Passport Number" value={formData.ninOrPassport} />
                            <ReviewRow label="Occupation" value={formData.occupation} />
                            <ReviewRow
                                label="Document Type"
                                value={formData.identityDocumentType === 'national_id' ? 'National ID' : 'Passport'}
                            />

                            {identityPreviewUrl && (
                                <div className="pt-3">
                                    <span className="text-sm text-muted-foreground">Uploaded Document</span>
                                    <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={identityPreviewUrl}
                                            alt="Uploaded identity document"
                                            className="max-h-80 w-full object-contain"
                                        />
                                    </div>
                                </div>
                            )}
                        </ReviewSection>
                    </div>

                    <div className="mt-2 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Back to Edit
                        </Button>
                        <Button
                            onClick={confirmAndSubmit}
                            disabled={isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Confirm & Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} modal={false}>
                <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <DialogHeader className={"text-center"}>
                        <DialogTitle className="text-center text-2xl font-medium [font-family:var(--font-display)]">{title}</DialogTitle>
                        <DialogDescription className={"text-center"}>
                            {isPending ? "Sit back and relax while we register your business. This may take a few seconds." : "Boom!! Your business is one step closer to completion"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className={"flex-1 items-center text-center"}>
                        {isPending ? (
                            <div className={"mt-5 flex flex-col items-center justify-center space-y-4 text-center"}>
                                <Icons.spinner className={'mr-2 h-7 w-7 animate-spin'} />
                            </div>
                        ) : (
                            <div className={"mt-5 flex flex-col items-center justify-center space-y-4"}>
                                <div>
                                    <p className={"text-muted-foreground"}>{message}</p>
                                    <p className={"mb-5 text-muted-foreground"}>Credentials to access the dashboard and track the status of your dashboard has been sent to your email</p>
                                </div>
                                <div className={"flex items-center justify-center space-x-4"}>
                                    <Button variant={"outline"} onClick={() => {
                                        setIsDialogOpen(false)
                                        router.push("/")
                                    }}>Go To Previous Page</Button>
                                    <Button onClick={() => {
                                        setIsDialogOpen(false)
                                        router.push('/login')
                                    }}>Sign In</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}