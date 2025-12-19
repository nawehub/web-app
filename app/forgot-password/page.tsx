'use client'

import React, { useState } from 'react';
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {AfterSubmitForgot} from "@/app/forgot-password/_components/AfterSubmitForgot";
import ForgotPasswordForm from "@/app/forgot-password/_components/ForgotPasswordForm";
import {KeyRound, Sparkles, Shield, Mail} from "lucide-react";
import {motion} from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitted = (isSubmit: boolean, userEmail: string) => {
        setIsSubmitted(isSubmit)
        setEmail(userEmail)
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />
            
            <main className="flex-1 flex">
                {/* Left: Form Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
                    {/* Background Elements */}
                    <div className="fixed inset-0 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950/10 -z-10 lg:w-1/2" />
                    <div className="fixed top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl -z-10" />

                    <div className="w-full max-w-md">
                        {isSubmitted ? (
                            <AfterSubmitForgot email={email} setIsSubmitted={setIsSubmitted} />
                        ) : (
                            <ForgotPasswordForm setIsSubmittedAction={handleSubmitted} />
                        )}
                    </div>
                </div>

                {/* Right: Visual Section */}
                <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="forgot-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#forgot-grid)" />
                        </svg>
                    </div>

                    {/* Floating Shapes */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white text-center">
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.2}}
                            className="space-y-8 max-w-lg"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                            </div>
                            
                            <h2 className="text-3xl xl:text-4xl font-bold">
                                Don't Worry, We've Got You Covered
                            </h2>
                            
                            <p className="text-lg text-white/80">
                                Account security is our priority. We'll help you get back into your account safely and securely.
                            </p>

                            {/* Features */}
                            <div className="space-y-4 text-left">
                                {[
                                    { icon: Mail, text: "Secure email verification" },
                                    { icon: Shield, text: "Protected account recovery" },
                                    { icon: Sparkles, text: "Quick and easy process" },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.3, delay: 0.4 + index * 0.1}}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <feature.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-white/90">{feature.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
