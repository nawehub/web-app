"use client"

import AppHeader from "@/components/public/app-header";
import RegisterForm from "@/app/business-registration/_components/register-form";

export default function BusinessRegistrationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AppHeader isVisible={true}/>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <RegisterForm />
            </div>
        </div>
    )
}