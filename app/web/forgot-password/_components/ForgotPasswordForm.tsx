'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import {Mail, ArrowLeft, Loader2, ArrowRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordFormProps {
    setIsSubmittedAction: (isSubmitted: boolean, email: string) => void;
}

export default function ForgotPasswordForm({ setIsSubmittedAction }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            setIsSubmittedAction(true, email);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                    Forgot password?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    No worries, we&rsquo;ll send you instructions to reset your password.
                </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-lg)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset instructions'}
                    </Button>

                    <div className="text-center flex justify-between items-center">
                        <Link
                            href="/web/login"
                            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to login
                        </Link>
                        <Link
                            href="/web/register"
                            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                            Create An Account
                            <ArrowRight className="mr-1 h-4 w-4" />
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}