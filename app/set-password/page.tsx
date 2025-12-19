'use client';

import React, {useState, useEffect, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from 'sonner';
import {ArrowLeft, Key, Eye, EyeOff, Check, X, Lock, Shield, Sparkles} from 'lucide-react';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {useAuth} from "@/hooks/context/AuthContext";
import {useSetPasswordMutation} from "@/hooks/repository/use-auth";
import { signIn } from 'next-auth/react';
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";

export default function SetPasswordPage() {
    const [password, setPasswordValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {token, setAuthData, user} = useAuth();
    const createPassword = useSetPasswordMutation();

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
    }, [router, token]);

    const passwordRules = [
        {rule: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8},
        {rule: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd)},
        {rule: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd)},
        {rule: 'Contains number', test: (pwd: string) => /\d/.test(pwd)},
        {rule: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)},
    ];

    const isPasswordValid = passwordRules.every(rule => rule.test(password));
    const doPasswordsMatch = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast('Invalid password', {
                description: 'Please ensure your password meets all requirements.',
            });
            return;
        }

        if (!doPasswordsMatch) {
            toast('Passwords do not match', {
                description: 'Please ensure both passwords are identical.',
            });
            return;
        }

        startTransition(async () => {
            try {
                const response = await createPassword.mutateAsync({
                    accessToken: token ? token : '',
                    newPassword: password,
                    confirmPassword: confirmPassword,
                });
                
                const result = await signIn('credentials', {
                    email: user?.email || '',
                    password: password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                toast('Password created successfully', {
                    description: 'Your account is now ready. Please sign in.',
                });
                setAuthData(response.accessToken, response.refreshToken, response.user);
                router.push('/dashboard');
            } catch (error) {
                toast('Password setup failed', {
                    description: 'Please try again or contact support.',
                });
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />
            
            <main className="flex-1 flex">
                {/* Left: Form Section */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-24 lg:py-32">
                    {/* Background Elements */}
                    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/10 -z-10 lg:w-1/2" />
                    <div className="fixed top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl -z-10" />

                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <motion.div 
                            initial={{opacity: 0, y: 12}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{duration: 0.3}}
                            className="text-center space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <Key className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Final Step
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                Create Your Password
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Set a secure password for your account
                                <br />
                                <span className="font-medium text-zinc-900 dark:text-white">{user?.email}</span>
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
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPasswordValue(e.target.value)}
                                                    placeholder="Enter your password"
                                                    className="pl-11 pr-11 h-12 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                Confirm Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm your password"
                                                    className="pl-11 pr-11 h-12 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Password Requirements */}
                                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 space-y-2">
                                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password Requirements</Label>
                                            <div className="space-y-1.5">
                                                {passwordRules.map((rule, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        {rule.test(password) ? (
                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400"/>
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                                                <X className="h-3 w-3 text-zinc-400"/>
                                                            </div>
                                                        )}
                                                        <span className={rule.test(password) ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}>
                                                            {rule.rule}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Password Match Indicator */}
                                        {confirmPassword.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                {doPasswordsMatch ? (
                                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 w-full">
                                                        <Check className="h-4 w-4 text-emerald-500"/>
                                                        <span className="text-emerald-600 dark:text-emerald-400">Passwords match</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 w-full">
                                                        <X className="h-4 w-4 text-red-500"/>
                                                        <span className="text-red-600 dark:text-red-400">Passwords do not match</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isPending || !isPasswordValid || !doPasswordsMatch}
                                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
                                        >
                                            {isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Creating password...
                                                </span>
                                            ) : (
                                                'Create Password'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-center pb-6">
                                    <Link href="/verify-otp" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        <ArrowLeft className="h-4 w-4"/>
                                        Back to verification
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Visual Section */}
                <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="password-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#password-grid)" />
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
                                <Key className="w-10 h-10" />
                            </div>
                            
                            <h2 className="text-3xl xl:text-4xl font-bold">
                                You're Almost Done!
                            </h2>
                            
                            <p className="text-lg text-white/80">
                                Create a secure password to protect your account and unlock all the features of NaWeHub.
                            </p>

                            <div className="space-y-4 text-left">
                                {[
                                    { icon: Shield, text: "Enterprise-grade security" },
                                    { icon: Lock, text: "Encrypted data protection" },
                                    { icon: Sparkles, text: "Access to all platform features" },
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
