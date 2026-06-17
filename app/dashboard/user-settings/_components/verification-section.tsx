"use client";

import {
    BadgeCheck,
    Check,
    Clock,
    CreditCard,
    Mail,
    Phone,
    ScanFace,
} from "lucide-react";
import { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DEMO_MODE,
    EntrepreneurProfile,
    VerificationKey,
    VerificationStatus,
} from "../_data/profile";
import { PrivateFlag } from "./section-card";

interface VItem {
    key: VerificationKey;
    kind: "doc" | "selfie" | "code";
    icon: ComponentType<{ className?: string }>;
    required?: boolean;
    optional?: boolean;
}

const VITEMS: VItem[] = [
    { key: "national_id", kind: "doc", icon: CreditCard, required: true },
    { key: "selfie", kind: "selfie", icon: ScanFace },
    { key: "email", kind: "code", icon: Mail },
    { key: "phone", kind: "code", icon: Phone },
    { key: "passport", kind: "doc", icon: CreditCard, optional: true },
    { key: "voter_id", kind: "doc", icon: CreditCard, optional: true },
];

function actionLabel(kind: VItem["kind"], st: VerificationStatus) {
    if (st === "verified") return kind === "code" ? "Re-verify" : "Replace";
    if (st === "review") return "View";
    return kind === "doc" ? "Upload" : kind === "selfie" ? "Start" : "Verify";
}

interface VerificationSectionProps {
    profile: EntrepreneurProfile;
    onVerify?: (key: VerificationKey) => void;
    onSimulateApproval?: () => void;
}

export function VerificationSection({
    profile,
    onVerify,
    onSimulateApproval,
}: VerificationSectionProps) {
    const stat = (k: VerificationKey): VerificationStatus =>
        profile.verification[k]?.status ?? "none";

    const verified = VITEMS.filter((i) => stat(i.key) === "verified").length;
    const reqDone = VITEMS.filter((i) => i.required).every((i) => stat(i.key) === "verified");
    const anyReview = VITEMS.some((i) => stat(i.key) === "review");

    return (
        <section className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
                <h2 className="flex-1 text-lg font-bold font-display tracking-tight">
                    Identity &amp; Verification
                </h2>
                <PrivateFlag>Only you &amp; NaWeHub</PrivateFlag>
            </div>

            <div className="px-5 pb-6 pt-4 sm:px-6">
                {/* Banner */}
                <div
                    className={cn(
                        "mb-4 flex items-center gap-3.5 rounded-xl border p-4",
                        reqDone
                            ? "border-primary-100 bg-primary-50"
                            : "border-secondary-100 bg-secondary-50"
                    )}
                >
                    <div
                        className={cn(
                            "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card shadow-sm",
                            reqDone ? "text-primary-600" : "text-secondary-600"
                        )}
                    >
                        {reqDone ? <BadgeCheck className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-display text-sm font-semibold">
                            {reqDone
                                ? "Your identity is verified"
                                : "Verify your identity to earn the trust badge"}
                        </h4>
                        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            {verified} of {VITEMS.length} checks complete · Documents are encrypted and
                            only seen by NaWeHub&apos;s vetting team.
                        </p>
                    </div>
                    {DEMO_MODE && anyReview && onSimulateApproval && (
                        // TODO(api): remove — demo-only shortcut that fakes vetting-team approval.
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onSimulateApproval}
                            className="shrink-0 rounded-full"
                        >
                            Simulate NaWeHub approval
                        </Button>
                    )}
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-2.5">
                    {VITEMS.map((item) => {
                        const st = stat(item.key);
                        const check = profile.verification[item.key];
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.key}
                                className={cn(
                                    "flex flex-wrap items-center gap-3 rounded-xl border p-3.5",
                                    st === "verified" &&
                                        "border-primary-100 bg-gradient-to-b from-primary-50 to-card"
                                )}
                            >
                                <div
                                    className={cn(
                                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                                        st === "verified"
                                            ? "bg-primary-100 text-primary-600"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-[140px] flex-1">
                                    <h4 className="flex items-center gap-1.5 font-display text-sm font-semibold">
                                        {check?.label}
                                        {item.optional ? (
                                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
                                                Optional
                                            </span>
                                        ) : item.required ? (
                                            <span className="rounded-full bg-secondary-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-secondary-600">
                                                Required
                                            </span>
                                        ) : null}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">{check?.desc}</span>
                                </div>
                                <StatusPill status={st} />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={st === "none" && item.required ? "default" : "ghost"}
                                    onClick={() => onVerify?.(item.key)}
                                    className={cn(
                                        "rounded-full",
                                        !(st === "none" && item.required) &&
                                            "bg-primary-100 text-primary-700 hover:bg-primary-200"
                                    )}
                                >
                                    {actionLabel(item.kind, st)}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function StatusPill({ status }: { status: VerificationStatus }) {
    if (status === "verified") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1.5 font-display text-[11.5px] font-bold text-primary-700">
                <Check className="h-3 w-3" /> Verified
            </span>
        );
    }
    if (status === "review") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-2.5 py-1.5 font-display text-[11.5px] font-bold text-secondary-600">
                <Clock className="h-3 w-3" /> In review
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1.5 font-display text-[11.5px] font-bold text-muted-foreground">
            Not started
        </span>
    );
}
