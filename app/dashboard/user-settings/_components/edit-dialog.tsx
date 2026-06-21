"use client";

import { useEffect, useId, useRef, useState, KeyboardEvent } from "react";
import { ImageIcon, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { revokePreview, uploadPhoto } from "../_data/photo";

export type FieldType =
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "select"
    | "tags"
    | "pills"
    | "pillsmulti"
    | "photo";

export interface Field {
    key: string;
    label: string;
    type?: FieldType;
    options?: string[];
    full?: boolean;
    placeholder?: string;
    rows?: number;
    /** Block save with "Required" if the value is empty. */
    required?: boolean;
    /** Return an error message for an invalid value, or null when valid. */
    validate?: (value: unknown) => string | null;
}

function isEmpty(value: unknown): boolean {
    if (value == null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    return false;
}

/** Validate one field's value; returns an error message or null. */
function validateField(field: Field, value: unknown): string | null {
    if (field.required && isEmpty(value)) return "This field is required.";
    // Don't run format checks on an empty optional field.
    if (isEmpty(value)) return null;
    return field.validate?.(value) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValues = Record<string, any>;

export interface EditDialogConfig {
    title: string;
    description?: string;
    fields: Field[];
    values: FormValues;
    onSave: (values: FormValues) => void;
    onDelete?: () => void;
    deleteLabel?: string;
}

interface EditDialogProps {
    config: EditDialogConfig | null;
    onCloseAction: () => void;
}

/**
 * Schema-driven editor used by every profile section. Holds its own draft
 * state so edits are only committed on Save (mirrors the design's modal).
 */
export function EditDialog({ config, onCloseAction }: EditDialogProps) {
    const [draft, setDraft] = useState<FormValues>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showErrors, setShowErrors] = useState(false);
    const fieldIdPrefix = useId();

    useEffect(() => {
        if (config) {
            setDraft({ ...config.values });
            setErrors({});
            setShowErrors(false);
        }
    }, [config]);

    if (!config) return null;

    const validateAll = (values: FormValues): Record<string, string> => {
        const next: Record<string, string> = {};
        for (const f of config.fields) {
            const msg = validateField(f, values[f.key]);
            if (msg) next[f.key] = msg;
        }
        return next;
    };

    const set = (key: string, value: unknown) =>
        setDraft((d) => {
            const nextDraft = { ...d, [key]: value };
            // Once the user has tried to save, re-validate live so errors clear as they type.
            if (showErrors) setErrors(validateAll(nextDraft));
            return nextDraft;
        });

    // Number fields are allowed to hold "" in the draft for nicer typing;
    // coerce them back to numbers before handing values to the caller.
    const normalize = (values: FormValues): FormValues => {
        const out: FormValues = { ...values };
        for (const f of config.fields) {
            if (f.type === "number") out[f.key] = Math.max(0, Number(out[f.key]) || 0);
        }
        return out;
    };

    const handleSave = () => {
        const found = validateAll(draft);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            setShowErrors(true);
            return;
        }
        // The committed value replaces the old one — free the previous preview.
        for (const f of config.fields) {
            if (f.type === "photo" && draft[f.key] !== config.values[f.key]) {
                revokePreview(config.values[f.key]);
            }
        }
        config.onSave(normalize(draft));
        onCloseAction();
    };

    // Cancel / dismiss: discard any preview created in this dialog that was never saved.
    const handleDismiss = () => {
        for (const f of config.fields) {
            if (f.type === "photo" && draft[f.key] !== config.values[f.key]) {
                revokePreview(draft[f.key]);
            }
        }
        onCloseAction();
    };

    const handleDelete = () => {
        config.onDelete?.();
        onCloseAction();
    };

    return (
        <Dialog open={!!config} onOpenChange={(o) => !o && handleDismiss()}>
            <DialogContent className="top-[54%] max-h-[80vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-display">{config.title}</DialogTitle>
                    {config.description && (
                        <DialogDescription>{config.description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="grid gap-4 py-2 sm:grid-cols-2">
                    {config.fields.map((f) => (
                        <FieldControl
                            key={f.key}
                            id={`${fieldIdPrefix}-${f.key}`}
                            field={f}
                            value={draft[f.key]}
                            error={showErrors ? errors[f.key] : undefined}
                            onChange={(v) => set(f.key, v)}
                        />
                    ))}
                </div>

                <DialogFooter className="gap-2 sm:items-center">
                    {config.onDelete && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleDelete}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive sm:mr-auto"
                        >
                            <Trash2 className="h-4 w-4" />
                            {config.deleteLabel ?? "Delete"}
                        </Button>
                    )}
                    <Button type="button" variant="ghost" onClick={handleDismiss}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** Inline error message tied to a field via aria-describedby. */
function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) return null;
    return (
        <p id={id} className="text-xs font-medium text-destructive">
            {message}
        </p>
    );
}

function FieldControl({
    id,
    field,
    value,
    error,
    onChange,
}: {
    id: string;
    field: Field;
    value: unknown;
    error?: string;
    onChange: (v: unknown) => void;
}) {
    const type = field.type ?? "text";
    const wrap = field.full ? "sm:col-span-2" : "";
    const fileRef = useRef<HTMLInputElement>(null);
    // The value the field opened with — never revoke it (the parent may still display it).
    const photoOriginalRef = useRef(value);
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    const describedBy = error ? errorId : undefined;
    const invalid = error ? true : undefined;

    if (type === "photo") {
        const url = (value as string) ?? "";
        // Revoke a preview we created earlier in this dialog (but never the original).
        const dropPreview = (candidate: unknown) => {
            if (candidate !== photoOriginalRef.current) revokePreview(candidate as string);
        };
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label id={labelId}>{field.label}</Label>
                <div
                    role="group"
                    aria-labelledby={labelId}
                    className="flex items-center gap-4 rounded-xl border bg-muted/40 p-3.5"
                >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-background">
                        {url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <span className="grid h-full w-full place-items-center text-muted-foreground">
                                <ImageIcon className="h-7 w-7" />
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                e.target.value = "";
                                if (!file) return;
                                const replacing = value;
                                const next = await uploadPhoto(file);
                                dropPreview(replacing);
                                onChange(next);
                            }}
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                {url ? "Replace photo" : "Upload photo"}
                            </Button>
                            {url && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        dropPreview(value);
                                        onChange("");
                                    }}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            JPG or PNG · a square photo looks best.
                        </p>
                    </div>
                </div>
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label htmlFor={id}>{field.label}</Label>
                <Textarea
                    id={id}
                    rows={field.rows ?? 4}
                    placeholder={field.placeholder}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    value={(value as string) ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                />
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    if (type === "select") {
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label htmlFor={id}>{field.label}</Label>
                <select
                    id={id}
                    value={(value as string) ?? ""}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {(field.options ?? []).map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    if (type === "pills") {
        const selected = (value as string) ?? "";
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label id={labelId}>{field.label}</Label>
                <div
                    role="radiogroup"
                    aria-labelledby={labelId}
                    aria-describedby={describedBy}
                    className="flex flex-wrap gap-2"
                >
                    {(field.options ?? []).map((o) => (
                        <Pill
                            key={o}
                            role="radio"
                            selected={selected === o}
                            onClick={() => onChange(o)}
                        >
                            {o}
                        </Pill>
                    ))}
                </div>
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    if (type === "pillsmulti") {
        const selected = (value as string[]) ?? [];
        const toggle = (o: string) =>
            onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label id={labelId}>{field.label}</Label>
                <div
                    role="group"
                    aria-labelledby={labelId}
                    aria-describedby={describedBy}
                    className="flex flex-wrap gap-2"
                >
                    {(field.options ?? []).map((o) => (
                        <Pill
                            key={o}
                            role="checkbox"
                            selected={selected.includes(o)}
                            onClick={() => toggle(o)}
                        >
                            {o}
                        </Pill>
                    ))}
                </div>
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    if (type === "tags") {
        return (
            <div className={cn("space-y-1.5", wrap)}>
                <Label htmlFor={id}>{field.label}</Label>
                <TagsInput
                    inputId={id}
                    value={(value as string[]) ?? []}
                    placeholder={field.placeholder}
                    invalid={invalid}
                    describedBy={describedBy}
                    onChange={(v) => onChange(v)}
                />
                <FieldError id={errorId} message={error} />
            </div>
        );
    }

    return (
        <div className={cn("space-y-1.5", wrap)}>
            <Label htmlFor={id}>{field.label}</Label>
            <Input
                id={id}
                type={type === "number" ? "number" : type === "date" ? "date" : "text"}
                min={type === "number" ? 0 : undefined}
                placeholder={field.placeholder}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                value={value == null ? "" : (value as string | number)}
                onChange={(e) =>
                    onChange(
                        type === "number"
                            ? e.target.value === ""
                                ? ""
                                : Math.max(0, Number(e.target.value) || 0)
                            : e.target.value
                    )
                }
            />
            <FieldError id={errorId} message={error} />
        </div>
    );
}

function Pill({
    children,
    selected,
    onClick,
    role,
}: {
    children: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    role?: "radio" | "checkbox";
}) {
    return (
        <button
            type="button"
            role={role}
            aria-checked={role ? selected : undefined}
            onClick={onClick}
            className={cn(
                "rounded-full border px-3.5 py-2 font-display text-[13px] font-semibold transition-colors",
                selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-neutral-700 hover:border-primary-500"
            )}
        >
            {children}
        </button>
    );
}

function TagsInput({
    value,
    onChange,
    placeholder,
    inputId,
    invalid,
    describedBy,
}: {
    value: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
    inputId?: string;
    invalid?: boolean;
    describedBy?: string;
}) {
    const [text, setText] = useState("");

    const add = () => {
        const v = text.trim();
        if (v && !value.includes(v)) onChange([...value, v]);
        setText("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
        } else if (e.key === "Backspace" && !text && value.length) {
            onChange(value.slice(0, -1));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            {value.map((t) => (
                <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 font-display text-[13px] font-semibold text-primary-700"
                >
                    {t}
                    <button
                        type="button"
                        onClick={() => onChange(value.filter((x) => x !== t))}
                        className="opacity-60 hover:opacity-100"
                        aria-label={`Remove ${t}`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <input
                id={inputId}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={add}
                placeholder={placeholder ?? "Type and press Enter"}
                className="min-w-[120px] flex-1 border-0 bg-transparent p-1 text-sm outline-none"
            />
        </div>
    );
}
