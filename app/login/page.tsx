"use client";

import React, {useState, useEffect} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Shield, CheckCircle} from "lucide-react";
import Loading from "@/components/loading";
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";

export default function Login() {
    const {status} = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const callbackUrl = searchParams.get('from') || '/dashboard';

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return <Loading />
    }
    if (status === "authenticated") {
        return null;
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                console.log({result})
                setError("Invalid sign-in credentials. Please try again.");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />
            
            <main className="flex-1 flex items-center justify-center px-4 py-20 lg:py-32">
                {/* Background Elements */}
                <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/10 -z-10" />
                <div className="fixed top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl -z-10" />
                <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl -z-10" />

                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                Welcome Back
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                            Sign in to your account
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Access your dashboard and manage your business
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-8">
                        <form onSubmit={onSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Email or Username
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Enter your email or username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-base placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 pl-12 pr-12 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-base placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <Link 
                                    href="/forgot-password" 
                                    className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-zinc-900 text-zinc-500">
                                    New to NaWeHub?
                                </span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <Link href="/register" className="block">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-12 border-2 border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 rounded-xl font-semibold transition-all duration-300"
                            >
                                Create an Account
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>Secure Login</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Encrypted Data</span>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2">
                        <p>
                            This site is protected by reCAPTCHA Enterprise
                        </p>
                        <p>
                            <Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                Privacy Policy
                            </Link>
                            {" · "}
                            <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                Terms of Service
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
