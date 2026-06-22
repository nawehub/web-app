"use client";

import {
    Award,
    GraduationCap,
    Leaf,
    Link2,
    Mail,
    MessageCircle,
    Phone,
    Plus,
    Users,
    CreditCard,
    X,
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EntrepreneurProfile, compactNumber } from "../_data/profile";
import { AddPrompt, PrivateFlag, SectionCard, SubHead } from "./section-card";

interface SectionProps {
    profile: EntrepreneurProfile;
    isPublic: boolean;
    onToggleVisibility?: () => void;
    onEdit?: () => void;
}

/* ---------- About ---------- */
export function AboutSection({ profile, isPublic, onToggleVisibility, onEdit }: SectionProps) {
    return (
        <SectionCard
            title="About"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
            onEdit={onEdit}
        >
            {profile.about ? (
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
                    {profile.about}
                </p>
            ) : onEdit ? (
                <AddPrompt label="Tell your story — who you are and what drives you" onClick={onEdit} />
            ) : null}
        </SectionCard>
    );
}

/* ---------- Skills ---------- */
export function SkillsSection({
    profile,
    isPublic,
    onToggleVisibility,
    onAdd,
    onRemove,
}: SectionProps & { onAdd?: () => void; onRemove?: (skill: string) => void }) {
    return (
        <SectionCard title="Skills & Expertise" isPublic={isPublic} onToggleVisibility={onToggleVisibility}>
            <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                    <Chip key={s} onRemove={onRemove ? () => onRemove(s) : undefined}>
                        {s}
                    </Chip>
                ))}
                {onAdd && <ChipAdd onClick={onAdd}>Add skill</ChipAdd>}
            </div>
        </SectionCard>
    );
}

/* ---------- Journey ---------- */
export function JourneySection({
    profile,
    isPublic,
    onToggleVisibility,
    onAddItem,
    onEditItem,
}: SectionProps & { onAddItem?: () => void; onEditItem?: (index: number) => void }) {
    return (
        <SectionCard
            title="Entrepreneurial Journey"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
        >
            {profile.journey.length > 0 && (
                <div className="mb-3 flex flex-col">
                    {profile.journey.map((j, i) => {
                        const Comp = onEditItem ? "button" : "div";
                        return (
                            <Comp
                                key={j.id}
                                type={onEditItem ? "button" : undefined}
                                onClick={onEditItem ? () => onEditItem(i) : undefined}
                                className={cn(
                                    "grid grid-cols-[64px_1fr] gap-3.5 border-b border-border py-3.5 text-left last:border-0 last:pb-0",
                                    onEditItem && "-mx-2 rounded-lg px-2 transition-colors hover:bg-muted/60"
                                )}
                            >
                                <div className="font-display text-sm font-extrabold text-primary">
                                    {j.year}
                                </div>
                                <div>
                                    <h4 className="font-display text-[15px] font-semibold text-foreground">{j.title}</h4>
                                    {j.desc && (
                                        <p className="mt-1 text-[13.5px] leading-normal text-muted-foreground">
                                            {j.desc}
                                        </p>
                                    )}
                                </div>
                            </Comp>
                        );
                    })}
                </div>
            )}
            {onAddItem && (
                <AddPrompt label="Add a milestone, role, or past venture" onClick={onAddItem} />
            )}
        </SectionCard>
    );
}

/* ---------- Education ---------- */
export function EducationSection({
    profile,
    isPublic,
    onToggleVisibility,
    onAddItem,
    onEditItem,
}: SectionProps & { onAddItem?: () => void; onEditItem?: (index: number) => void }) {
    return (
        <SectionCard
            title="Education & Training"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
        >
            {profile.education.length > 0 && (
                <div className="mb-3 flex flex-col gap-2.5">
                    {profile.education.map((e, i) => (
                        <SimpleListItem
                            key={e.id}
                            icon={<GraduationCap className="h-4 w-4" />}
                            title={e.title}
                            sub={`${e.org} · ${e.year}`}
                            onClick={onEditItem ? () => onEditItem(i) : undefined}
                        />
                    ))}
                </div>
            )}
            {onAddItem && (
                <AddPrompt label="Add education, certification or training" onClick={onAddItem} />
            )}
        </SectionCard>
    );
}

/* ---------- Credibility ---------- */
type CredKind = "references" | "awards" | "links";

export function CredibilitySection({
    profile,
    isPublic,
    onToggleVisibility,
    onAddMembership,
    onRemoveMembership,
    onAddCredItem,
    onEditCredItem,
}: SectionProps & {
    onAddMembership?: () => void;
    onRemoveMembership?: (m: string) => void;
    onAddCredItem?: (kind: CredKind) => void;
    onEditCredItem?: (kind: CredKind, index: number) => void;
}) {
    return (
        <SectionCard title="Credibility" isPublic={isPublic} onToggleVisibility={onToggleVisibility}>
            <SubHead>References</SubHead>
            <div className="flex flex-col gap-2.5">
                {profile.references.map((r, i) => (
                    <SimpleListItem
                        key={r.id}
                        tone="blue"
                        icon={<Users className="h-4 w-4" />}
                        title={r.name}
                        sub={`${r.role} · ${r.type} reference`}
                        onClick={onEditCredItem ? () => onEditCredItem("references", i) : undefined}
                    />
                ))}
                {onAddCredItem && (
                    <AddPrompt
                        label="Add a reference"
                        onClick={() => onAddCredItem("references")}
                        compact
                    />
                )}
            </div>

            <SubHead>Memberships</SubHead>
            <div className="flex flex-wrap gap-2">
                {profile.memberships.map((m) => (
                    <Chip key={m} onRemove={onRemoveMembership ? () => onRemoveMembership(m) : undefined}>
                        {m}
                    </Chip>
                ))}
                {onAddMembership && <ChipAdd onClick={onAddMembership}>Add</ChipAdd>}
            </div>

            <SubHead>Awards &amp; Recognition</SubHead>
            <div className="flex flex-col gap-2.5">
                {profile.awards.map((a, i) => (
                    <SimpleListItem
                        key={a.id}
                        tone="amber"
                        icon={<Award className="h-4 w-4" />}
                        title={a.title}
                        sub={a.year}
                        onClick={onEditCredItem ? () => onEditCredItem("awards", i) : undefined}
                    />
                ))}
                {onAddCredItem && (
                    <AddPrompt
                        label="Add an award or recognition"
                        onClick={() => onAddCredItem("awards")}
                        compact
                    />
                )}
            </div>

            <SubHead>Public Profiles &amp; Links</SubHead>
            <div className="flex flex-col gap-2.5">
                {profile.links.map((l, i) => (
                    <SimpleListItem
                        key={l.id}
                        icon={<Link2 className="h-4 w-4" />}
                        title={l.label}
                        sub={l.url}
                        onClick={onEditCredItem ? () => onEditCredItem("links", i) : undefined}
                    />
                ))}
                {onAddCredItem && (
                    <AddPrompt
                        label="Add a public profile or link"
                        onClick={() => onAddCredItem("links")}
                        compact
                    />
                )}
            </div>
        </SectionCard>
    );
}

/* ---------- Impact ---------- */
export function ImpactSection({ profile, isPublic, onToggleVisibility, onEdit }: SectionProps) {
    const im = profile.impact;
    return (
        <SectionCard
            title="Impact & Results"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
            onEdit={onEdit}
        >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat value={`${im.jobs}`} label="Jobs created" />
                <Stat value={compactNumber(im.customers)} label="Customers reached" />
                <Stat value={compactNumber(im.beneficiaries)} label="Beneficiaries" />
                <Stat value={`${im.communities}`} label="Communities served" />
            </div>

            {im.environmental.length > 0 && (
                <>
                    <SubHead>Environmental impact</SubHead>
                    <div className="flex flex-wrap gap-2">
                        {im.environmental.map((e) => (
                            <span
                                key={e}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1.5 font-display text-xs font-semibold text-primary dark:bg-primary/15"
                            >
                                <Leaf className="h-3.5 w-3.5" />
                                {e}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {im.stories && (
                <>
                    <SubHead>Success story</SubHead>
                    <p className="text-sm leading-relaxed text-foreground/80">{im.stories}</p>
                </>
            )}
        </SectionCard>
    );
}

/* ---------- Funding ---------- */
export function FundingSection({ profile, isPublic, onToggleVisibility, onEdit }: SectionProps) {
    const f = profile.funding;
    return (
        <SectionCard
            title="Funding & Support"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
            onEdit={onEdit}
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <SubHead>Funding received</SubHead>
                    <div className="flex flex-wrap gap-2">
                        {f.received.map((r) => (
                            <Tag key={r} tone="gray">
                                {r}
                            </Tag>
                        ))}
                    </div>
                    <SubHead>Support needed</SubHead>
                    <div className="flex flex-wrap gap-2">
                        {f.supportNeeded.map((r) => (
                            <Tag key={r} tone="amber">
                                {r}
                            </Tag>
                        ))}
                    </div>
                </div>
                <div>
                    <SubHead>Current funding need</SubHead>
                    <div className="rounded-xl border border-border bg-gradient-to-br from-muted/60 to-card p-4">
                        <div className="font-display text-[22px] font-extrabold text-accent">
                            {f.needAmount || "—"}
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground">{f.needNote}</p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

/* ---------- Contact ---------- */
export function ContactSection({ profile, isPublic, onToggleVisibility, onEdit }: SectionProps) {
    const c = profile.contact;
    const rows: { icon: ReactNode; label: string; value?: string }[] = [
        { icon: <Mail className="h-4 w-4" />, label: "Email", value: c.email },
        { icon: <Phone className="h-4 w-4" />, label: "Phone", value: c.phone },
        { icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp", value: c.whatsapp },
        { icon: <Link2 className="h-4 w-4" />, label: "LinkedIn", value: c.linkedin },
        { icon: <Link2 className="h-4 w-4" />, label: "Facebook", value: c.facebook },
        { icon: <Link2 className="h-4 w-4" />, label: "X (Twitter)", value: c.x },
        { icon: <CreditCard className="h-4 w-4" />, label: "National ID", value: c.nationalId },
    ];

    return (
        <SectionCard
            title="Contact & Identity"
            isPublic={isPublic}
            onToggleVisibility={onToggleVisibility}
            onEdit={onEdit}
        >
            {!isPublic && (
                <div className="mb-3">
                    <PrivateFlag>
                        Hidden from public — only you and verified investors who request an intro can see
                        this
                    </PrivateFlag>
                </div>
            )}
            <div className="grid gap-2.5 sm:grid-cols-2">
                {rows
                    .filter((r) => r.value)
                    .map((r) => (
                        <div
                            key={r.label}
                            className="flex items-center gap-3 rounded-xl border border-border p-3"
                        >
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15">
                                {r.icon}
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11.5px] text-muted-foreground">{r.label}</div>
                                <div className="truncate font-display text-[13.5px] font-semibold text-foreground">
                                    {r.value}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </SectionCard>
    );
}

/* ============================================================
   Shared building blocks
   ============================================================ */
export function Chip({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-display text-[13px] font-semibold text-primary dark:bg-primary/15">
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Remove"
                    className="opacity-60 transition-opacity hover:opacity-100"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
}

export function ChipAdd({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed bg-card px-3 py-1.5 font-display text-[13px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
            <Plus className="h-3.5 w-3.5" />
            {children}
        </button>
    );
}

function Tag({ children, tone }: { children: ReactNode; tone?: "gray" | "amber" }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[12.5px] font-semibold",
                tone === "amber"
                    ? "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]"
                    : "bg-muted text-muted-foreground"
            )}
        >
            {children}
        </span>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-xl bg-muted/70 p-3.5 text-center">
            <b className="font-display text-[22px] font-extrabold text-primary">{value}</b>
            <span className="mt-0.5 block text-[11.5px] text-muted-foreground">{label}</span>
        </div>
    );
}

function SimpleListItem({
    icon,
    title,
    sub,
    tone,
    onClick,
}: {
    icon: ReactNode;
    title: string;
    sub: string;
    tone?: "green" | "amber" | "blue";
    onClick?: () => void;
}) {
    const Comp = onClick ? "button" : "div";
    return (
        <Comp
            type={onClick ? "button" : undefined}
            onClick={onClick}
            className={cn(
                "flex w-full items-start gap-3 rounded-xl border border-border p-3 text-left",
                onClick && "transition-colors hover:border-primary/30 hover:bg-muted/50"
            )}
        >
            <div
                className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    tone === "amber"
                        ? "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]"
                        : tone === "blue"
                          ? "bg-info/10 text-info"
                          : "bg-primary/10 text-primary dark:bg-primary/15"
                )}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <h4 className="font-display text-[14.5px] font-semibold text-foreground">{title}</h4>
                <span className="text-[12.5px] text-muted-foreground">{sub}</span>
            </div>
        </Comp>
    );
}