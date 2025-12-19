'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Mail,
    Phone,
    MapPin,
    Users,
    Heart,
    Briefcase,
    Globe,
    ArrowRight,
    MessageCircle,
    Clock,
    CheckCircle,
    Sparkles,
    Send
} from 'lucide-react';
import Link from 'next/link';
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {appMetadata} from "@/utils/app-metadata";
import ContactForm from "@/components/public/contact-form";

const contactReasons = [
    {
        icon: Briefcase,
        title: "Entrepreneurship Support",
        description: "Get help with funding opportunities, business registration, or accessing resources",
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        icon: Heart,
        title: "Love Your District",
        description: "Questions about contributing to district development or project funding",
        gradient: "from-rose-500 to-pink-500"
    },
    {
        icon: Users,
        title: "Partnership Opportunities",
        description: "Collaborate with us as a development partner, hub, or organization",
        gradient: "from-violet-500 to-purple-500"
    },
    {
        icon: Globe,
        title: "Technical Support",
        description: "Need help navigating the platform or experiencing technical issues",
        gradient: "from-blue-500 to-cyan-500"
    }
];

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            <AppHeader isVisible={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl" />
                
                <div className="container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                Get in Touch
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
                            Let's Build Sierra Leone's{' '}
                            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Future Together
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Whether you're an entrepreneur seeking support, a partner looking to collaborate,
                            or someone passionate about district development, we're here to help you succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Reasons */}
            <section className="py-16 relative">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                            How Can We Help You?
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Choose the area where you need support and we'll connect you with the right team.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactReasons.map((reason, index) => {
                            const Icon = reason.icon;
                            return (
                                <Card
                                    key={index}
                                    className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <CardHeader className="text-center pb-2">
                                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${reason.gradient} text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold">{reason.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <CardDescription className="text-zinc-600 dark:text-zinc-400">
                                            {reason.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-16 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
                <div className="container">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            {/* Contact Details */}
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <Send className="h-4 w-4 text-white" />
                                        </div>
                                        Contact Information
                                    </CardTitle>
                                    <CardDescription>
                                        Reach out to us directly through any of these channels.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-4 group">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-white">Email</h3>
                                            <a
                                                className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                                href={"mailto:" + appMetadata.Authors.email}
                                            >{appMetadata.Authors.email}</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 group">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-white">Phone</h3>
                                            <a
                                                className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                                href={'tel:' + appMetadata.Authors.phone}
                                            >{appMetadata.Authors.phone}</a>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 group">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-900 dark:text-white">Office</h3>
                                            <p className="text-zinc-600 dark:text-zinc-400">{appMetadata.Authors.address}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Response Time */}
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white">Response Time</h3>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-zinc-900/60">
                                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-zinc-700 dark:text-zinc-300">General inquiries: Within 24 hours</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-zinc-900/60">
                                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-zinc-700 dark:text-zinc-300">Technical support: Within 12 hours</span>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-zinc-900/60">
                                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-zinc-700 dark:text-zinc-300">Partnership inquiries: Within 48 hours</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-emerald-500" />
                                        Quick Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[
                                        { href: "/faq", label: "Frequently Asked Questions" },
                                        { href: "/register", label: "Create Account" },
                                        { href: "/dashboard", label: "Go To Dashboard" },
                                    ].map((link, index) => (
                                        <Link 
                                            key={index}
                                            href={link.href} 
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                                        >
                                            <span className="font-medium text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {link.label}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
                <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

                <div className="container relative">
                    <div className="mx-auto max-w-2xl text-center text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-lg text-white/80 mb-8">
                            Join thousands of entrepreneurs across Sierra Leone who are already using NaWeHub
                            to access funding, resources, and community support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button 
                                    size="lg" 
                                    className="bg-white text-emerald-600 hover:bg-zinc-100 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 h-12 px-8"
                                >
                                    Get Started Today
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/faq">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="border-2 border-white/30 text-white hover:text-white hover:bg-white/20 font-semibold rounded-xl h-12 px-8"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
