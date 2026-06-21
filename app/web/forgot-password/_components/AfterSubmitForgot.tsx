import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

interface AfterSubmitForgotProps {
    email: string;
    setIsSubmitted: (isSubmitted: boolean) => void;
}

export const AfterSubmitForgot = ({ email, setIsSubmitted }: AfterSubmitForgotProps) => {
    return (
        <div className="w-full space-y-8">
            <div className="text-center">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                        <CheckCircle className="h-8 w-8 text-primary-foreground" />
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                    Check your email
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    We&rsquo;ve sent a password reset link to <strong className="text-foreground">{email}</strong>
                </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-lg)]">
                <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Didn&rsquo;t receive the email? Check your spam folder or try again.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                            Try different email
                        </Button>
                        <Link href="/login">
                            <Button className="w-full">Back to login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}