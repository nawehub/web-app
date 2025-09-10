"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Logo } from "@/components/logo";

import { registerForm } from "@/lib/services/use-auth";
import { useRegisterMutation } from "@/hooks/repository/use-auth";
import { RegisterResponse } from "@/store/auth";
import Link from "next/link";
import clsx from "clsx";
import { formatResponse } from "@/utils/format-response";

type RegisterFormValues = z.infer<typeof registerForm>;
type RoleType = RegisterFormValues["role"];

const DEV_PARTNER_TYPES = [
    "Government",
    "NGO",
    "Private",
    "Foundation",
    "Bank",
    "Corporate",
    "Individual",
    "Other",
] as const;

export default function Register() {
    const { status } = useSession();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const mutation = useRegisterMutation();

    // Form
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerForm),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            gender: "Male",
            role: "Entrepreneur",
            devPartner: undefined,
        },
        mode: "onBlur",
    });

    const role = form.watch("role");

    // Ensure devPartner exists for DevelopmentPartner and is cleared for Entrepreneur
    useEffect(() => {
        if (role === "DevelopmentPartner" && !form.getValues("devPartner")) {
            form.setValue("devPartner", {
                name: "",
                description: "",
                websiteUrl: "",
                contactEmail: "",
                contactPhone: "",
                providerType: "NGO",
            } as any);
        }
        if (role === "Entrepreneur") {
            form.setValue("devPartner", undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    // Redirect if authed
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-primary" />
            </div>
        );
    }
    if (status === "authenticated") return null;

    const onSubmit = async (values: RegisterFormValues) => {
        setError("");
        setLoading(true);
        startTransition(async () => {
            try {
                const payload: RegisterFormValues = { ...values };
                const response: RegisterResponse = await mutation.mutateAsync(payload);

                // Store ID for OTP flow
                sessionStorage.setItem("registeredUserId", response.user.id);
                sessionStorage.setItem("registeredUserEmail", response.user.email);
                router.push("/verify-otp");
            } catch (err: any) {
                const msg = err?.message ? formatResponse(err.message) : "Registration failed";
                setError(msg);
                toast("Registration failed", {
                    description: msg,
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        });
    };

    // Compute heading without hooks (prevents hook order mismatch)
    const headingByRole =
        role === "Entrepreneur"
            ? {
                title: "Create your Entrepreneur account",
                subtitle: "Kickstart your journey: connect, learn, and grow your business.",
            }
            : {
                title: "Register as a Development Partner",
                subtitle: "Join the ecosystem to support entrepreneurs and projects.",
            };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-between bg-white dark:bg-zinc-900 px-6 py-8 md:px-16">
                <Logo />

                <div className="mx-auto w-full max-w-xl flex-1 py-6">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center">{headingByRole.title}</h2>
                        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-300">{headingByRole.subtitle}</p>

                        {/* Role Switcher */}
                        <div className="mt-6 grid grid-cols-2 gap-2">
                            {(["Entrepreneur", "DevelopmentPartner"] as RoleType[]).map((r) => {
                                const active = role === r;
                                return (
                                    <Button
                                        key={r}
                                        type="button"
                                        variant={active ? "default" : "outline"}
                                        className={clsx(
                                            "w-full rounded-lg transition",
                                            active
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                        )}
                                        onClick={() => form.setValue("role", r)}
                                    >
                                        {r === "Entrepreneur" ? "Entrepreneur" : "Development Partner"}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* SSO */}
                        {/*<div className="mt-6 space-y-3">*/}
                        {/*    <Button*/}
                        {/*        variant="outline"*/}
                        {/*        className="w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 rounded-lg py-2.5"*/}
                        {/*        onClick={() => signIn("google")}*/}
                        {/*    >*/}
                        {/*        <FcGoogle className="h-5 w-5" />*/}
                        {/*        Continue with Google*/}
                        {/*    </Button>*/}
                        {/*</div>*/}

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
                            <span className="mx-4 text-xs text-zinc-400">Fill in the form below</span>
                            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-700" />
                        </div>
                    </motion.div>

                    {/* Form */}
                    <Form {...form}>
                        <motion.form
                            onSubmit={form.handleSubmit(onSubmit)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            className="space-y-5"
                        >
                            {/* Common fields */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-1">
                                            <Label className="text-sm font-medium">First Name</Label>
                                            <Input
                                                {...field}
                                                placeholder="John"
                                                className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-1">
                                            <Label className="text-sm font-medium">Last Name</Label>
                                            <Input
                                                {...field}
                                                placeholder="Doe"
                                                className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-1">
                                            <Label className="text-sm font-medium">Email</Label>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="you@example.com"
                                                className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-1">
                                            <Label className="text-sm font-medium">Phone Number</Label>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="+232 00 000 000"
                                                className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium">Gender</Label>
                                            <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label className="text-sm font-medium">Role</Label>
                                            <Select value={field.value} onValueChange={(v: RoleType) => field.onChange(v)}>
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                                                    <SelectItem value="DevelopmentPartner">Development Partner</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Development Partner extra fields */}
                            <AnimatePresence initial={false} mode="wait">
                                {role === "DevelopmentPartner" && (
                                    <motion.div
                                        key="devPartnerFields"
                                        initial={{ opacity: 0, y: 8, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="rounded-xl border bg-white/80 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 p-4"
                                    >
                                        <h3 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                                            Development Partner Details
                                        </h3>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="devPartner.name"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Organization Name</Label>
                                                        <Input
                                                            {...field}
                                                            placeholder="Org name"
                                                            className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="devPartner.providerType"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Provider Type</Label>
                                                        <Select value={field.value as any} onValueChange={(v) => field.onChange(v)}>
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Choose type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DEV_PARTNER_TYPES.map((t) => (
                                                                    <SelectItem key={t} value={t}>
                                                                        {t}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="devPartner.contactEmail"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Contact Email</Label>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            placeholder="org@example.com"
                                                            className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="devPartner.contactPhone"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Contact Phone</Label>
                                                        <Input
                                                            {...field}
                                                            placeholder="+232 ..."
                                                            className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="devPartner.websiteUrl"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Website</Label>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://example.org"
                                                            className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="devPartner.description"
                                                render={({ field }) => (
                                                    <FormItem className="sm:col-span-1">
                                                        <Label className="text-sm font-medium">Description</Label>
                                                        <Input
                                                            {...field}
                                                            placeholder="What does your organization do?"
                                                            className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            {error && (
                                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full rounded-lg bg-emerald-600 py-3 text-base font-semibold text-white hover:bg-emerald-700"
                                disabled={loading || isPending}
                            >
                                {loading || isPending ? "Creating account..." : "Create Account"}
                            </Button>

                            {/* Terms */}
                            <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                                <div className="mt-3">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-emerald-600 hover:underline">
                                        Log in
                                    </Link>
                                </div>
                                <div>
                                    <Link href="#" className="text-emerald-600 hover:underline">
                                        Get help
                                    </Link>
                                </div>
                            </div>
                        </motion.form>
                    </Form>
                </div>

                <div className="mt-6 text-center text-xs text-zinc-400">
                    This site is protected by reCAPTCHA Enterprise and the Google Privacy Policy and Terms of Service apply.
                </div>
            </div>

            {/* Right: Visual Section */}
            <div className="relative hidden w-1/2 items-center justify-center bg-black md:flex">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/80 to-black/60" />
                <motion.div
                    className="relative z-10 mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <img src={"/images/wehub-sample-logo.png"} alt="Brand" className="mb-8 h-10 w-auto" />
                    <motion.h1
                        className="mb-4 text-3xl font-bold text-white"
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                    >
                        Build with the community
                    </motion.h1>
                    <motion.img
                        src="/images/salone-transparent-map.png"
                        alt="Hero"
                        className="w-4/5 max-w-md rounded-xl shadow-2xl"
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                    />
                </motion.div>
            </div>
        </div>
    );
}