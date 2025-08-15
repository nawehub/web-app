'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import AppHeader from "@/components/public/app-header";
import {Footer} from "@/components/public/footer";
import {appMetadata} from "@/utils/app-metadata";
import ContactForm from "@/components/public/contact-form";

const contactReasons = [
    {
        icon: <Briefcase className="h-6 w-6" />,
        title: "Entrepreneurship Support",
        description: "Get help with funding opportunities, business registration, or accessing resources",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Heart className="h-6 w-6" />,
        title: "Love Your District",
        description: "Questions about contributing to district development or project funding",
        color: "from-red-500 to-pink-500"
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Partnership Opportunities",
        description: "Collaborate with us as a development partner, hub, or organization",
        color: "from-purple-500 to-indigo-500"
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Technical Support",
        description: "Need help navigating the platform or experiencing technical issues",
        color: "from-green-500 to-emerald-500"
    }
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
           <AppHeader isVisible={true} />

            {/* Hero Section */}
            <section className="relative py-20 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5" />
                <div className="container relative">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Get in Touch
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Let's Build Sierra Leone's{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Future Together
              </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                            Whether you're an entrepreneur seeking support, a partner looking to collaborate,
                            or someone passionate about district development, we're here to help you succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Reasons */}
            <section className="py-16 bg-white/50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                            How Can We Help You?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Choose the area where you need support and we'll connect you with the right team.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactReasons.map((reason, index) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                                <CardHeader className="relative text-center">
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${reason.color} text-white mx-auto mb-4`}>
                                        {reason.icon}
                                    </div>
                                    <CardTitle className="text-lg font-semibold">{reason.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative text-center">
                                    <CardDescription className="text-gray-600">
                                        {reason.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20">
                <div className="container">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Form */}
                        <ContactForm />

                        {/* Contact Information */}
                        <div className="space-y-6">
                            {/* Contact Details */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Contact Information</CardTitle>
                                    <CardDescription>
                                        Reach out to us directly through any of these channels.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                                            <Mail className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Email</h3>
                                            <p className="text-gray-600">{appMetadata.Authors.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Phone</h3>
                                            <p className="text-gray-600">{appMetadata.Authors.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-pink-600">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Office</h3>
                                            <p className="text-gray-600">{appMetadata.Authors.address}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Response Time */}
                            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Clock className="h-6 w-6 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Response Time</h3>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>General inquiries: Within 24 hours</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Technical support: Within 12 hours</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Partnership inquiries: Within 48 hours</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Links */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Quick Links</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href="/faq" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="font-medium text-gray-900">Frequently Asked Questions</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    <Link href="/register" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="font-medium text-gray-900">Create Account</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                    <Link href="/dashboard" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="font-medium text-gray-900">Go To Dashboard</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Join thousands of entrepreneurs across Sierra Leone who are already using NaWeHub
                            to access funding, resources, and community support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Get Started Today
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/faq">
                                <Button variant="outline" size="lg">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}