"use client";

import { useState } from "react";
import { BadgeCheck, Check, ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    EntrepreneurProfile,
    SECTOR_GRADIENT,
    Venture,
    compactNumber,
    initials,
} from "@/types/entrepreneur-profile";
import { AddPrompt, SectionCard } from "./section-card";

interface VenturesSectionProps {
    profile: EntrepreneurProfile;
    isPublic: boolean;
    onToggleVisibility?: () => void;
    onAddVenture?: () => void;
    onEditVenture?: (id: string) => void;
}

export function VenturesSection({
    profile,
    isPublic,
    onToggleVisibility,
    onAddVenture,
    onEditVenture,
}: VenturesSectionProps) {
    return (
        <SectionCard
            title={
                <span>
                    Ventures Portfolio{" "}
                    <span className="text-sm font-semibold text-muted-foreground">
                        ({profile.ventures.length})
                    </span>
                </span>
            }
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
        >
            <div className="flex flex-col gap-3.5">
                {profile.ventures.map((v) => (
                    <VentureCard
                        key={v.id}
                        venture={v}
                        onEdit={onEditVenture ? () => onEditVenture(v.id) : undefined}
                    />
                ))}
            </div>
            {onAddVenture && (
                <div className="mt-3.5">
                    <AddPrompt label="Add a business, startup, project or idea" onClick={onAddVenture} />
                </div>
            )}
        </SectionCard>
    );
}

function VentureCard({ venture: v, onEdit }: { venture: Venture; onEdit?: () => void }) {
    const [open, setOpen] = useState(false);
    const [from, to] = SECTOR_GRADIENT[v.sector] ?? SECTOR_GRADIENT.Other;

    return (
        <div className="overflow-hidden rounded-xl border transition-colors hover:border-primary-100 hover:shadow-sm">
            {/* Top */}
            <div className="flex items-start gap-3.5 p-4">
                <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-extrabold text-white"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                    {initials(v.name)}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="flex flex-wrap items-center gap-2 font-display text-base font-bold">
                        {v.name}
                        {onEdit && (
                            <button
                                type="button"
                                onClick={onEdit}
                                title="Edit venture"
                                aria-label="Edit venture"
                                className="grid h-7 w-7 place-items-center rounded-lg border bg-card text-muted-foreground transition-colors hover:border-primary-100 hover:bg-primary-50 hover:text-primary-600"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <Tag>{v.sector}</Tag>
                        <Tag tone="amber">{v.stage}</Tag>
                        <Tag tone="gray">{v.type}</Tag>
                        {v.registered && (
                            <Tag tone="green">
                                <Check className="h-3 w-3" /> Registered
                            </Tag>
                        )}
                    </div>
                </div>
                <div className="shrink-0 text-center">
                    <div className="font-display text-lg font-extrabold text-primary-700">{v.score}</div>
                    <div className="text-[10px] uppercase leading-tight tracking-wide text-muted-foreground">
                        Venture
                        <br />
                        Score
                    </div>
                </div>
            </div>

            {/* Detail */}
            {open && (
                <div className="animate-fade-in-up px-4 pb-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <PCard title="Problem">{v.problem}</PCard>
                        <PCard title="Solution">{v.solution}</PCard>
                        <PCard title="Target customers">{v.customers}</PCard>
                        <PCard title="Business model">{v.model}</PCard>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 border-t border-neutral-100 py-3">
                        <Metric value={`${v.jobs}`} label="Jobs created" />
                        <Metric value={compactNumber(v.customersReached)} label="Customers reached" />
                        <Metric value={compactNumber(v.beneficiaries)} label="Beneficiaries" />
                        <Metric value={v.innovation} label="Innovation level" />
                    </div>

                    <p className="mb-2 mt-1.5 font-display text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Validation evidence
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {v.validation.length > 0 ? (
                            v.validation.map((x) => (
                                <Tag key={x} tone="gray">
                                    {x}
                                </Tag>
                            ))
                        ) : (
                            <span className="text-[13px] text-muted-foreground">
                                No validation added yet
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Foot */}
            <div className="flex items-center gap-2.5 border-t border-neutral-100 bg-muted/60 px-4 py-2.5">
                <Tag tone="amber">
                    <BadgeCheck className="h-3.5 w-3.5" /> {v.rating}
                </Tag>
                <span className="flex-1" />
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-primary-600"
                >
                    Details
                    <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
                    />
                </button>
            </div>
        </div>
    );
}

function PCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-muted/70 p-3.5">
            <h5 className="mb-1.5 font-display text-[11.5px] font-bold uppercase tracking-wide text-muted-foreground">
                {title}
            </h5>
            <p className="text-[13.5px] leading-normal text-neutral-700">{children}</p>
        </div>
    );
}

function Metric({ value, label }: { value: string; label: string }) {
    return (
        <div className="min-w-[80px]">
            <b className="font-display text-[17px] font-extrabold text-foreground">{value}</b>
            <span className="block text-[11.5px] text-muted-foreground">{label}</span>
        </div>
    );
}

function Tag({
    children,
    tone,
}: {
    children: React.ReactNode;
    tone?: "amber" | "gray" | "green";
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-[12.5px] font-semibold",
                tone === "amber"
                    ? "bg-secondary-50 text-secondary-600"
                    : tone === "gray"
                      ? "bg-muted text-muted-foreground"
                      : tone === "green"
                        ? "bg-primary-50 text-primary-700"
                        : "bg-primary-100 text-primary-700"
            )}
        >
            {children}
        </span>
    );
}
