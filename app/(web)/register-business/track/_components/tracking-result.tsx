'use client'

import { useState } from "react"
import {
    Building2, Calendar, CheckCircle2, Clock, Copy, CreditCard,
    FileSearch, Hash, MapPin, Settings2, User, XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ProgressSteps, StepProgress, type Step } from "@/components/ui/progress-steps"
import { BUSINESS_CATEGORIES, type BusinessRegistrationResponse } from "@/types/business-registration"

type Tone = "success" | "warning" | "error" | "info"

const STATUS_META: Record<string, { label: string; description: string; icon: typeof Clock; tone: Tone }> = {
    PENDING: {
        label: "Pending Review",
        description: "We've received your registration and it's in the queue for review.",
        icon: Clock,
        tone: "warning",
    },
    IN_REVIEW: {
        label: "In Review",
        description: "Our team is currently reviewing your registration details.",
        icon: FileSearch,
        tone: "info",
    },
    PAYMENT_PENDING: {
        label: "Payment Pending",
        description: "Your registration was reviewed and approved for the next step — complete payment to continue.",
        icon: CreditCard,
        tone: "warning",
    },
    PROCESSING: {
        label: "Processing",
        description: "Payment confirmed. We're finalizing your business registration.",
        icon: Settings2,
        tone: "info",
    },
    APPROVED: {
        label: "Approved",
        description: "Congratulations! Your business is officially registered with NaWeHub.",
        icon: CheckCircle2,
        tone: "success",
    },
    REJECTED: {
        label: "Rejected",
        description: "Unfortunately, this registration was not approved.",
        icon: XCircle,
        tone: "error",
    },
}

const TONE_CLASSES: Record<Tone, { border: string; bg: string; text: string; iconBg: string }> = {
    success: { border: "border-success/25", bg: "bg-success/5", text: "text-success", iconBg: "bg-success/15" },
    warning: { border: "border-warning/25", bg: "bg-warning/5", text: "text-warning", iconBg: "bg-warning/15" },
    error: { border: "border-error/25", bg: "bg-error/5", text: "text-error", iconBg: "bg-error/15" },
    info: { border: "border-info/25", bg: "bg-info/5", text: "text-info", iconBg: "bg-info/15" },
}

const HAPPY_PATH_STEPS: Step[] = [
    { id: "PENDING", title: "Submitted", description: "Registration received" },
    { id: "IN_REVIEW", title: "In Review", description: "Being reviewed by our team" },
    { id: "PAYMENT_PENDING", title: "Payment", description: "Complete your payment" },
    { id: "PROCESSING", title: "Processing", description: "Finalizing registration" },
    { id: "APPROVED", title: "Approved", description: "Officially registered" },
]

function currentStepIndex(status: string): number {
    const idx = HAPPY_PATH_STEPS.findIndex((s) => s.id === status)
    return idx === -1 ? 0 : idx
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: React.ReactNode }) {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 py-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
            </div>
        </div>
    )
}

export default function TrackingResult({ data }: { data: BusinessRegistrationResponse }) {
    const [copied, setCopied] = useState(false)
    const meta = STATUS_META[data.status] ?? STATUS_META.PENDING
    const tone = TONE_CLASSES[meta.tone]
    const StatusIcon = meta.icon
    const isRejected = data.status === "REJECTED"

    const categoryLabel = data.otherCategory
        ? data.otherCategory
        : BUSINESS_CATEGORIES.find((c) => c.value === data.businessCategory)?.label ?? data.businessCategory

    function copyTrackingId() {
        navigator.clipboard?.writeText(data.trackingId)
        setCopied(true)
        toast("Tracking ID copied")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Status hero */}
            <div className={cn("rounded-2xl border p-6 sm:p-8", tone.border, tone.bg)}>
                <div className="flex items-start gap-4">
                    <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", tone.iconBg, tone.text)}>
                        <StatusIcon className="h-7 w-7" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground [font-family:var(--font-mono)]">
                            Registration Status
                        </p>
                        <h2 className={cn("mt-1 text-2xl font-semibold [font-family:var(--font-display)]", tone.text)}>
                            {meta.label}
                        </h2>
                        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{meta.description}</p>
                    </div>
                </div>

                {isRejected && data.rejectionReason && (
                    <div className="mt-5 rounded-xl border border-error/20 bg-error/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-error">Reason</p>
                        <p className="mt-1 text-sm text-foreground">{data.rejectionReason}</p>
                    </div>
                )}
            </div>

            {/* Progress stepper */}
            {!isRejected && (
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <div className="hidden md:block">
                        <ProgressSteps steps={HAPPY_PATH_STEPS} currentStep={currentStepIndex(data.status)} />
                    </div>
                    <div className="md:hidden">
                        <StepProgress
                            currentStep={currentStepIndex(data.status) + 1}
                            totalSteps={HAPPY_PATH_STEPS.length}
                            stepLabel={HAPPY_PATH_STEPS[currentStepIndex(data.status)].title}
                        />
                    </div>
                </div>
            )}

            {/* Business details */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">Business Information</h3>
                <div className="divide-y divide-border">
                    <DetailRow icon={Building2} label="Business Name" value={data.businessName} />
                    <DetailRow icon={Hash} label="Category" value={categoryLabel} />
                    <DetailRow icon={Settings2} label="Entity Type" value={data.businessEntityType} />
                    <DetailRow icon={MapPin} label="Address" value={data.businessAddress} />
                    <DetailRow icon={FileSearch} label="Activities" value={data.businessActivities} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <h3 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">Owner</h3>
                    <div className="divide-y divide-border">
                        <DetailRow icon={User} label="Owner Name" value={data.ownerName} />
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <h3 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">Official Registration</h3>
                    {data.registrationNumber || data.registerDate ? (
                        <div className="divide-y divide-border">
                            <DetailRow icon={Hash} label="Registration Number" value={data.registrationNumber} />
                            <DetailRow icon={Calendar} label="Registration Date" value={data.registerDate ? formatDate(data.registerDate) : null} />
                        </div>
                    ) : (
                        <p className="py-3 text-sm text-muted-foreground">
                            This business was not already formally registered at submission time.
                        </p>
                    )}
                </div>
            </div>

            {/* Tracking meta footer */}
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-5 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={copyTrackingId}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-primary/40"
                >
                    <Hash className="h-3.5 w-3.5 text-primary" />
                    {data.trackingId}
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    {copied && <span className="text-xs text-primary">Copied</span>}
                </button>
                <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(data.createTime)} &middot; Last updated {formatDate(data.updateTime)}
                </p>
            </div>
        </div>
    )
}
