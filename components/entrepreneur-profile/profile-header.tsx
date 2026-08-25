"use client";

import { Camera, Check, Flag, MapPin, Pencil, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    EntrepreneurProfile,
    VerificationKey,
    initials,
} from "@/types/entrepreneur-profile";

interface ProfileHeaderProps {
    profile: EntrepreneurProfile;
    onEdit?: () => void;
    onPickPhoto?: () => void;
}

export function ProfileHeader({ profile, onEdit, onPickPhoto }: ProfileHeaderProps) {
    const isVerified = (k: VerificationKey) => profile.verification[k]?.status === "verified";
    const score = Math.max(0, Math.min(100, profile.entrepreneurScore));

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            {/* Cover */}
            <div className="relative h-28 bg-gradient-to-br from-primary-700 via-primary-500 to-primary-400">
                <div
                    className="absolute inset-0 opacity-15"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 18px)",
                    }}
                />
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        title="Edit profile"
                        aria-label="Edit profile"
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-neutral-700 shadow-sm transition-colors hover:text-primary-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="relative px-5 pb-6 sm:px-7">
                <div className="-mt-[52px] flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    {/* Avatar */}
                    <div className="relative w-fit">
                        <Avatar className="h-28 w-28 border-4 border-card shadow-md">
                            {profile.photo ? <AvatarImage src={profile.photo} alt={profile.name} /> : null}
                            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-4xl font-bold font-display text-white">
                                {initials(profile.name)}
                            </AvatarFallback>
                        </Avatar>
                        {(onPickPhoto || onEdit) && (
                            <button
                                type="button"
                                onClick={() => (onPickPhoto ? onPickPhoto() : onEdit?.())}
                                title="Change photo"
                                aria-label="Change photo"
                                className="absolute bottom-1.5 right-0.5 grid h-9 w-9 place-items-center rounded-full border bg-card text-neutral-700 shadow-sm transition-colors hover:border-primary-100 hover:text-primary-600"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Score ring */}
                    <div className="flex items-center gap-3 pb-1">
                        <div
                            className="grid h-16 w-16 place-items-center rounded-full"
                            style={{
                                background: `conic-gradient(hsl(var(--primary)) ${score}%, hsl(var(--color-primary-100)) 0)`,
                            }}
                        >
                            <span className="grid h-[50px] w-[50px] place-items-center rounded-full bg-card font-display text-lg font-extrabold text-primary-700">
                                {score}
                            </span>
                        </div>
                        <div className="text-[11px] leading-tight text-muted-foreground">
                            <b className="block font-display text-[13px] text-foreground">
                                Entrepreneur Score
                            </b>
                            {profile.rating}
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-extrabold font-display tracking-tight sm:text-[27px]">
                        {profile.name}
                    </h1>
                    {profile.pronouns && (
                        <span className="text-[13px] font-semibold text-muted-foreground">
                            {profile.pronouns}
                        </span>
                    )}
                </div>

                <p className="mt-1.5 max-w-[620px] text-[15px] leading-relaxed text-neutral-700">
                    {profile.headline}
                </p>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location || profile.district}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Flag className="h-3.5 w-3.5" />
                        {profile.nationality}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {profile.gender}
                    </span>
                </div>

                {/* Verification chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <VerifChip on={isVerified("national_id")} label="Identity Verified" />
                    <VerifChip on={isVerified("email")} label="Email Verified" />
                    <VerifChip on={isVerified("phone")} label="Phone Verified" />
                    <VerifChip on={isVerified("selfie")} label="Selfie Verification" />
                </div>
            </div>
        </div>
    );
}

function VerifChip({ on, label }: { on: boolean; label: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-display text-xs font-semibold",
                on ? "bg-primary-50 text-primary-700" : "bg-muted text-muted-foreground"
            )}
        >
            {on ? (
                <Check className="h-3.5 w-3.5" />
            ) : (
                <Plus className="h-3.5 w-3.5 opacity-60" />
            )}
            {label}
        </span>
    );
}
