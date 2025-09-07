'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import {Logo} from "@/components/logo";
import {AfterSubmitForgot} from "@/app/forgot-password/_components/AfterSubmitForgot";
import ForgotPasswordForm from "@/app/forgot-password/_components/ForgotPasswordForm";
import {RightHero} from "@/components/auth/RightHero";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitted = (isSubmit: boolean, userEmail: string) => {
        setIsSubmitted(isSubmit)
        setEmail(userEmail)
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Login Form */}
            <div
                className="w-full md:w-1/2 flex flex-col justify-between bg-white dark:bg-zinc-900 px-6 py-8 md:py-0 md:px-16 min-h-screen">
                {isSubmitted ? (
                    <AfterSubmitForgot email={email} setIsSubmitted={setIsSubmitted} />
                ) : (
                    <ForgotPasswordForm setIsSubmittedAction={handleSubmitted} />
                )}
            </div>
            {/* Right: Hero */}
            <RightHero />
        </div>
    );
}