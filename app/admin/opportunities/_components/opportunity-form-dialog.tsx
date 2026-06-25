"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatDeadlineLabel, initials } from "@/lib/opportunities";
import {
    Opportunity,
    OpportunityType,
    OPPORTUNITY_PALETTE,
    OPPORTUNITY_TYPE_ORDER,
    OPPORTUNITY_TYPES,
} from "@/types/opportunities";

function blankOpportunity(): Opportunity {
    return {
        id: "opp-" + Date.now(),
        type: "grant",
        featured: false,
        open: true,
        title: "",
        org: "",
        logo: "",
        c1: OPPORTUNITY_PALETTE[Math.floor(Math.random() * OPPORTUNITY_PALETTE.length)],
        amount: "",
        deadline: "",
        deadlineLabel: "",
        location: "",
        sectors: [],
        stage: "",
        summary: "",
        tags: [],
        spots: "",
    };
}

interface OpportunityFormDialogProps {
    open: boolean;
    /** The opportunity being edited, or null when posting a new one. */
    opportunity: Opportunity | null;
    onOpenChange: (open: boolean) => void;
    onSubmit: (opp: Opportunity, mode: "create" | "edit") => void;
    onDelete: (id: string) => void;
}

const labelClass =
    "mb-1.5 block font-display text-[13px] font-semibold text-foreground";
const inputClass = "h-11 text-sm";

export function OpportunityFormDialog({
    open,
    opportunity,
    onOpenChange,
    onSubmit,
    onDelete,
}: OpportunityFormDialogProps) {
    const isEdit = !!opportunity;

    const [form, setForm] = useState<Opportunity>(blankOpportunity);
    const [sectorsText, setSectorsText] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [titleError, setTitleError] = useState(false);

    // Re-seed the form each time the dialog opens.
    useEffect(() => {
        if (!open) return;
        const base: Opportunity = opportunity
            ? JSON.parse(JSON.stringify(opportunity))
            : blankOpportunity();
        base.tags = base.tags ?? [];
        base.sectors = base.sectors ?? [];
        setForm(base);
        setSectorsText((base.sectors ?? []).join(", "));
        setTagInput("");
        setTitleError(false);
    }, [open, opportunity]);

    const set = <K extends keyof Opportunity>(key: K, value: Opportunity[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const addTag = () => {
        const v = tagInput.trim();
        if (v && !(form.tags ?? []).includes(v)) set("tags", [...(form.tags ?? []), v]);
        setTagInput("");
    };

    const removeTag = (t: string) =>
        set(
            "tags",
            (form.tags ?? []).filter((x) => x !== t)
        );

    const handleSave = () => {
        const title = form.title.trim();
        if (!title) {
            setTitleError(true);
            return;
        }
        const org = form.org.trim();
        const sectors = sectorsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const open = form.open;
        const record: Opportunity = {
            ...form,
            title,
            org,
            sectors,
            deadlineLabel: form.deadline ? formatDeadlineLabel(form.deadline) : "",
            logo: initials(org || title),
            // A featured listing must be open.
            featured: form.featured && open,
        };
        onSubmit(record, isEdit ? "edit" : "create");
    };

    const paletteOutline = useMemo(() => form.c1, [form.c1]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-[620px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-display text-[19px] font-extrabold">
                        {isEdit ? "Edit opportunity" : "Post a new opportunity"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <Field className="sm:col-span-2" label="Title">
                        <Input
                            className={cn(inputClass, titleError && "border-destructive")}
                            value={form.title}
                            onChange={(e) => {
                                set("title", e.target.value);
                                if (titleError) setTitleError(false);
                            }}
                            placeholder="e.g. Tony Elumelu Entrepreneurship Programme"
                        />
                    </Field>

                    <Field label="Organisation">
                        <Input
                            className={inputClass}
                            value={form.org}
                            onChange={(e) => set("org", e.target.value)}
                            placeholder="e.g. Tony Elumelu Foundation"
                        />
                    </Field>

                    <Field label="Type">
                        <NativeSelect
                            value={form.type}
                            onChange={(v) => set("type", v as OpportunityType)}
                        >
                            {OPPORTUNITY_TYPE_ORDER.map((t) => (
                                <option key={t} value={t}>
                                    {OPPORTUNITY_TYPES[t].label}
                                </option>
                            ))}
                        </NativeSelect>
                    </Field>

                    <Field label="Funding / amount">
                        <Input
                            className={inputClass}
                            value={form.amount}
                            onChange={(e) => set("amount", e.target.value)}
                            placeholder="e.g. $5,000 seed capital"
                        />
                    </Field>

                    <Field label="Application deadline">
                        <Input
                            type="date"
                            className={inputClass}
                            value={form.deadline}
                            onChange={(e) => set("deadline", e.target.value)}
                        />
                    </Field>

                    <Field label="Location">
                        <Input
                            className={inputClass}
                            value={form.location}
                            onChange={(e) => set("location", e.target.value)}
                            placeholder="e.g. Freetown · Hybrid"
                        />
                    </Field>

                    <Field label="Stage">
                        <Input
                            className={inputClass}
                            value={form.stage}
                            onChange={(e) => set("stage", e.target.value)}
                            placeholder="e.g. Idea – Early"
                        />
                    </Field>

                    <Field
                        label="Sectors"
                        hint="(comma-separated)"
                        className="sm:col-span-2"
                    >
                        <Input
                            className={inputClass}
                            value={sectorsText}
                            onChange={(e) => setSectorsText(e.target.value)}
                            placeholder="e.g. Agriculture, ICT"
                        />
                    </Field>

                    <Field label="Selection" hint="(optional)" className="sm:col-span-2">
                        <Input
                            className={inputClass}
                            value={form.spots}
                            onChange={(e) => set("spots", e.target.value)}
                            placeholder="e.g. 40 fellows"
                        />
                    </Field>

                    <Field label="Summary" className="sm:col-span-2">
                        <Textarea
                            value={form.summary}
                            onChange={(e) => set("summary", e.target.value)}
                            placeholder="A short description of the opportunity…"
                            className="min-h-[76px] text-sm"
                        />
                    </Field>

                    <Field
                        label="What applicants get"
                        hint="(tags — type & Enter)"
                        className="sm:col-span-2"
                    >
                        <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-input p-2 focus-within:ring-2 focus-within:ring-ring">
                            {(form.tags ?? []).map((t) => (
                                <span
                                    key={t}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 font-display text-[12.5px] font-semibold text-primary-700"
                                >
                                    {t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="text-primary-700/70 hover:text-primary-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        addTag();
                                    } else if (
                                        e.key === "Backspace" &&
                                        !tagInput &&
                                        (form.tags ?? []).length
                                    ) {
                                        const tags = form.tags ?? [];
                                        removeTag(tags[tags.length - 1]);
                                    }
                                }}
                                placeholder="e.g. Mentorship"
                                className="min-w-[110px] flex-1 bg-transparent px-1 py-1 text-[13.5px] outline-none"
                            />
                        </div>
                    </Field>

                    <Field label="Accent colour" className="sm:col-span-2">
                        <div className="flex flex-wrap gap-2">
                            {OPPORTUNITY_PALETTE.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => set("c1", c)}
                                    className="h-[30px] w-[30px] rounded-lg"
                                    style={{
                                        background: c,
                                        outline:
                                            paletteOutline === c
                                                ? "3px solid hsl(var(--color-primary-200))"
                                                : "none",
                                        outlineOffset: "2px",
                                    }}
                                    aria-label={`Accent ${c}`}
                                />
                            ))}
                        </div>
                    </Field>

                    <div className="flex flex-wrap gap-6 sm:col-span-2">
                        <Toggle
                            checked={form.open}
                            onChange={(v) => set("open", v)}
                            label="Open for applications"
                        />
                        <Toggle
                            checked={form.featured}
                            onChange={(v) => set("featured", v)}
                            label="Feature on Opportunities page"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-2 sm:justify-between">
                    {isEdit ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive sm:mr-auto"
                            onClick={() => onDelete(form.id)}
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                    ) : (
                        <span className="hidden sm:block" />
                    )}
                    <div className="flex gap-2.5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            {isEdit ? "Save changes" : "Post opportunity"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    hint,
    className,
    children,
}: {
    label: string;
    hint?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <label className={cn("block", className)}>
            <span className={labelClass}>
                {label}{" "}
                {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
            </span>
            {children}
        </label>
    );
}

function NativeSelect({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-full cursor-pointer rounded-[10px] border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {children}
        </select>
    );
}

function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-2.5">
            <Switch checked={checked} onCheckedChange={onChange} />
            <span className="font-display text-[13.5px] font-semibold text-foreground">
                {label}
            </span>
        </label>
    );
}
