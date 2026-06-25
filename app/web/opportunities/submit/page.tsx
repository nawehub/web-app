"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Globe2,
    ImageIcon,
    Info,
    Link2,
    Mail,
    Phone,
    Send,
    ShieldCheck,
    Trash2,
    Upload,
    User,
    Users,
    type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    categoriesToType,
    BENEFICIARY_OPTIONS,
    COVERAGE_OPTIONS,
    Opportunity,
    OPPORTUNITY_CATEGORY_OPTIONS,
    OPPORTUNITY_TYPES,
    ORGANIZATION_TYPE_OPTIONS,
} from "@/types/opportunities";
import { formatDeadlineLabel, initials } from "@/lib/opportunities";
import { submitOpportunity } from "@/lib/opportunities-store";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface FormState {
    title: string;
    categories: string[];
    categoryOther: string;
    description: string;
    org: string;
    orgType: string;
    orgTypeOther: string;
    beneficiaries: string[];
    beneficiaryOther: string;
    eligibilityCriteria: string;
    deadline: string;
    applicationLink: string;
    contactEmail: string;
    contactPhone: string;
    contactPerson: string;
    coverage: string;
    coverageOther: string;
    coverImage: string;
    coverImageName: string;
    declaration: boolean;
    submittedBy: string;
    dateSubmitted: string;
}

const initialForm: FormState = {
    title: "",
    categories: [],
    categoryOther: "",
    description: "",
    org: "",
    orgType: "",
    orgTypeOther: "",
    beneficiaries: [],
    beneficiaryOther: "",
    eligibilityCriteria: "",
    deadline: "",
    applicationLink: "",
    contactEmail: "",
    contactPhone: "",
    contactPerson: "",
    coverage: "",
    coverageOther: "",
    coverImage: "",
    coverImageName: "",
    declaration: false,
    submittedBy: "",
    dateSubmitted: new Date().toISOString().slice(0, 10),
};

export default function SubmitOpportunityPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
    };

    const toggleIn = (key: "categories" | "beneficiaries", value: string) => {
        setForm((prev) => {
            const arr = prev[key];
            const next = arr.includes(value)
                ? arr.filter((v) => v !== value)
                : [...arr, value];
            return { ...prev, [key]: next };
        });
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
    };

    const handleImage = (file: File | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file (PNG or JPG).");
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            toast.error("Image is too large — max 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({
                ...prev,
                coverImage: String(reader.result),
                coverImageName: file.name,
            }));
        };
        reader.readAsDataURL(file);
    };

    const validate = (): boolean => {
        const next: Record<string, boolean> = {};
        if (!form.title.trim()) next.title = true;
        if (form.categories.length === 0 && !form.categoryOther.trim())
            next.categories = true;
        if (!form.description.trim()) next.description = true;
        if (!form.org.trim()) next.org = true;
        if (form.beneficiaries.length === 0 && !form.beneficiaryOther.trim())
            next.beneficiaries = true;
        if (!form.deadline) next.deadline = true;
        if (!form.applicationLink.trim()) next.applicationLink = true;
        if (!form.contactEmail.trim()) next.contactEmail = true;
        if (!form.declaration) next.declaration = true;
        if (!form.submittedBy.trim()) next.submittedBy = true;
        if (!form.dateSubmitted) next.dateSubmitted = true;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) {
            toast.error("Please complete the required fields.");
            return;
        }
        const categories = [
            ...form.categories,
            ...(form.categoryOther.trim() ? [form.categoryOther.trim()] : []),
        ];
        const beneficiaries = [
            ...form.beneficiaries,
            ...(form.beneficiaryOther.trim() ? [form.beneficiaryOther.trim()] : []),
        ];
        const orgType =
            form.orgType === "Other" ? form.orgTypeOther.trim() : form.orgType;
        const coverage =
            form.coverage === "Other" ? form.coverageOther.trim() : form.coverage;
        const type = categoriesToType(categories);

        const opp: Opportunity = {
            id: "opp-" + Date.now(),
            type,
            featured: false,
            open: true,
            status: "pending",
            title: form.title.trim(),
            org: form.org.trim(),
            logo: initials(form.org || form.title),
            c1: OPPORTUNITY_TYPES[type].color,
            deadline: form.deadline,
            deadlineLabel: formatDeadlineLabel(form.deadline),
            summary: form.description.trim(),
            location: coverage || "Sierra Leone",
            categories,
            orgType: orgType || undefined,
            beneficiaries,
            tags: beneficiaries.slice(0, 3),
            eligibilityCriteria: form.eligibilityCriteria.trim() || undefined,
            applicationLink: form.applicationLink.trim(),
            contactEmail: form.contactEmail.trim(),
            contactPhone: form.contactPhone.trim() || undefined,
            contactPerson: form.contactPerson.trim() || undefined,
            coverage: coverage || undefined,
            coverImage: form.coverImage || undefined,
            submittedBy: form.submittedBy.trim(),
            submittedAt: new Date().toISOString(),
        };

        submitOpportunity(opp);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (submitted) {
        return <SuccessPanel onAnother={() => { setForm(initialForm); setErrors({}); setSubmitted(false); }} />;
    }

    return (
        <div className="bg-muted/30">
            <div className="container mx-auto max-w-[1100px] px-4 pb-20 pt-28">
                {/* Heading */}
                <div className="mb-8 flex items-start gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                        <ClipboardList className="h-7 w-7" />
                    </span>
                    <div>
                        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                            Submit an Opportunity
                        </h1>
                        <p className="mt-2 max-w-[640px] text-[15px] text-muted-foreground">
                            Development partners, hubs, foundations and investors — share
                            opportunities that support entrepreneurs, innovators, SMEs and other
                            impact-driven individuals. Submissions are reviewed by the NaWeHub team
                            before going live.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* 1. Opportunity Information */}
                    <Section icon={Info} number={1} title="Opportunity Information">
                        <FieldLabel required>Opportunity Title</FieldLabel>
                        <Input
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="Enter opportunity title"
                            className={cn("h-11", errors.title && errClass)}
                        />

                        <div className="mt-5">
                            <FieldLabel required>Opportunity Category</FieldLabel>
                            <p className="mb-2.5 text-[12.5px] text-muted-foreground">
                                Choose all that apply.
                            </p>
                            <CheckGrid
                                options={[...OPPORTUNITY_CATEGORY_OPTIONS]}
                                selected={form.categories}
                                onToggle={(v) => toggleIn("categories", v)}
                                error={errors.categories}
                            />
                            <Input
                                value={form.categoryOther}
                                onChange={(e) => set("categoryOther", e.target.value)}
                                placeholder="Other — please specify"
                                className="mt-2.5 h-10 text-sm"
                            />
                        </div>

                        <div className="mt-5">
                            <FieldLabel required>Brief Description</FieldLabel>
                            <p className="mb-2 text-[12.5px] text-muted-foreground">
                                A concise summary of the opportunity, its purpose and benefits.
                            </p>
                            <Textarea
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                                placeholder="Type your description here…"
                                className={cn("min-h-[110px] text-sm", errors.description && errClass)}
                            />
                        </div>
                    </Section>

                    {/* 4. Link & Contact (right column top, mirrors mockup) */}
                    <Section icon={Link2} number={4} title="Link & Contact Information">
                        <FieldLabel required>Opportunity Details / Application Link</FieldLabel>
                        <p className="mb-2 text-[12.5px] text-muted-foreground">
                            The official URL where applicants can learn more or apply.
                        </p>
                        <IconInput
                            icon={Link2}
                            value={form.applicationLink}
                            onChange={(v) => set("applicationLink", v)}
                            placeholder="https://"
                            error={errors.applicationLink}
                            type="url"
                        />

                        <div className="mt-5">
                            <FieldLabel required>Contact Email Address</FieldLabel>
                            <IconInput
                                icon={Mail}
                                value={form.contactEmail}
                                onChange={(v) => set("contactEmail", v)}
                                placeholder="example@organization.org"
                                error={errors.contactEmail}
                                type="email"
                            />
                        </div>

                        <div className="mt-5">
                            <FieldLabel>Contact Phone Number</FieldLabel>
                            <IconInput
                                icon={Phone}
                                value={form.contactPhone}
                                onChange={(v) => set("contactPhone", v)}
                                placeholder="e.g. +232 76 123456"
                                type="tel"
                            />
                        </div>

                        <div className="mt-5">
                            <FieldLabel>
                                Additional Contact Person{" "}
                                <span className="font-normal text-muted-foreground">(optional)</span>
                            </FieldLabel>
                            <IconInput
                                icon={User}
                                value={form.contactPerson}
                                onChange={(v) => set("contactPerson", v)}
                                placeholder="Full name and role (e.g. Program Officer)"
                            />
                        </div>
                    </Section>

                    {/* 2. Provider Information */}
                    <Section icon={Building2} number={2} title="Opportunity Provider">
                        <FieldLabel required>
                            Name of Organization / Institution
                        </FieldLabel>
                        <Input
                            value={form.org}
                            onChange={(e) => set("org", e.target.value)}
                            placeholder="Development partner, foundation, hub, institution…"
                            className={cn("h-11", errors.org && errClass)}
                        />

                        <div className="mt-5">
                            <FieldLabel>Organization Type</FieldLabel>
                            <RadioGroup
                                value={form.orgType}
                                onValueChange={(v) => set("orgType", v)}
                                className="mt-1 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2"
                            >
                                {ORGANIZATION_TYPE_OPTIONS.map((o) => (
                                    <RadioRow key={o} value={o} label={o} />
                                ))}
                                <RadioRow value="Other" label="Other" />
                            </RadioGroup>
                            {form.orgType === "Other" && (
                                <Input
                                    value={form.orgTypeOther}
                                    onChange={(e) => set("orgTypeOther", e.target.value)}
                                    placeholder="Please specify"
                                    className="mt-2.5 h-10 text-sm"
                                />
                            )}
                        </div>
                    </Section>

                    {/* Geographic scope */}
                    <Section icon={Globe2} number={5} title="Geographic Scope">
                        <FieldLabel>Opportunity Coverage</FieldLabel>
                        <RadioGroup
                            value={form.coverage}
                            onValueChange={(v) => set("coverage", v)}
                            className="mt-1 flex flex-col gap-2"
                        >
                            {COVERAGE_OPTIONS.map((o) => (
                                <RadioRow key={o} value={o} label={o} />
                            ))}
                            <RadioRow value="Other" label="Other" />
                        </RadioGroup>
                        {form.coverage === "Other" && (
                            <Input
                                value={form.coverageOther}
                                onChange={(e) => set("coverageOther", e.target.value)}
                                placeholder="Please specify"
                                className="mt-2.5 h-10 text-sm"
                            />
                        )}
                    </Section>

                    {/* 3. Eligibility */}
                    <Section icon={Users} number={3} title="Eligibility & Application">
                        <FieldLabel required>Target Beneficiaries</FieldLabel>
                        <CheckGrid
                            options={[...BENEFICIARY_OPTIONS]}
                            selected={form.beneficiaries}
                            onToggle={(v) => toggleIn("beneficiaries", v)}
                            error={errors.beneficiaries}
                        />
                        <Input
                            value={form.beneficiaryOther}
                            onChange={(e) => set("beneficiaryOther", e.target.value)}
                            placeholder="Other — please specify"
                            className="mt-2.5 h-10 text-sm"
                        />

                        <div className="mt-5">
                            <FieldLabel>Eligibility Criteria</FieldLabel>
                            <Textarea
                                value={form.eligibilityCriteria}
                                onChange={(e) => set("eligibilityCriteria", e.target.value)}
                                placeholder="Describe who is eligible to apply…"
                                className="min-h-[88px] text-sm"
                            />
                        </div>

                        <div className="mt-5">
                            <FieldLabel required>Application Deadline</FieldLabel>
                            <IconInput
                                icon={CalendarDays}
                                value={form.deadline}
                                onChange={(v) => set("deadline", v)}
                                type="date"
                                error={errors.deadline}
                            />
                        </div>
                    </Section>

                    {/* Cover image (the upload, now a feature image) */}
                    <Section icon={ImageIcon} number={6} title="Cover Image">
                        <FieldLabel>
                            Feature image{" "}
                            <span className="font-normal text-muted-foreground">(optional)</span>
                        </FieldLabel>
                        <p className="mb-2.5 text-[12.5px] text-muted-foreground">
                            A cover image makes the listing stand out. PNG or JPG, max 5MB.
                        </p>

                        {form.coverImage ? (
                            <div className="overflow-hidden rounded-xl border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={form.coverImage}
                                    alt="Cover preview"
                                    className="h-44 w-full object-cover"
                                />
                                <div className="flex items-center justify-between gap-3 border-t bg-card px-3 py-2.5">
                                    <span className="truncate text-[12.5px] text-muted-foreground">
                                        {form.coverImageName}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            set("coverImage", "");
                                            set("coverImageName", "");
                                        }}
                                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-destructive hover:underline"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOver(false);
                                    handleImage(e.dataTransfer.files?.[0]);
                                }}
                                className={cn(
                                    "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors",
                                    dragOver
                                        ? "border-primary bg-primary/5"
                                        : "border-input bg-muted/40 hover:border-primary/50"
                                )}
                            >
                                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
                                    <Upload className="h-6 w-6" />
                                </span>
                                <span className="font-display text-sm font-bold text-foreground">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-[12px] text-muted-foreground">
                                    PNG or JPG (max 5MB)
                                </span>
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => handleImage(e.target.files?.[0])}
                        />
                    </Section>
                </div>

                {/* Declaration */}
                <div
                    className={cn(
                        "mt-6 flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-sm",
                        errors.declaration && "border-destructive"
                    )}
                >
                    <Checkbox
                        id="declaration"
                        checked={form.declaration}
                        onCheckedChange={(v) => set("declaration", v === true)}
                        className="mt-0.5"
                    />
                    <label htmlFor="declaration" className="cursor-pointer">
                        <span className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                            <ShieldCheck className="h-4 w-4 text-primary" /> Declaration
                        </span>
                        <span className="mt-1 block text-[13.5px] text-muted-foreground">
                            I confirm that the information submitted is accurate and that the
                            opportunity is legitimate and intended to support entrepreneurs,
                            innovators, startups, SMEs or related beneficiaries.
                        </span>
                    </label>
                </div>

                {/* Submitter + submit */}
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <FieldLabel required>Submitted By</FieldLabel>
                        <IconInput
                            icon={User}
                            value={form.submittedBy}
                            onChange={(v) => set("submittedBy", v)}
                            placeholder="Your full name"
                            error={errors.submittedBy}
                        />
                    </div>
                    <div className="flex-1">
                        <FieldLabel required>Date Submitted</FieldLabel>
                        <IconInput
                            icon={CalendarDays}
                            value={form.dateSubmitted}
                            onChange={(v) => set("dateSubmitted", v)}
                            type="date"
                            error={errors.dateSubmitted}
                        />
                    </div>
                    <Button size="lg" className="rounded-full sm:px-8" onClick={handleSubmit}>
                        <Send className="h-4 w-4" /> Submit Opportunity
                    </Button>
                </div>

                <p className="mt-5 flex items-center justify-center gap-2 text-center text-[13px] text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Thank you for helping connect opportunities with entrepreneurs and SME owners.
                </p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------ */

const errClass = "border-destructive focus-visible:ring-destructive";

function Section({
    icon: Icon,
    number,
    title,
    children,
}: {
    icon: LucideIcon;
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                </span>
                <h2 className="font-display text-[15px] font-extrabold uppercase tracking-wide text-primary-700">
                    <span className="text-muted-foreground">{number}.</span> {title}
                </h2>
            </div>
            {children}
        </section>
    );
}

function FieldLabel({
    children,
    required,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <span className="mb-1.5 block font-display text-[13.5px] font-semibold text-foreground">
            {children}
            {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
    );
}

function CheckGrid({
    options,
    selected,
    onToggle,
    error,
}: {
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
    error?: boolean;
}) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2",
                error && "rounded-lg ring-1 ring-destructive/60"
            )}
        >
            {options.map((o) => {
                const checked = selected.includes(o);
                return (
                    <label
                        key={o}
                        className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground/90"
                    >
                        <Checkbox
                            checked={checked}
                            onCheckedChange={() => onToggle(o)}
                        />
                        {o}
                    </label>
                );
            })}
        </div>
    );
}

function RadioRow({ value, label }: { value: string; label: string }) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-foreground/90">
            <RadioGroupItem value={value} /> {label}
        </label>
    );
}

function IconInput({
    icon: Icon,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
}: {
    icon: LucideIcon;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    error?: boolean;
}) {
    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-foreground" />
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn("h-11 pl-10", error && errClass)}
            />
        </div>
    );
}

function SuccessPanel({ onAnother }: { onAnother: () => void }) {
    return (
        <div className="container mx-auto max-w-[640px] px-4 pb-24 pt-32">
            <div className="rounded-3xl border bg-card p-10 text-center shadow-sm">
                <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                </span>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    Submission received
                </h1>
                <p className="mx-auto mt-2.5 max-w-[440px] text-[15px] text-muted-foreground">
                    Thank you. Your opportunity is now <strong>pending review</strong> by the
                    NaWeHub team. Once approved it will appear on the public Opportunities page.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Button onClick={onAnother} variant="outline" className="rounded-full">
                        Submit another
                    </Button>
                    <Button asChild className="rounded-full">
                        <Link href="/web/opportunities">
                            Back to Opportunities <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
