'use client'

import React, { useState } from 'react';
import { AfterSubmitForgot } from "@/app/web/forgot-password/_components/AfterSubmitForgot";
import ForgotPasswordForm from "@/app/web/forgot-password/_components/ForgotPasswordForm";
import { KeyRound, Sparkles, Shield, Mail } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    { icon: Mail, text: "Secure email verification" },
    { icon: Shield, text: "Protected account recovery" },
    { icon: Sparkles, text: "Quick and easy process" },
];

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitted = (isSubmit: boolean, userEmail: string) => {
        setIsSubmitted(isSubmit);
        setEmail(userEmail);
    };

    return (
        <div className="flex flex-1">
            {/* Left: Form Section */}
            <div className="relative flex w-full flex-col items-center justify-center px-4 py-24 sm:px-6 lg:w-1/2 lg:px-12 lg:py-32">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background" />
                <div className="absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

                <div className="w-full max-w-md">
                    {isSubmitted ? (
                        <AfterSubmitForgot email={email} setIsSubmitted={setIsSubmitted} />
                    ) : (
                        <ForgotPasswordForm setIsSubmittedAction={handleSubmitted} />
                    )}
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[hsl(160_84%_39%)] via-[hsl(160_84%_30%)] to-[hsl(160_70%_22%)] lg:flex">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="forgot-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#forgot-grid)" />
                    </svg>
                </div>

                {/* Floating Shapes */}
                <div className="absolute left-20 top-20 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl" />
                <div
                    className="absolute bottom-40 right-20 h-48 w-48 animate-pulse rounded-full bg-white/10 blur-3xl"
                    style={{ animationDelay: '1s' }}
                />
                <div
                    className="absolute left-1/3 top-1/2 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-xl"
                    style={{ animationDelay: '2s' }}
                />

                {/* Content */}
                <div className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-lg space-y-8"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <KeyRound className="h-8 w-8" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-semibold [font-family:var(--font-display)] xl:text-4xl">
                            Don&rsquo;t Worry, We&rsquo;ve Got You Covered
                        </h2>

                        <p className="text-lg text-white/80">
                            Account security is our priority. We&rsquo;ll help you get back into your account safely
                            and securely.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 text-left">
                            {features.map((feature, index) => (
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