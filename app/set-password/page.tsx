'use client';

import React, {useState, useEffect, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {ArrowLeft, Key, Eye, EyeOff, Check, X} from 'lucide-react';
import Link from 'next/link';
import {useAuth} from "@/hooks/context/AuthContext";
import {useSetPasswordMutation} from "@/hooks/repository/use-auth";
import { signIn } from 'next-auth/react';

export default function SetPasswordPage() {
    const [password, setPasswordValue] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {toast} = useToast();
    const {token, setAuthData, user} = useAuth();
    const createPassword = useSetPasswordMutation();

    useEffect(() => {
        // Check if an access token exists in context
        if (!token) {
            router.push('/login');
            return;
        }
    }, [router]);

    // Password validation rules
    const passwordRules = [
        {rule: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8},
        {rule: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd)},
        {rule: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd)},
        {rule: 'Contains number', test: (pwd: string) => /\d/.test(pwd)},
        {rule: 'Contains special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)},
    ];

    const isPasswordValid = passwordRules.every(rule => rule.test(password));
    const doPasswordsMatch = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast({
                title: 'Invalid password',
                description: 'Please ensure your password meets all requirements.',
                variant: 'destructive',
            });
            return;
        }

        if (!doPasswordsMatch) {
            toast({
                title: 'Passwords do not match',
                description: 'Please ensure both passwords are identical.',
                variant: 'destructive',
            });
            return;
        }

        console.log({token, password, confirmPassword})
        startTransition(async () => {
            try {

                const response = await createPassword.mutateAsync({
                    accessToken: token ? token : '',
                    newPassword: password,
                    confirmPassword: confirmPassword,
                });
                // Sign in the user after password creation
                const result = await signIn('credentials', {
                    email: user?.email || '',
                    password: password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                toast({
                    title: 'Password created successfully',
                    description: 'Your account is now ready. Please sign in.',
                });
                setAuthData(response.accessToken, response.refreshToken, response.user);
                router.push('/dashboard');
            } catch (error) {
                toast({
                    title: 'Password setup failed',
                    description: 'Please try again or contact support.',
                    variant: 'destructive',
                });
            }
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div
                            className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <Key className="h-8 w-8 text-white"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Your Password</CardTitle>
                    <CardDescription className="text-center">
                        Set a secure password for your account
                        <br/>
                        <span className="font-medium text-foreground">{user?.email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPasswordValue(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Password Requirements</Label>
                            <div className="space-y-1">
                                {passwordRules.map((rule, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        {rule.test(password) ? (
                                            <Check className="h-4 w-4 text-green-500"/>
                                        ) : (
                                            <X className="h-4 w-4 text-muted-foreground"/>
                                        )}
                                        <span className={rule.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
                                            {rule.rule}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Password Match Indicator */}
                        {confirmPassword.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                {doPasswordsMatch ? (
                                    <>
                                        <Check className="h-4 w-4 text-green-500"/>
                                        <span className="text-green-600">Passwords match</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="h-4 w-4 text-destructive"/>
                                        <span className="text-destructive">Passwords do not match</span>
                                    </>
                                )}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending || !isPasswordValid || !doPasswordsMatch}
                        >
                            {isPending ? 'Creating password...' : 'Create Password'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/verify-otp"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4"/>
                        Back to verification
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}