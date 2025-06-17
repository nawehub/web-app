"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from "react-icons/fa";
import { HiOutlineMail, HiOutlineKey } from "react-icons/hi";
import { useSession } from "next-auth/react";

export default function Register() {
    const { status } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }
    if (status === "authenticated") {
        return null;
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            router.push("/login?registered=true");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Signup Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between bg-white dark:bg-zinc-900 px-6 py-8 md:py-0 md:px-16 min-h-screen">
                {/* Logo */}
                <div className="items-center h-16 mb-8 pt-5">
                    <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-10 w-auto mr-2" />
                    <span className="font-light text-xs -mt-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
                </div>
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white text-center">Create a YourApp account</h2>
                    {/* SSO Buttons */}
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => {/* signIn('google') */ }}
                        >
                            <FcGoogle className="h-5 w-5" />
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => {/* signIn('github') */ }}
                        >
                            <FaGithub className="h-5 w-5" />
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => {/* signIn('apple') */ }}
                        >
                            <FaApple className="h-5 w-5" />
                            Continue with Apple
                        </Button>
                    </div>
                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                        <span className="mx-4 text-xs text-zinc-400">Or</span>
                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                    </div>
                    {/* Email & password and SSO options as buttons */}
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => setShowForm((v) => !v)}
                        >
                            <HiOutlineMail className="h-5 w-5" />
                            Email & password
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => {/* signIn() for SSO */ }}
                        >
                            <HiOutlineKey className="h-5 w-5" />
                            Single sign-on (SSO)
                        </Button>
                    </div>
                    {/* Email/password form, hidden by default */}
                    {showForm && (
                        <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={onSubmit}
                            className="space-y-4 mt-6"
                        >
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Given Names</Label>
                                <Input
                                    id="givenName"
                                    name="givenName"
                                    type="text"
                                    placeholder=""
                                    required
                                    className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Family Name</Label>
                                <Input
                                    id="familyName"
                                    name="givenName"
                                    type="text"
                                    placeholder=""
                                    required
                                    className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder=""
                                    required
                                    className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    autoComplete="email"
                                    placeholder=""
                                    required
                                    className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-xs font-medium text-zinc-700 dark:text-zinc-200">PASSWORD</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder=""
                                    required
                                    className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-500 text-center">{error}</div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-orange-200 hover:bg-orange-300 text-zinc-900 font-semibold rounded-lg py-3 text-base"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </Button>
                        </motion.form>
                    )}
                    {/* Terms, privacy, and links */}
                    <div className="mt-8 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                        By continuing, you agree to NaWeHub's <span className="font-semibold text-zinc-700 dark:text-zinc-200">Terms of Service</span> and <span className="font-semibold text-zinc-700 dark:text-zinc-200">Privacy Policy</span>.<br />
                        <div className="mt-4">
                            Already have an account? <Link href="/login" className="text-orange-600 hover:underline">Log in</Link>
                        </div>
                        <div>
                            <Link href="#" className="text-orange-600 hover:underline">Get help</Link>
                        </div>
                    </div>
                </div>
                {/* Footer */}
                <div className="mt-8 text-xs text-zinc-400 text-center">
                    This site is protected by reCAPTCHA Enterprise and the Google Privacy Policy and Terms of Service apply.
                </div>
            </div>
            {/* Right: Hero */}
            <div className="hidden md:flex w-1/2 bg-black relative items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-80 z-0" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <span className="mb-8 mt-[-60px]">
                            <img src={"/images/wehub-sample-logo.png"} alt={"NaWeHub"} className={"h-10 w-auto"} />
                        </span>
                        <h1 className="text-3xl font-bold text-white mb-4">Idea to business, fast</h1>
                        <img src="/images/salone-transparent-map.png" alt="Globe" className="w-4/5 max-w-md rounded-xl shadow-2xl"/>
                    </div>
                </div>
            </div>
        </div>
    );
}