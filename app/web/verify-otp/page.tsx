"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/hooks/repository/use-auth";
import { formatResponse } from "@/utils/format-response";
import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, RotateCw, ShieldCheck, Sparkles } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const visualFeatures = [
    { icon: ShieldCheck, text: "Confirms it's really you" },
    { icon: Mail, text: "Code sent straight to your inbox" },
    { icon: Sparkles, text: "Takes less than a minute" },
];

function OtpInput({
                      value,
                      onChange,
                      onComplete,
                      disabled,
                  }: {
    value: string[];
    onChange: (next: string[]) => void;
    onComplete: (code: string) => void;
    disabled?: boolean;
}) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const setDigit = (index: number, digit: string) => {
        const next = [...value];
        next[index] = digit;
        onChange(next);

        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        if (next.every((d) => d !== "")) {
            onComplete(next.join(""));
        }
    };

    const handleChange = (index: number, raw: string) => {
        const digit = raw.replace(/\D/g, "").slice(-1);
        setDigit(index, digit);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
        onChange(next);
        const lastFilled = Math.min(pasted.length, OTP_LENGTH) - 1;
        inputRefs.current[lastFilled]?.focus();
        if (pasted.length === OTP_LENGTH) {
            onComplete(pasted);
        }
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {value.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    disabled={disabled}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-12 w-10 rounded-xl border border-input bg-background text-center text-xl font-semibold [font-family:var(--font-mono)] text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:h-14 sm:w-12"
                />
            ))}
        </div>
    );
}

export default function VerifyOtpPage() {
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    const verifyMutation = useVerifyOtpMutation();
    const resendMutation = useResendOtpMutation();

    useEffect(() => {
        const storedId = sessionStorage.getItem("registeredUserId");
        const storedEmail = sessionStorage.getItem("registeredUserEmail");
        if (!storedId || !email) {
            router.replace("/web/login");
            return;
        }
        setUserId(storedId);
        setEmail(storedEmail);
    }, [router]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async (code: string) => {
        if (!userId || code.length !== OTP_LENGTH) return;
        setError("");
        setIsVerifying(true);
        try {
            const response = await verifyMutation.mutateAsync({ userId, otp: code });
            toast("Account verified", {
                description: response?.message ?? "You can now sign in to your account.",
                duration: 5000,
            });
            sessionStorage.removeItem("registeredUserId");
            sessionStorage.removeItem("registeredUserEmail");
            router.push("/web/login");
        } catch (err: any) {
            const msg = err?.message ? formatResponse(err.message) : "Invalid or expired code";
            setError(msg);
            setDigits(Array(OTP_LENGTH).fill(""));
            toast("Verification failed", { description: msg, duration: 5000 });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!email || cooldown > 0) return;
        setIsResending(true);
        try {
            const response = await resendMutation.mutateAsync({ email });
            toast("Code resent", {
                description: response?.message ?? `A new code was sent to ${email}.`,
                duration: 5000,
            });
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setDigits(Array(OTP_LENGTH).fill(""));
            setError("");
        } catch (err: any) {
            const msg = err?.message ? formatResponse(err.message) : "Couldn't resend the code";
            toast("Resend failed", { description: msg, duration: 5000 });
        } finally {
            setIsResending(false);
        }
    };

    const isComplete = digits.every((d) => d !== "");

    if (!userId || !email) {
        return null;
    }

    return (
        <div className="flex flex-1">
            {/* Left: Form Section */}
            <div className="relative flex w-full flex-col items-center justify-center px-4 py-24 sm:px-6 lg:w-1/2 lg:px-12 lg:py-32">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background" />
                <div className="absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                            <KeyRound className="h-7 w-7" />
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                            Verify your email
                        </h1>
                        <p className="text-muted-foreground">
                            Enter the {OTP_LENGTH}-digit code we sent to{" "}
                            <span className="font-medium text-foreground">{email}</span>
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lg)] sm:p-8">
                        <div className="space-y-6">
                            <OtpInput
                                value={digits}
                                onChange={setDigits}
                                onComplete={handleVerify}
                                disabled={isVerifying}
                            />

                            {error && (
                                <div className="rounded-xl border border-[hsl(var(--color-error))]/30 bg-[hsl(var(--color-error))]/5 p-4 text-center">
                                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                                </div>
                            )}

                            <Button
                                type="button"
                                disabled={!isComplete || isVerifying}
                                onClick={() => handleVerify(digits.join(""))}
                                className="h-12 w-full bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[var(--shadow-lg)]"
                            >
                                {isVerifying ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify account"
                                )}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                {cooldown > 0 ? (
                                    <span>Didn&rsquo;t get a code? Resend in {cooldown}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={isResending}
                                        className="inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
                                    >
                                        <RotateCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                                        {isResending ? "Resending..." : "Resend code"}
                                    </button>
                                )}
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/web/register"
                                    className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Wrong email? Go back
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right: Visual Section */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[hsl(160_84%_39%)] via-[hsl(160_84%_30%)] to-[hsl(160_70%_22%)] lg:flex">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="otp-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#otp-grid)" />
                    </svg>
                </div>

                <div className="absolute left-20 top-20 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl" />
                <div
                    className="absolute bottom-40 right-20 h-48 w-48 animate-pulse rounded-full bg-white/10 blur-3xl"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute left-1/3 top-1/2 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-xl"
                    style={{ animationDelay: "2s" }}
                />

                <div className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-lg space-y-8"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-semibold [font-family:var(--font-display)] xl:text-4xl">
                            One Last Step to Get Started
                        </h2>

                        <p className="text-lg text-white/80">
                            Verifying your email keeps your account secure and makes sure you never miss an update.
                        </p>

                        <div className="space-y-4 text-left">
                            {visualFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <feature.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-white/90">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}