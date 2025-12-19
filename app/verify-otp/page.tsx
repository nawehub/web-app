'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Sparkles, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {useAuth} from "@/hooks/context/AuthContext";
import {useVerifyOtpMutation} from "@/hooks/repository/use-auth";
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [isPending, startTransition] = useTransition();
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const router = useRouter();
    const { setAuthData } = useAuth();
    const verifyOtp = useVerifyOtpMutation();

    useEffect(() => {
        const pendingUserId = sessionStorage.getItem('registeredUserId');
        const pendingUserEmail = sessionStorage.getItem('registeredUserEmail');
        if (!pendingUserId || !pendingUserEmail) {
            router.push('/register');
            return;
        }
        setEmail(pendingUserEmail)
        setUserId(pendingUserId);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 8) {
            toast('Invalid OTP', {
                description: 'Please enter the complete 8-digit OTP.'
            });
            return;
        }

        startTransition(async () => {
            try {
                const response = await verifyOtp.mutateAsync({
                    userId,
                    otp: otp,
                });
                toast('Email verified successfully', {
                    description: 'Please create your password to complete registration.',
                });
                setAuthData(response.accessToken, response.refreshToken, response.user);
                router.push('/set-password');
            } catch (error) {
                toast('Verification failed', {
                    description: 'Invalid or expired OTP. Please try again.',
                });
            }
        });
    };

    const handleResendOTP = () => {
        toast('OTP Resent', {
            description: 'A new OTP has been sent to your email.',
        });
        setTimeLeft(1800);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />
            
            <main className="flex-1 flex">
                {/* Left: Form Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
                    {/* Background Elements */}
                    <div className="fixed inset-0 bg-gradient-to-br from-violet-50/30 via-white to-purple-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-violet-950/10 -z-10 lg:w-1/2" />
                    <div className="fixed top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl -z-10" />

                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <motion.div 
                            initial={{opacity: 0, y: 12}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{duration: 0.3}}
                            className="text-center space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
                                <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                                    Email Verification
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                Verify Your Email
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                We've sent an 8-digit verification code to
                                <br />
                                <span className="font-medium text-zinc-900 dark:text-white">{email}</span>
                            </p>
                        </motion.div>

                        {/* Card */}
                        <motion.div
                            initial={{opacity: 0, y: 12}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3, delay: 0.1}}
                        >
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                                <CardContent className="p-6 sm:p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-center">
                                                <InputOTP
                                                    maxLength={8}
                                                    value={otp}
                                                    onChange={(value) => setOtp(value)}
                                                    disabled={isPending}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                    </InputOTPGroup>
                                                    <div className="mx-1 sm:mx-2 text-zinc-400">-</div>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={6} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                        <InputOTPSlot index={7} className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-xl border-zinc-200 dark:border-zinc-700" />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                                Enter the 8-digit code sent to your email
                                            </p>
                                        </div>

                                        {/* Timer */}
                                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                                            <Clock className="w-4 h-4 text-zinc-400" />
                                            {timeLeft > 0 ? (
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    Code expires in <span className="font-semibold text-violet-600 dark:text-violet-400">{formatTime(timeLeft)}</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-red-500">
                                                    Code has expired. Please request a new one.
                                                </p>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={isPending || otp.length !== 8}
                                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300"
                                        >
                                            {isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Verifying...
                                                </span>
                                            ) : (
                                                'Verify Email'
                                            )}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Didn't receive the code?{' '}
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
                                                disabled={timeLeft > 1740}
                                            >
                                                Resend OTP
                                            </button>
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center pb-6">
                                    <Link href="/register" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to registration
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Visual Section */}
                <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="verify-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#verify-grid)" />
                        </svg>
                    </div>

                    {/* Floating Shapes */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white text-center">
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: 0.2}}
                            className="space-y-8 max-w-lg"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                                <Mail className="w-10 h-10" />
                            </div>
                            
                            <h2 className="text-3xl xl:text-4xl font-bold">
                                Almost There!
                            </h2>
                            
                            <p className="text-lg text-white/80">
                                Verify your email to complete your registration and unlock access to all NaWeHub features.
                            </p>

                            <div className="space-y-4 text-left">
                                {[
                                    { icon: Shield, text: "Secure verification process" },
                                    { icon: Sparkles, text: "Access to funding opportunities" },
                                    { icon: Mail, text: "Important updates & notifications" },
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
