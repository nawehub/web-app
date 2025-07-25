'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import {useAuth} from "@/hooks/context/AuthContext";
import {useVerifyOtpMutation} from "@/hooks/repository/use-auth";

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [isPending, startTransition] = useTransition();
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const router = useRouter();
    const { toast } = useToast();
    const { setAuthData } = useAuth();
    const verifyOtp = useVerifyOtpMutation();


    useEffect(() => {
        // Get email from localStorage
        const pendingUserId = sessionStorage.getItem('registeredUserId');
        const pendingUserEmail = sessionStorage.getItem('registeredUserEmail');
        if (!pendingUserId || !pendingUserEmail) {
            router.push('/register');
            return;
        }
        setEmail(pendingUserEmail)
        setUserId(pendingUserId);

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 8) {
            toast({
                title: 'Invalid OTP',
                description: 'Please enter the complete 8-digit OTP.',
                variant: 'destructive',
            });
            return;
        }

        startTransition(async () => {
            try {
                const response = await verifyOtp.mutateAsync({
                    userId,
                    otp: otp,
                });
                toast({
                    title: 'Email verified successfully',
                    description: 'Please create your password to complete registration.',
                });
                console.log({response})
                setAuthData(response.accessToken, response.refreshToken, response.user);
                router.push('/set-password');
            } catch (error) {
                toast({
                    title: 'Verification failed',
                    description: 'Invalid or expired OTP. Please try again.',
                    variant: 'destructive',
                });
            }
        });
    };

    const handleResendOTP = () => {
        // In a real app, you'd call an API to resend OTP
        toast({
            title: 'OTP Resent',
            description: 'A new OTP has been sent to your email.',
        });
        setTimeLeft(1800); // Reset timer
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent an 8-digit verification code to
                        <br />
                        <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={8}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                    disabled={isPending}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                    <div className="mx-2">-</div>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                        <InputOTPSlot index={6} />
                                        <InputOTPSlot index={7} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">
                                Enter the 8-digit code sent to your email
                            </p>
                        </div>

                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Code expires in <span className="font-medium text-foreground">{formatTime(timeLeft)}</span>
                                </p>
                            ) : (
                                <p className="text-sm text-destructive">
                                    Code has expired. Please request a new one.
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending || otp.length !== 8}>
                            {isPending ? 'Verifying...' : 'Verify Email'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-primary font-medium hover:underline"
                                disabled={timeLeft > 1740} // Allow resend after 1 minute
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/register" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to registration
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}