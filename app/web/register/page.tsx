"use client";

import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
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
import {formatResponse} from "@/utils/format-response";
import {
    Sparkles,
    User,
    Mail,
    Phone,
    FileText,
    ArrowRight,
    Shield,
    CheckCircle,
    Users,
} from "lucide-react";
import Loading from "@/components/loading";

type RegisterFormValues = z.infer<typeof registerForm>;

const visualFeatures = [
    {icon: Shield, text: "Access funding opportunities"},
    {icon: Users, text: "Connect with development partners"},
    {icon: CheckCircle, text: "Register your business easily"},
];

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
        return <Loading/>;
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
            router.push("/web/verify-otp");
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

    const headingByRole = {
        title: "Start Your Entrepreneurial Journey",
        subtitle: "Join thousands of entrepreneurs building the future of Sierra Leone",
    };

    return (
        <div className="flex flex-1">
            {/* Left: Form Section */}
            <div
                className="relative flex w-full flex-col overflow-y-auto px-4 py-24 sm:px-6 lg:w-1/2 lg:px-12 lg:py-32">
                <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background"/>
                <div className="absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"/>

                <div className="mx-auto w-full max-w-xl space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3}}
                        className="space-y-4"
                    >
                        <div
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                            <Sparkles className="h-4 w-4 text-primary"/>
                            <span className="text-sm font-medium text-primary">Create Account</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                            {headingByRole.title}
                        </h1>
                        <p className="text-muted-foreground">{headingByRole.subtitle}</p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: 0.1}}
                        className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lg)] sm:p-8"
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
                                                        <Label>First Name</Label>
                                                        <div className="relative mt-1.5">
                                                            <User
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                            <Input {...field} placeholder="John"
                                                                   className="h-11 pl-10"/>
                                                        </div>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <Label>Last Name</Label>
                                                        <div className="relative mt-1.5">
                                                            <User
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                            <Input {...field} placeholder="Doe" className="h-11 pl-10"/>
                                                        </div>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <FormItem>
                                                <Label>Contact Person *</Label>
                                                <div className="relative mt-1.5">
                                                    <User
                                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
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
                                                                form.setValue("firstName", first, {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                });
                                                                form.setValue("lastName", last, {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                });
                                                                setNameErr("");
                                                            } else {
                                                                setNameErr("Include both first and last name");
                                                                form.setValue("firstName", "", {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                });
                                                                form.setValue("lastName", "", {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                });
                                                            }
                                                        }}
                                                        placeholder="John Doe"
                                                        className="h-11 pl-10"
                                                    />
                                                </div>
                                                {nameErr && <p className="mt-1 text-sm text-destructive">{nameErr}</p>}
                                            </FormItem>
                                            <FormField
                                                control={form.control}
                                                name="designation"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <Label>Designation *</Label>
                                                        <div className="relative mt-1.5">
                                                            <FileText
                                                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                placeholder="Your role"
                                                                className="h-11 pl-10"
                                                            />
                                                        </div>
                                                        <FormMessage/>
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
                                                <Label>Email Address</Label>
                                                <div className="relative mt-1.5">
                                                    <Mail
                                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="h-11 pl-10"
                                                    />
                                                </div>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({field}) => (
                                            <FormItem>
                                                <Label>Phone Number</Label>
                                                <div className="relative mt-1.5">
                                                    <Phone
                                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        placeholder="+232 00 000 000"
                                                        className="h-11 pl-10"
                                                    />
                                                </div>
                                                <FormMessage/>
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
                                                <Label>Gender</Label>
                                                <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                                                    <SelectTrigger className="mt-1.5 h-11">
                                                        <SelectValue placeholder="Select gender"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Error */}
                                {error && (
                                    <div
                                        className="rounded-xl border border-[hsl(var(--color-error))]/30 bg-[hsl(var(--color-error))]/5 p-4">
                                        <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-12 w-full bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[var(--shadow-lg)]"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div
                                                className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"/>
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Create Account
                                            <ArrowRight className="h-5 w-5"/>
                                        </span>
                                    )}
                                </Button>

                                {/* Terms & Login Link */}
                                <div className="space-y-3 text-center text-sm text-muted-foreground">
                                    <p>
                                        By creating an account, you agree to our{" "}
                                        <Link href="/web/terms" className="text-primary hover:underline">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/web/privacy" className="text-primary hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </p>
                                    <p>
                                        Already have an account?{" "}
                                        <Link href="/web/login" className="font-medium text-primary hover:underline">
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
            <div
                className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[hsl(160_84%_39%)] via-[hsl(160_84%_30%)] to-[hsl(160_70%_22%)] lg:flex">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="register-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#register-grid)"/>
                    </svg>
                </div>

                {/* Floating Shapes */}
                <div className="absolute left-20 top-20 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl"/>
                <div
                    className="absolute bottom-40 right-20 h-48 w-48 animate-pulse rounded-full bg-white/10 blur-3xl"
                    style={{animationDelay: "1s"}}
                />
                <div
                    className="absolute left-1/3 top-1/2 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-xl"
                    style={{animationDelay: "2s"}}
                />

                {/* Content */}
                <div
                    className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-center text-white">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="max-w-lg space-y-8"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                <Sparkles className="h-6 w-6"/>
                            </div>
                        </div>

                        <h2 className="text-3xl font-semibold [font-family:var(--font-display)] xl:text-4xl">
                            Join Sierra Leone&rsquo;s Leading Business Platform
                        </h2>

                        <p className="text-lg text-white/80">
                            Connect with funders, access resources, and grow your business with the support of a
                            thriving community.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 text-left">
                            {visualFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{duration: 0.3, delay: 0.4 + index * 0.1}}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <feature.icon className="h-4 w-4"/>
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
                                className="mx-auto w-full max-w-xs opacity-80"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}