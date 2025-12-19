"use client"

import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import RegisterForm from "@/app/business-registration/_components/register-form";
import {useIsMobile} from "@/hooks/use-mobile";
import {Badge} from "@/components/ui/badge";
import {Briefcase, Shield, CheckCircle, Clock} from "lucide-react";

export default function BusinessRegistrationPage() {
    const isMobile = useIsMobile();
    
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true}/>
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-8 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Business Registration
                            </span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                            Register Your Business
                        </h1>
                        
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Join thousands of entrepreneurs on Sierra Leone's leading business platform. 
                            Get access to funding, resources, and community support.
                        </p>
                        
                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            {[
                                { icon: Shield, text: "Secure & Private" },
                                { icon: CheckCircle, text: "Free Registration" },
                                { icon: Clock, text: "Quick Process" }
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Badge 
                                        key={index}
                                        variant="secondary" 
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800"
                                    >
                                        <Icon className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-zinc-700 dark:text-zinc-300">{item.text}</span>
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <main className={`flex-1 container px-4 py-8`}>
                <RegisterForm />
            </main>

            <Footer />
        </div>
    )
}
