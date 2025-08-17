"use client";

import React, {useState, useEffect, useTransition} from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import {signIn, useSession} from "next-auth/react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useToast} from "@/hooks/use-toast";
import {registerForm} from "@/lib/services/use-auth";
import {z} from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useRegisterMutation} from "@/hooks/repository/use-auth";
import {RegisterResponse} from "@/store/auth";
import {Form, FormField} from "@/components/ui/form";
import {Logo} from "@/components/logo";
import {formatResponse} from "@/utils/format-response";

export default function Register() {
    const { status } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const register = useRegisterMutation();


    const form = useForm<z.infer<typeof registerForm>>({
        resolver: zodResolver(registerForm),
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            gender: 'Male',
            username: '',
            role: 'entrepreneur'
        },
    });

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

    const handleSubmit = async (values: z.infer<typeof registerForm>) => {
        setError("")
        setLoading(true);
        startTransition(async () => {
            try {
                const response: RegisterResponse = await register.mutateAsync({...values});

                // Store the user ID for OTP verification
                sessionStorage.setItem('registeredUserId', response.user.id);
                sessionStorage.setItem("registeredUserEmail", response.user.email);
                router.push('/verify-otp');
            } catch (err) {
                setError(err instanceof Error ? formatResponse(err.message) : "An error occurred");
                toast({
                    title: 'Registration failed',
                    description: error,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Signup Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between bg-white dark:bg-zinc-900 px-6 py-8 md:py-0 md:px-16 min-h-screen">
                {/* Logo */}
                <Logo />
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white text-center">Create a YourApp account</h2>
                    {/* SSO Buttons */}
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => {signIn('google').then() }}
                        >
                            <FcGoogle className="h-5 w-5" />
                            Continue with Google
                        </Button>
                        {/*<Button*/}
                        {/*    variant="outline"*/}
                        {/*    className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"*/}
                        {/*    onClick={() => {signIn('github').then() }}*/}
                        {/*>*/}
                        {/*    <FaGithub className="h-5 w-5" />*/}
                        {/*    Continue with GitHub*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*    variant="outline"*/}
                        {/*    className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"*/}
                        {/*    onClick={() => {signIn('apple').then() }}*/}
                        {/*>*/}
                        {/*    <FaApple className="h-5 w-5" />*/}
                        {/*    Continue with Apple*/}
                        {/*</Button>*/}
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
                    </div>
                    {/* Email/password form, hidden by default */}
                    {showForm && (
                        <Form {...form}>
                            <motion.form
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-4 mt-6"
                            >
                                <FormField
                                    control={form.control}
                                    name={"firstName"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="firstName" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">First Name</Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder=""
                                                required
                                                className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                                {...field}
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"lastName"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="lastName" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                {...field}
                                                placeholder=""
                                                required
                                                className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"gender"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="gender" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Gender</Label>
                                            <Select onValueChange={(value) => {
                                                field.onChange(value);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"email"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Email</Label>
                                            <Input
                                                id="email"
                                                {...field}
                                                type="email"
                                                autoComplete="email"
                                                placeholder=""
                                                required
                                                className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"phoneNumber"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="phoneNumber" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                {...field}
                                                type="tel"
                                                autoComplete="tel-local"
                                                placeholder=""
                                                required
                                                className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"username"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Username</Label>
                                            <Input
                                                id="username"
                                                {...field}
                                                type="text"
                                                autoComplete="on"
                                                placeholder=""
                                                required
                                                className="mt-1 px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-base focus:ring-2 focus:ring-primary focus:outline-none"
                                            />
                                        </div>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={"role"}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="role" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Your Role</Label>
                                            <Select onValueChange={(value) => field.onChange(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                                                    <SelectItem value="development-partner">Development Partner or Innovation Hub</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                                {error && (
                                    <div className="text-sm text-red-500 text-center">{error}</div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full bg-orange-200 hover:bg-orange-300 text-zinc-900 font-semibold rounded-lg py-3 text-base"
                                    disabled={loading || isPending}
                                >
                                    {loading || isPending ? "Creating account..." : "Create Account"}
                                </Button>
                            </motion.form>
                        </Form>
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