"use client";

import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    EntrepreneurProfile,
    SECTIONS,
    SectionKey,
    Visibility,
} from "../_data/profile";

export type ChecklistKey =
    | "about"
    | "photo"
    | "identity"
    | "skills"
    | "journey"
    | "education"
    | "refs"
    | "venture"
    | "impact"
    | "funding";

interface ChecklistEntry {
    key: ChecklistKey;
    label: string;
    done: boolean;
}

function buildChecklist(profile: EntrepreneurProfile): ChecklistEntry[] {
    return [
        { key: "about", label: "Write your About story", done: !!profile.about },
        { key: "photo", label: "Add a profile photo", done: !!profile.photo },
        {
            key: "identity",
            label: "Verify your identity",
            done: profile.verification.national_id?.status === "verified",
        },
        { key: "skills", label: "Add 3+ skills", done: profile.skills.length >= 3 },
        { key: "journey", label: "Share your journey", done: profile.journey.length > 0 },
        { key: "education", label: "Add education or training", done: profile.education.length > 0 },
        { key: "refs", label: "Add a reference", done: profile.references.length > 0 },
        { key: "venture", label: "Add at least one venture", done: profile.ventures.length > 0 },
        {
            key: "impact",
            label: "Report your impact",
            done: profile.impact.jobs > 0 || profile.impact.customers > 0,
        },
        { key: "funding", label: "State your funding need", done: !!profile.funding.needAmount },
    ];
}

interface ProfileSidebarProps {
    profile: EntrepreneurProfile;
    visibility: Visibility;
    onToggleVisibilityAction: (key: SectionKey) => void;
    onChecklistAction?: (key: ChecklistKey) => void;
}

export function ProfileSidebar({
    profile,
    visibility,
    onToggleVisibilityAction,
    onChecklistAction,
}: ProfileSidebarProps) {
    const checklist = buildChecklist(profile);
    const done = checklist.filter((c) => c.done).length;
    const pct = Math.round((done / checklist.length) * 100);
    const level = pct >= 90 ? "All-Star" : pct >= 60 ? "Strong" : pct >= 35 ? "Intermediate" : "Just started";

    return (
        <div className="flex flex-col gap-4">
            {/* Profile strength */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-display text-[15px] font-bold">Profile strength</h3>
                <div className="mt-0.5 font-display text-[13px] font-bold text-primary-600">{level}</div>

                <div className="my-3.5 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-slower"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="text-[12.5px] text-muted-foreground">
                    {pct}% complete · {done} of {checklist.length} done
                </div>

                <div className="mt-3.5 flex flex-col gap-0.5">
                    {checklist.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            onClick={
                                !c.done && onChecklistAction ? () => onChecklistAction(c.key) : undefined
                            }
                            className={cn(
                                "group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left text-[13.5px] transition-colors hover:bg-muted/70",
                                c.done ? "text-muted-foreground" : "text-neutral-700"
                            )}
                        >
                            <span
                                className={cn(
                                    "grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2",
                                    c.done
                                        ? "border-primary-500 bg-primary-500 text-white"
                                        : "border-neutral-200 text-transparent"
                                )}
                            >
                                <Check className="h-3 w-3" />
                            </span>
                            <span className={cn("flex-1", c.done && "line-through")}>{c.label}</span>
                            {!c.done && (
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visibility summary */}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h3 className="font-display text-[15px] font-bold">Who can see what</h3>
                <p className="mb-3.5 mt-1 text-[12.5px] text-muted-foreground">
                    Toggle any section between public and private. Private sections are hidden from your
                    public profile.
                </p>
                <div className="flex flex-col gap-0.5">
                    {SECTIONS.map((s) => {
                        const isPublic = visibility[s.key];
                        return (
                            <div key={s.key} className="flex items-center gap-2.5 px-1 py-2 text-[13.5px]">
                                <span className="flex-1 text-neutral-700">{s.label}</span>
                                <button
                                    type="button"
                                    onClick={() => onToggleVisibilityAction(s.key)}
                                    className={cn(
                                        "rounded-full px-2.5 py-1 font-display text-[11.5px] font-bold transition-colors",
                                        isPublic
                                            ? "bg-primary-50 text-primary-700 hover:bg-primary-100"
                                            : "bg-muted text-muted-foreground hover:bg-neutral-200"
                                    )}
                                >
                                    {isPublic ? "Public" : "Private"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
