import {Logo} from "@/components/logo";
import {CheckCircle} from "lucide-react";
import Link from "next/link";
import React from "react";

interface AfterSubmitForgotProps {
    email: string;
    setIsSubmitted: (isSubmitted: boolean) => void;
}

export const AfterSubmitForgot = ({email, setIsSubmitted}: AfterSubmitForgotProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Logo />
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Try different email
                            </button>
                            <Link
                                href="/login"
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                            >
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}