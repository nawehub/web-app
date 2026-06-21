"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CreditCard, ScanFace, UploadCloud } from "lucide-react";
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
import { VerificationKey } from "../_data/profile";

export interface VerifyTarget {
    key: VerificationKey;
    label: string;
    kind: "doc" | "selfie" | "code";
    value?: string;
    status: "verified" | "review" | "none";
}

interface VerifyDialogProps {
    target: VerifyTarget | null;
    onCloseAction: () => void;
    onCompleteAction: (key: VerificationKey, status: "review" | "verified") => void;
}

interface FlowProps {
    target: VerifyTarget;
    onClose: () => void;
    onComplete: (key: VerificationKey, status: "review" | "verified") => void;
}

export function VerifyDialog({ target, onCloseAction, onCompleteAction }: VerifyDialogProps) {
    if (!target) return null;
    return (
        <Dialog open={!!target} onOpenChange={(o) => !o && onCloseAction()}>
            <DialogContent className="top-[7vh] max-h-[86vh] translate-y-0 overflow-y-auto sm:max-w-lg">
                {target.kind === "doc" && (
                    <DocFlow target={target} onClose={onCloseAction} onComplete={onCompleteAction} />
                )}
                {target.kind === "selfie" && (
                    <SelfieFlow target={target} onClose={onCloseAction} onComplete={onCompleteAction} />
                )}
                {target.kind === "code" && (
                    <CodeFlow target={target} onClose={onCloseAction} onComplete={onCompleteAction} />
                )}
            </DialogContent>
        </Dialog>
    );
}

/* ---------- Document upload  ---------- */
function DocFlow({ target, onClose, onComplete }: FlowProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const isNID = target.label === "National ID";

    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-display">
                    {target.status === "none" ? "Upload" : "Replace"} {target.label}
                </DialogTitle>
                <DialogDescription>
                    Encrypted on upload. Only NaWeHub&apos;s vetting team can view it — never shown on
                    your public profile.
                </DialogDescription>
            </DialogHeader>

            <div className="py-2">
                {/* Hidden native input — the dropzone triggers it to open the file window */}
                <input
                    ref={inputRef}
                    type="file"
                    multiple={isNID}
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex w-full items-center gap-3.5 rounded-xl border border-dashed p-4 text-left transition-colors",
                        files.length
                            ? "border-primary-200 bg-primary-50"
                            : "hover:border-primary-500 hover:bg-primary-50"
                    )}
                >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-700">
                        <UploadCloud className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                        <span className="block font-display text-sm font-semibold">
                            Drop or browse your {target.label.toLowerCase()}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            JPG, PNG or PDF · up to 10 MB
                        </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-display text-[13px] font-bold text-primary-600">
                        {files.length ? (
                            <>
                                <Check className="h-4 w-4" />
                                {files.length} file{files.length > 1 ? "s" : ""} selected
                            </>
                        ) : (
                            "Choose file"
                        )}
                    </span>
                </button>

                {files.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                        {files.map((f, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-[13px] text-neutral-700"
                            >
                                <CreditCard className="h-3.5 w-3.5 shrink-0 text-primary-600" />
                                <span className="truncate">{f.name}</span>
                                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                    {(f.size / 1024).toFixed(0)} KB
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                <p className="mt-3 text-xs text-muted-foreground">
                    {isNID
                        ? "Upload clear photos of both the front and back."
                        : "A clear photo or scan works best."}
                </p>
            </div>

            <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    disabled={files.length === 0}
                    onClick={() => onComplete(target.key, "review")}
                >
                    Submit for verification
                </Button>
            </DialogFooter>
        </>
    );
}

/* ---------- Selfie ---------- */
function SelfieFlow({ target, onClose, onComplete }: FlowProps) {
    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-display">Selfie Verification</DialogTitle>
                <DialogDescription>
                    We match a quick selfie to your ID photo to confirm it&apos;s you. Private to
                    NaWeHub.
                </DialogDescription>
            </DialogHeader>

            <div className="py-2">
                <div className="relative grid h-56 place-items-center overflow-hidden rounded-xl bg-neutral-900 text-center text-white/70">
                    <span className="absolute h-36 w-32 rounded-full border-2 border-dashed border-white/40" />
                    <span className="z-10 flex flex-col items-center gap-1.5 font-display text-[13px] font-semibold">
                        <ScanFace className="h-7 w-7" />
                        Position your face in the circle
                    </span>
                </div>
            </div>

            <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={() => onComplete(target.key, "review")}>
                    Capture &amp; submit
                </Button>
            </DialogFooter>
        </>
    );
}

/* ---------- Code (email / phone) ---------- */
function CodeFlow({ target, onClose, onComplete }: FlowProps) {
    const [sent, setSent] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        setSent(false);
        setCode("");
        setError(false);
    }, [target.key]);

    const submit = () => {
        if (!sent) {
            setSent(true);
            return;
        }
        if (code === "123456" || code.trim().length >= 4) {
            onComplete(target.key, "verified");
        } else {
            setError(true);
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="font-display">
                    Verify your {target.label.toLowerCase()}
                </DialogTitle>
                <DialogDescription>
                    We&apos;ll send a 6-digit code to <strong>{target.value}</strong>.
                </DialogDescription>
            </DialogHeader>

            <div className="py-2">
                {!sent ? (
                    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                            <Check className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11.5px] text-muted-foreground">{target.label}</div>
                            <div className="truncate font-display text-[13.5px] font-semibold">
                                {target.value}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <Label>Enter the code</Label>
                        <Input
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="••••••"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError(false);
                            }}
                            className={cn(
                                "text-center text-lg tracking-[0.4em]",
                                error && "border-destructive"
                            )}
                        />
                        <p className="text-xs text-muted-foreground">
                            Demo code: <strong>123456</strong>
                        </p>
                    </div>
                )}
            </div>

            <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="button" onClick={submit}>
                    {sent ? "Verify" : "Send code"}
                </Button>
            </DialogFooter>
        </>
    );
}
