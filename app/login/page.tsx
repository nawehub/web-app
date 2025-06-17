"use client";

import React, {useState, useEffect} from "react";
import {signIn, useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {FcGoogle} from "react-icons/fc";
import {FaGithub, FaApple} from "react-icons/fa";
import {Eye, EyeOff} from "lucide-react";

export default function Login() {
    const {status} = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const registered = searchParams.get("registered");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
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
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left: Login Form */}
            <div
                className="w-full md:w-1/2 flex flex-col justify-between bg-white dark:bg-zinc-900 px-6 py-8 md:py-0 md:px-16 min-h-screen">
                {/* Logo */}
                <div className="items-center h-16 mb-8 pt-5">
                    <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-10 w-auto mr-2"/>
                    <span className="font-light text-xs -top-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
                </div>
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">Log in to your
                        account</h2>
                    <form onSubmit={onSubmit} className="space-y-4 mt-6">
                        <div>
                            <Label htmlFor="email" className="sr-only">
                                Email or Username
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="EMAIL OR USERNAME"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 px-4 bg-gray-200 border-0 rounded-md placeholder:text-gray-600 placeholder:text-xs placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div className="relative">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-12 px-4 pr-12 bg-gray-200 border-0 rounded-md placeholder:text-gray-600 placeholder:text-xs placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                            </button>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 text-center">{error}</div>
                        )}
                        <Button
                            className="w-full h-12 bg-orange-400 hover:bg-orange-500 text-white font-medium rounded-md">
                            {loading ? "Signing in..." : "Log In"}
                        </Button>
                    </form>
                    <div className="flex justify-between items-center mt-3">
                        <Link href="#" className="text-xs text-orange-600 hover:underline">Forgot password?</Link>
                    </div>
                    {/* SSO Buttons */}
                    <div className="mt-6 space-y-2">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => signIn()}
                        >
                            <span className="inline-block rotate-180"><svg width="20" height="20" fill="none"
                                                                           viewBox="0 0 20 20"><path
                                d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                            Use SSO login
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
                        >
                            <FcGoogle className="h-5 w-5"/>
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => signIn("github", {callbackUrl: "/dashboard"})}
                        >
                            <FaGithub className="h-5 w-5"/>
                            Continue with GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg py-2.5 text-base font-normal"
                            onClick={() => signIn("apple", {callbackUrl: "/dashboard"})}
                        >
                            <FaApple className="h-5 w-5"/>
                            Continue with Apple
                        </Button>
                    </div>
                    <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        <span>New to YourApp? <Link href="/register"
                                                    className="text-orange-600 hover:underline">Sign up</Link></span>
                        <br/>
                        <Link href="#" className="text-orange-600 hover:underline">Get help</Link>
                    </div>
                </div>
                {/* Footer */}
                <div className="bottom-0 max-w-md text-xs text-gray-500 text-center leading-relaxed mx-auto mb-5">
                    This site is protected by reCAPTCHA Enterprise and the Google<br/>{" "}
                    <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                        Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                        Terms of Service
                    </Link>{" "}
                    apply.
                </div>
            </div>
            {/* Right: Hero */}
            <div className="hidden md:flex w-1/2 bg-black relative items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-80 z-0"/>
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