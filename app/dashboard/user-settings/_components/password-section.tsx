"use client";

import { useState } from "react";
import { KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "../_data/profile";
import { PrivateFlag } from "./section-card";

interface PasswordDraft {
    current: string;
    next: string;
    confirm: string;
}

const EMPTY: PasswordDraft = { current: "", next: "", confirm: "" };

export function PasswordSection() {
    const [draft, setDraft] = useState<PasswordDraft>(EMPTY);
    const [isSaving, setIsSaving] = useState(false);

    const set = (key: keyof PasswordDraft, value: string) =>
        setDraft((d) => ({ ...d, [key]: value }));

    const validate = (): string | null => {
        if (!draft.current) return "Enter your current password.";
        if (draft.next.length < 8) return "New password must be at least 8 characters.";
        if (draft.next === draft.current)
            return "New password must be different from your current one.";
        if (draft.next !== draft.confirm) return "New password and confirmation don't match.";
        return null;
    };

    const handleUpdate = async () => {
        const err = validate();
        if (err) {
            toast("Couldn't update password", { description: err });
            return;
        }
        setIsSaving(true);
        try {
            await changePassword({ current: draft.current, next: draft.next });
            setDraft(EMPTY);
            toast("Password updated", {
                description: "Your password has been changed successfully.",
                duration: 5000,
            });
        } catch {
            toast("Couldn't update password", {
                description: "Something went wrong. Please check your current password and try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
                <h2 className="flex-1 text-lg font-bold font-display tracking-tight">
                    Password &amp; Security
                </h2>
                <PrivateFlag>Only you</PrivateFlag>
            </div>

            <div className="px-5 pb-6 pt-4 sm:px-6">
                <div className="mb-4 flex items-center gap-3.5 rounded-xl border bg-muted/40 p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-100 text-primary-700">
                        <Lock className="h-5 w-5" />
                    </span>
                    <p className="text-[13.5px] text-neutral-700">
                        Use at least 8 characters. Choose something you don&apos;t use elsewhere to
                        keep your account secure.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2 sm:max-w-sm">
                        <Label htmlFor="currentPassword">Current password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            autoComplete="current-password"
                            value={draft.current}
                            onChange={(e) => set("current", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            value={draft.next}
                            onChange={(e) => set("next", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">Confirm new password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={draft.confirm}
                            onChange={(e) => set("confirm", e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <Button type="button" onClick={handleUpdate} disabled={isSaving}>
                        <KeyRound className="h-4 w-4" />
                        {isSaving ? "Updating..." : "Update password"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
