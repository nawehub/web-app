"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Check,
    CreditCard,
    ExternalLink,
    FileText,
    Grid3X3,
    Inbox,
    Mail,
    MapPin,
    ScanFace,
    Star,
    Users,
    X,
} from "lucide-react";
import { EntrepreneurProfile } from "@/app/dashboard/user-settings/_data/profile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VettingCase } from "@/types/vetting-admin";
import {
    AVATAR_COLORS,
    AUTO_FEATURE_SCORE_THRESHOLD,
    CHECK_ITEMS,
    ENT_RATINGS,
    STATUS_META,
    TRUST_WEIGHTS,
    VEN_RATINGS,
    fmtCompact,
    fmtDate,
    initials,
    scoreColor,
    suggestEntRating,
    trustOverall,
} from "../_data/vetting";
import { cn } from "@/lib/utils";

const CHECK_ICONS = {
    national_id: CreditCard,
    selfie: ScanFace,
    contact: Mail,
    references: Users,
    business: FileText,
} as const;

interface VettingWorkspaceProps {
    vettingCase: VettingCase | null;
    profile: EntrepreneurProfile | null;
    reviewerName: string;
    isFeatured: boolean;
    onBack: () => void;
    onTrustChange: (key: keyof VettingCase["trust"], value: number) => void;
    onCheckToggle: (key: keyof VettingCase["checks"], status: "approved" | "rejected") => void;
    onEntRatingChange: (rating: string) => void;
    onVenRatingChange: (ventureId: string, rating: string) => void;
    onNotesChange: (notes: string) => void;
    onDecide: (status: VettingCase["status"]) => void;
}

export function VettingWorkspace({
    vettingCase,
    profile,
    reviewerName,
    isFeatured,
    onBack,
    onTrustChange,
    onCheckToggle,
    onEntRatingChange,
    onVenRatingChange,
    onNotesChange,
    onDecide,
}: VettingWorkspaceProps) {
    if (!vettingCase || !profile) {
        return (
            <main className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border bg-card px-6 py-16 text-center shadow-sm">
                <div className="mb-4 text-muted-foreground">
                    <Inbox className="mx-auto h-7 w-7" strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                    Select a case to review
                </h3>
                <p className="mt-1 max-w-sm text-[13.5px] text-muted-foreground">
                    Pick an entrepreneur from the vetting queue to verify documents, score, and
                    decide.
                </p>
            </main>
        );
    }

    const overall = trustOverall(vettingCase.trust);
    const meta = STATUS_META[vettingCase.status];
    const av = AVATAR_COLORS[vettingCase.id] ?? ["#78716b", "#44403a"];
    const checksApproved = CHECK_ITEMS.filter(
        (item) => vettingCase.checks[item.k] === "approved"
    ).length;
    const allChecksDone = checksApproved === CHECK_ITEMS.length;

    return (
        <main className="flex flex-col gap-4">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBack}
                className="w-fit rounded-full border-primary-600 text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/40"
            >
                <ArrowLeft className="h-4 w-4" /> Back to queue
            </Button>

            {/* Hero */}
            <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="border-b p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                            <span
                                className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-base font-bold text-white"
                                style={{
                                    background: `linear-gradient(135deg, ${av[0]}, ${av[1]})`,
                                }}
                            >
                                {initials(profile.name)}
                            </span>
                            <div>
                                <h1 className="flex flex-wrap items-center gap-2 font-display text-xl font-extrabold text-foreground sm:text-2xl">
                                    {profile.name}
                                    <span
                                        className={cn(
                                            "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                                            meta.pillClass
                                        )}
                                    >
                                        {meta.label}
                                    </span>
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
                                <div className="mt-2 flex flex-wrap gap-3 text-[12.5px] text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {profile.location || profile.district}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Submitted {fmtDate(vettingCase.submitted)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <Grid3X3 className="h-3.5 w-3.5" />
                                        {profile.ventures?.length ?? 0} venture
                                        {(profile.ventures?.length ?? 0) === 1 ? "" : "s"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                            {isFeatured && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200">
                                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                    Auto-featured ({AUTO_FEATURE_SCORE_THRESHOLD}%+)
                                </span>
                            )}
                            {vettingCase.status === "approved" && !isFeatured && (
                                <span className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                                    Vetted · below {AUTO_FEATURE_SCORE_THRESHOLD}% featured threshold
                                </span>
                            )}
                            <Button asChild variant="outline" size="sm" className="rounded-full">
                                <Link
                                    href={`/web/vetted-entrepreneurs/${vettingCase.id}`}
                                    target="_blank"
                                >
                                    <ExternalLink className="h-4 w-4" /> Public profile
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-4 bg-muted/30 p-5 sm:flex-row sm:items-center sm:p-6">
                    <TrustRing score={overall} />
                    <div>
                        <h4 className="font-display text-sm font-bold text-foreground">
                            Overall Trust Score
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Weighted from 6 vetting components · live
                        </p>
                    </div>
                    <div className="sm:ml-auto">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Entrepreneur rating
                        </div>
                        <div className="font-display text-base font-extrabold text-primary-700 dark:text-primary-400">
                            {vettingCase.entRating}
                        </div>
                    </div>
                </div>
            </section>

            {/* Identity */}
            <WorkspaceCard
                title="Identity & Document Verification"
                badge={
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10.5px] font-bold",
                            allChecksDone
                                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        )}
                    >
                        {checksApproved}/{CHECK_ITEMS.length} approved
                    </span>
                }
            >
                <div className="space-y-3">
                    {CHECK_ITEMS.map((item) => {
                        const status = vettingCase.checks[item.k];
                        const Icon = CHECK_ICONS[item.k];
                        return (
                            <div
                                key={item.k}
                                className="flex flex-col gap-3 rounded-xl border bg-background p-3.5 sm:flex-row sm:items-center"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {item.label}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{item.hint}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onCheckToggle(item.k, "rejected")}
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                                            status === "rejected"
                                                ? "border-red-500 bg-red-500 text-white"
                                                : "border-border bg-card text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950/40"
                                        )}
                                    >
                                        <X className="h-3.5 w-3.5" /> Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onCheckToggle(item.k, "approved")}
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                                            status === "approved"
                                                ? "border-primary-600 bg-primary-600 text-white"
                                                : "border-border bg-card text-muted-foreground hover:bg-primary-50 dark:hover:bg-primary-950/40"
                                        )}
                                    >
                                        <Check className="h-3.5 w-3.5" /> Approve
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                        "National ID — front",
                        "National ID — back",
                        "Selfie capture",
                        profile.ventures?.[0]?.registered
                            ? "Registration cert."
                            : "Sales records",
                    ].map((label) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-4 text-center"
                        >
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="text-[11px] font-medium text-muted-foreground">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </WorkspaceCard>

            {/* Profile review */}
            <WorkspaceCard title="Profile Review">
                {profile.about && (
                    <ReviewBlock title="About">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {profile.about.length > 360
                                ? `${profile.about.slice(0, 360)}…`
                                : profile.about}
                        </p>
                    </ReviewBlock>
                )}
                <ReviewBlock title="Skills">
                    <TagList items={profile.skills} />
                </ReviewBlock>
                <ReviewBlock title="References & credibility">
                    <div className="flex flex-wrap gap-1.5">
                        {(profile.references ?? []).map((r) => (
                            <span
                                key={r.id}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                                {r.name} · {r.type}
                            </span>
                        ))}
                        {(profile.memberships ?? []).map((m) => (
                            <span
                                key={m}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </ReviewBlock>
                <ReviewBlock title="Impact evidence">
                    <div className="flex flex-wrap gap-1.5">
                        <ImpactTag>{profile.impact?.jobs ?? 0} jobs</ImpactTag>
                        <ImpactTag>{fmtCompact(profile.impact?.customers ?? 0)} customers</ImpactTag>
                        <ImpactTag>
                            {fmtCompact(profile.impact?.beneficiaries ?? 0)} beneficiaries
                        </ImpactTag>
                        {(profile.impact?.environmental ?? []).map((e) => (
                            <span
                                key={e}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            >
                                {e}
                            </span>
                        ))}
                    </div>
                </ReviewBlock>
            </WorkspaceCard>

            {/* Ventures */}
            <WorkspaceCard title="Venture Assessment">
                {(profile.ventures ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No ventures submitted.</p>
                ) : (
                    <div className="space-y-4">
                        {profile.ventures.map((venture) => {
                            const rating =
                                vettingCase.venRatings[venture.id] ?? venture.rating ?? VEN_RATINGS[0];
                            const sectorColors =
                                AVATAR_COLORS[vettingCase.id] ?? ["#78716b", "#44403a"];
                            return (
                                <div key={venture.id} className="rounded-xl border p-4">
                                    <div className="flex flex-wrap items-start gap-3">
                                        <span
                                            className="grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-white"
                                            style={{
                                                background: `linear-gradient(135deg, ${sectorColors[0]}, ${sectorColors[1]})`,
                                            }}
                                        >
                                            {initials(venture.name)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="flex flex-wrap items-center gap-2 font-display text-sm font-bold text-foreground">
                                                {venture.name}
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                                    {venture.sector}
                                                </span>
                                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    {venture.stage}
                                                </span>
                                            </h4>
                                        </div>
                                        <div className="font-display text-base font-extrabold text-primary-700 dark:text-primary-400">
                                            {venture.score}
                                            <span className="text-[11px] font-semibold text-muted-foreground">
                                                {" "}
                                                /100
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg bg-muted/40 p-3">
                                            <h6 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                                                Problem
                                            </h6>
                                            <p className="mt-1 text-sm text-foreground/90">{venture.problem}</p>
                                        </div>
                                        <div className="rounded-lg bg-muted/40 p-3">
                                            <h6 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                                                Solution
                                            </h6>
                                            <p className="mt-1 text-sm text-foreground/90">{venture.solution}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {(venture.validation ?? []).map((v) => (
                                            <span
                                                key={v}
                                                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                                            >
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                        <label className="text-xs font-semibold text-muted-foreground">
                                            Venture rating
                                        </label>
                                        <select
                                            value={rating}
                                            onChange={(e) =>
                                                onVenRatingChange(venture.id, e.target.value)
                                            }
                                            className="rounded-lg border bg-background px-3 py-1.5 text-sm"
                                        >
                                            {VEN_RATINGS.map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="text-xs text-muted-foreground">
                                            {venture.registered
                                                ? "✓ Registered business"
                                                : "Informal — alt. evidence"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </WorkspaceCard>

            {/* Scoring */}
            <WorkspaceCard
                title="Trust Score Components"
                subtitle="Adjust to recompute the overall score"
            >
                <div className="space-y-4">
                    {TRUST_WEIGHTS.map((weight) => (
                        <div key={weight.k}>
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-foreground">
                                    {weight.label}
                                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                                        weight {Math.round(weight.w * 100)}%
                                    </span>
                                </span>
                                <b className="font-display text-sm text-foreground">
                                    {vettingCase.trust[weight.k]}
                                </b>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={vettingCase.trust[weight.k]}
                                onChange={(e) =>
                                    onTrustChange(weight.k, Number(e.target.value))
                                }
                                className="h-2 w-full cursor-pointer accent-primary-600"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">{weight.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-5 border-t pt-5">
                    <h5 className="text-sm font-bold text-foreground">Entrepreneur rating</h5>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {ENT_RATINGS.map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => onEntRatingChange(rating)}
                                className={cn(
                                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                                    vettingCase.entRating === rating
                                        ? "border-primary-600 bg-primary-600 text-white"
                                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {rating}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Suggested from score:{" "}
                        <strong className="text-primary-700 dark:text-primary-400">
                            {suggestEntRating(overall)}
                        </strong>
                    </p>
                </div>
            </WorkspaceCard>

            {/* Decision */}
            <section className="rounded-2xl border bg-card p-5 shadow-sm">
                <Textarea
                    value={vettingCase.notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Internal review notes (visible to admins only)…"
                    className="min-h-[88px] resize-y"
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <span className="text-xs text-muted-foreground sm:mr-auto">
                        Reviewer: <strong>{reviewerName}</strong> · Case {vettingCase.id}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() => onDecide("rejected")}
                    >
                        Reject
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onDecide("changes")}
                    >
                        Request changes
                    </Button>
                    <Button
                        type="button"
                        className="bg-primary-600 hover:bg-primary-700"
                        onClick={() => onDecide("approved")}
                    >
                        <Check className="h-4 w-4" /> Approve &amp; publish
                    </Button>
                </div>
            </section>
        </main>
    );
}

function WorkspaceCard({
    title,
    subtitle,
    badge,
    children,
}: {
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
                <div>
                    <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                {badge}
            </div>
            <div className="space-y-4 p-5">{children}</div>
        </section>
    );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
            <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {title}
            </h5>
            {children}
        </div>
    );
}

function TagList({ items }: { items: string[] }) {
    if (!items?.length) return <span className="text-sm text-muted-foreground">—</span>;
    return (
        <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
                <span
                    key={item}
                    className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

function ImpactTag({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {children}
        </span>
    );
}

function TrustRing({ score }: { score: number }) {
    const color = scoreColor(score);
    return (
        <div
            className="relative grid h-[72px] w-[72px] place-items-center rounded-full"
            style={{
                background: `conic-gradient(${color} ${score}%, hsl(var(--border)) 0)`,
            }}
        >
            <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-card font-display text-lg font-extrabold text-primary-700 dark:text-primary-400">
                {score}
            </span>
        </div>
    );
}
