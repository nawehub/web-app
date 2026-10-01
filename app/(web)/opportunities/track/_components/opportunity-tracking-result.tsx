'use client'

import { useState } from "react"
import Link from "next/link"
import {
    ArrowUpRight, Building2, CalendarClock, CheckCircle2, Clock, Copy, FilePen, FileSearch, Hash, Layers, XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ProgressSteps, StepProgress, type Step } from "@/components/ui/progress-steps"
import { OPPORTUNITY_CATEGORIES } from "@/lib/gateway-enums"
import type { OpportunityTrackingSummary } from "@/types/opportunity-submission"

type Tone = "success" | "warning" | "error" | "info" | "neutral"

const STATUS_META: Record<string, { label: string; description: string; icon: typeof Clock; tone: Tone }> = {
    DRAFT: {
        label: "Draft",
        description: "This opportunity is a draft that hasn't been submitted for review yet. Sign in to NaWeHub to publish it.",
        icon: FilePen,
        tone: "neutral",
    },
    PENDING: {
        label: "Submitted",
        description: "We've received your opportunity and it's in the queue for our review team.",
        icon: Clock,
        tone: "warning",
    },
    IN_REVIEW: {
        label: "In Review",
        description: "Our team is reviewing your opportunity right now. We'll email you as soon as there's a decision.",
        icon: FileSearch,
        tone: "info",
    },
    APPROVED: {
        label: "Approved",
        description: "Your opportunity has been approved and is now live on NaWeHub for entrepreneurs to discover.",
        icon: CheckCircle2,
        tone: "success",
    },
    DECLINED: {
        label: "Not Approved",
        description: "Your opportunity wasn't approved this time. You're welcome to update it and submit again.",
        icon: XCircle,
        tone: "error",
    },
}

const TONE_CLASSES: Record<Tone, { border: string; bg: string; text: string; iconBg: string }> = {
    success: { border: "border-success/25", bg: "bg-success/5", text: "text-success", iconBg: "bg-success/15" },
    warning: { border: "border-warning/25", bg: "bg-warning/5", text: "text-warning", iconBg: "bg-warning/15" },
    error: { border: "border-error/25", bg: "bg-error/5", text: "text-error", iconBg: "bg-error/15" },
    info: { border: "border-info/25", bg: "bg-info/5", text: "text-info", iconBg: "bg-info/15" },
    neutral: { border: "border-border", bg: "bg-muted/40", text: "text-foreground", iconBg: "bg-muted" },
}

const STEPS: Step[] = [
    { id: "PENDING", title: "Submitted", description: "Opportunity received" },
    { id: "IN_REVIEW", title: "In Review", description: "Being reviewed by our team" },
    { id: "APPROVED", title: "Decision", description: "Approved and live" },
]

function currentStepIndex(status: string): number {
    if (status === "APPROVED" || status === "DECLINED") return 2
    const idx = STEPS.findIndex((s) => s.id === status)
    return idx === -1 ? 0 : idx
}

function formatDate(iso: string | null): string {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: React.ReactNode }) {
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

export default function OpportunityTrackingResult({ data }: { data: OpportunityTrackingSummary }) {
    const [copied, setCopied] = useState(false)
    const meta = STATUS_META[data.status] ?? STATUS_META.PENDING
    const tone = TONE_CLASSES[meta.tone]
    const StatusIcon = meta.icon
    const isDeclined = data.status === "DECLINED"
    const isDraft = data.status === "DRAFT"
    const categories = data.categories
        .map((c) => OPPORTUNITY_CATEGORIES.find((o) => o.value === c)?.label ?? c)
        .join(", ")

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
                    <span className={cn("flex h-14 w-14 shrink-0 animate-scale-in items-center justify-center rounded-2xl", tone.iconBg, tone.text)}>
                        <StatusIcon className="h-7 w-7" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground [font-family:var(--font-mono)]">
                            Opportunity Status
                        </p>
                        <h2 className={cn("mt-1 text-2xl font-semibold [font-family:var(--font-display)]", tone.text)}>{meta.label}</h2>
                        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{meta.description}</p>
                    </div>
                </div>

                {isDeclined && data.declineReason && (
                    <div className="mt-5 rounded-xl border border-error/20 bg-error/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-error">Feedback from the review team</p>
                        <p className="mt-1 text-sm text-foreground">{data.declineReason}</p>
                    </div>
                )}

                {data.publicOpportunityId && (
                    <Link
                        href={`/opportunities/${data.publicOpportunityId}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                        See your opportunity on NaWeHub <ArrowUpRight className="h-4 w-4" />
                    </Link>
                )}
                {isDraft && (
                    <a
                        href="https://app.nawehub.com/opportunities?view=mine"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                        Open it in the Entrepreneur Portal <ArrowUpRight className="h-4 w-4" />
                    </a>
                )}
            </div>

            {/* Progress stepper */}
            {!isDeclined && !isDraft && (
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <div className="hidden md:block">
                        <ProgressSteps steps={STEPS} currentStep={currentStepIndex(data.status)} />
                    </div>
                    <div className="md:hidden">
                        <StepProgress
                            currentStep={currentStepIndex(data.status) + 1}
                            totalSteps={STEPS.length}
                            stepLabel={STEPS[currentStepIndex(data.status)].title}
                        />
                    </div>
                </div>
            )}

            {/* Opportunity details */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">Your Opportunity</h3>
                <div className="divide-y divide-border">
                    <DetailRow icon={FileSearch} label="Title" value={data.title} />
                    <DetailRow icon={Building2} label="Organization" value={data.organizationName} />
                    <DetailRow icon={Layers} label="Categories" value={categories} />
                    <DetailRow icon={CalendarClock} label="Application deadline" value={data.deadline ? formatDate(data.deadline) : null} />
                </div>
            </div>

            {/* Tracking meta footer */}
            <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-5 sm:flex-row sm:items-center">
                <button
                    type="button"
                    onClick={copyTrackingId}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 font-mono text-sm tracking-widest text-foreground transition-colors hover:border-primary/40"
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
