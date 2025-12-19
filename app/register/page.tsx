"use client";

import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession} from "next-auth/react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {toast} from "sonner";

import {registerForm} from "@/lib/services/use-auth";
import {useRegisterMutation} from "@/hooks/repository/use-auth";
import {RegisterResponse} from "@/store/auth";
import Link from "next/link";
import clsx from "clsx";
import {formatResponse} from "@/utils/format-response";
import {Textarea} from "@/components/ui/textarea";
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {
    Sparkles,
    User,
    Building2,
    Mail,
    Phone,
    Globe,
    FileText,
    ArrowRight,
    Shield,
    CheckCircle,
    Users,
    Rocket
} from "lucide-react";

type RegisterFormValues = z.infer<typeof registerForm>;
type RoleType = RegisterFormValues["role"];

export default function Register() {
    const {status} = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [contactPerson, setContactPerson] = useState<string>("");
    const [nameErr, setNameErr] = useState<string>("");

    const mutation = useRegisterMutation();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerForm),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            role: "Entrepreneur",
        },
        mode: "onBlur",
    });

    const role = form.watch("role");

    useEffect(() => {
        if (role === "DevelopmentPartner" && !form.getValues("devPartner")) {
            form.setValue("devPartner", {
                name: "",
                description: "",
                websiteUrl: "",
            } as any);
        }
        if (role === "Entrepreneur") {
            form.setValue("gender", "");
            form.setValue("devPartner", undefined);
        }
    }, [role, form]);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
                <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-emerald-500"/>
            </div>
        );
    }
    if (status === "authenticated") return null;

    const onSubmit = async (values: RegisterFormValues) => {
        setError("");
        setLoading(true);

        try {
            const payload: RegisterFormValues = {...values};
            const response: RegisterResponse = await mutation.mutateAsync(payload);

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
    };

    const headingByRole =
        role === "Entrepreneur"
            ? {
                title: "Start Your Entrepreneurial Journey",
                subtitle: "Join thousands of entrepreneurs building the future of Sierra Leone",
            }
            : {
                title: "Become a Development Partner",
                subtitle: "Empower entrepreneurs and support community-driven projects",
            };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />
            
            <main className="flex-1 flex">
                {/* Left: Form Section */}
                <div className="w-full lg:w-1/2 flex flex-col px-4 sm:px-6 lg:px-12 py-24 lg:py-32 overflow-y-auto">
                    {/* Background Elements */}
                    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/10 -z-10 lg:w-1/2" />
                    <div className="fixed top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl -z-10" />

                    <div className="max-w-xl mx-auto w-full space-y-8">
                        {/* Header */}
                        <motion.div 
                            initial={{opacity: 0, y: 12}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{duration: 0.3}}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Create Account
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                {headingByRole.title}
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {headingByRole.subtitle}
                            </p>
                        </motion.div>

                        {/* Role Switcher */}
                        <motion.div 
                            initial={{opacity: 0, y: 12}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{duration: 0.3, delay: 0.05}}
                            className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl"
                        >
                            {(["Entrepreneur", "DevelopmentPartner"] as RoleType[]).map((r) => {
                                const active = role === r;
                                const Icon = r === "Entrepreneur" ? Rocket : Building2;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => form.setValue("role", r)}
                                        className={clsx(
                                            "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                            active
                                                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-md"
                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{r === "Entrepreneur" ? "Entrepreneur" : "Partner"}</span>
                                    </button>
                                );
                            })}
                        </motion.div>

                        {/* Form Card */}
                        <motion.div
                            initial={{opacity: 0, y: 12}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3, delay: 0.1}}
                            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8"
                        >
                            <Form {...form}>
                                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Name Fields */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {role === "Entrepreneur" ? (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                First Name
                                                            </Label>
                                                            <div className="relative mt-1.5">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                                <Input
                                                                    {...field}
                                                                    placeholder="John"
                                                                    className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                                />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="lastName"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                Last Name
                                                            </Label>
                                                            <div className="relative mt-1.5">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Doe"
                                                                    className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                                />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FormItem>
                                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        Contact Person *
                                                    </Label>
                                                    <div className="relative mt-1.5">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <Input
                                                            type="text"
                                                            value={contactPerson}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setContactPerson(value);
                                                                const parts = value.trim().split(/\s+/);
                                                                if (parts.length >= 2) {
                                                                    const last = parts.pop() as string;
                                                                    const first = parts.join(" ");
                                                                    form.setValue("firstName", first, { shouldValidate: true, shouldDirty: true });
                                                                    form.setValue("lastName", last, { shouldValidate: true, shouldDirty: true });
                                                                    setNameErr("");
                                                                } else {
                                                                    setNameErr("Include both first and last name");
                                                                    form.setValue("firstName", "", { shouldValidate: true, shouldDirty: true });
                                                                    form.setValue("lastName", "", { shouldValidate: true, shouldDirty: true });
                                                                }
                                                            }}
                                                            placeholder="John Doe"
                                                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                        />
                                                    </div>
                                                    {nameErr && <p className="text-sm text-destructive mt-1">{nameErr}</p>}
                                                </FormItem>
                                                <FormField
                                                    control={form.control}
                                                    name="designation"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                Designation *
                                                            </Label>
                                                            <div className="relative mt-1.5">
                                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                                <Input
                                                                    {...field}
                                                                    type="text"
                                                                    placeholder="Your role"
                                                                    className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                                />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        Email Address
                                                    </Label>
                                                    <div className="relative mt-1.5">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            placeholder="you@example.com"
                                                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phoneNumber"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        Phone Number
                                                    </Label>
                                                    <div className="relative mt-1.5">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                        <Input
                                                            {...field}
                                                            type="tel"
                                                            placeholder="+232 00 000 000"
                                                            className="pl-10 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Gender for Entrepreneur */}
                                    {role === "Entrepreneur" && (
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                        Gender
                                                    </Label>
                                                    <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                        <SelectTrigger className="mt-1.5 h-11 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl">
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
                                    )}

                                    {/* Development Partner Fields */}
                                    <AnimatePresence initial={false} mode="wait">
                                        {role === "DevelopmentPartner" && (
                                            <motion.div
                                                key="devPartnerFields"
                                                initial={{opacity: 0, y: 8, height: 0}}
                                                animate={{opacity: 1, y: 0, height: "auto"}}
                                                exit={{opacity: 0, y: -8, height: 0}}
                                                transition={{duration: 0.25}}
                                                className="rounded-2xl border bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-800 border-zinc-200 dark:border-zinc-700 p-5 space-y-4"
                                            >
                                                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                                    Organization Details
                                                </h3>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="devPartner.name"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                    Organization Name
                                                                </Label>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Organization name"
                                                                    className="mt-1.5 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                                />
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="devPartner.websiteUrl"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                    Website
                                                                </Label>
                                                                <div className="relative mt-1.5">
                                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="https://example.org"
                                                                        className="pl-10 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                                    />
                                                                </div>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={form.control}
                                                    name="devPartner.description"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                                Description
                                                            </Label>
                                                            <Textarea
                                                                {...field}
                                                                maxLength={500}
                                                                placeholder="Describe your organization's mission and focus areas..."
                                                                className="mt-1.5 min-h-[100px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl"
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Error */}
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                                                Creating account...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Create Account
                                                <ArrowRight className="w-5 h-5" />
                                            </span>
                                        )}
                                    </Button>

                                    {/* Terms & Login Link */}
                                    <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 space-y-3">
                                        <p>
                                            By creating an account, you agree to our{" "}
                                            <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                        <p>
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    </div>
                </div>

                {/* Right: Visual Section */}
                <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
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
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                            </div>
                            
                            <h2 className="text-3xl xl:text-4xl font-bold">
                                Join Sierra Leone's Leading Business Platform
                            </h2>
                            
                            <p className="text-lg text-white/80">
                                Connect with funders, access resources, and grow your business with the support of a thriving community.
                            </p>

                            {/* Features */}
                            <div className="space-y-4 text-left">
                                {[
                                    { icon: Shield, text: "Access funding opportunities" },
                                    { icon: Users, text: "Connect with development partners" },
                                    { icon: CheckCircle, text: "Register your business easily" },
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

                            {/* Map Image */}
                            <motion.div
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.5, delay: 0.6}}
                            >
                                <img
                                    src="/images/salone-transparent-map.png"
                                    alt="Sierra Leone Map"
                                    className="w-full max-w-xs mx-auto opacity-80"
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
