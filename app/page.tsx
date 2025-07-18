'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
    ArrowRight,
    BookOpen,
    DollarSign,
    FileText,
    Heart,
    Network,
    Shield,
    TrendingUp,
    Users,
    Zap,
    CheckCircle,
    Star,
    Globe,
    Target
} from 'lucide-react';
import {Footer} from "@/components/public/footer";
import AppHeader from "@/components/public/app-header";
import DevelopmentPartners from "@/components/public/development-partners";
import Testimonials from "@/components/public/testiminials";
import ContactUsSection from "@/components/public/ContactUsSection";

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        {number: "16", label: "Districts Covered", icon: Globe},
        {number: "1,000+", label: "SMEs Supported", icon: Users},
        {number: "Le 50M+", label: "Funds Raised", icon: DollarSign},
        {number: "24/7", label: "Support Available", icon: Shield}
    ];

    const features = [
        {
            icon: BookOpen,
            title: "Resource Library & Templates",
            description: "Access comprehensive business guides and templates"
        },
        {
            icon: DollarSign,
            title: "Financing & Grant Information",
            description: "Discover funding opportunities tailored to your needs"
        },
        {icon: FileText, title: "Regulatory Compliance Guides", description: "Navigate legal requirements with ease"},
        {icon: Network, title: "Business Networking", description: "Connect with fellow entrepreneurs and mentors"}
    ];

    const lydFeatures = [
        {icon: Heart, title: "Micro-donations from Le 1", description: "Every contribution makes a difference"},
        {icon: TrendingUp, title: "District Leaderboards", description: "Track and celebrate district achievements"},
        {icon: Shield, title: "Transparent Fund Management", description: "Complete visibility into fund allocation"},
        {icon: Target, title: "Community Project Funding", description: "Support local development initiatives"}
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <AppHeader isVisible={isVisible}/>

            <main className="px-4 py-8">
                {/* Hero Section */}
                <div className="text-center space-y-8 py-16">
                    <div
                        className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Badge variant="secondary"
                               className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-all duration-300 hover:scale-105 shadow-sm">
                            <Star className="w-3 h-3 mr-1"/>
                            Supporting SMEs Across Sierra Leone
                        </Badge>
                    </div>

                    <div
                        className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl mx-auto leading-tight">
                            Empowering SMEs Across{' '}
                            <span
                                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                                Sierra Leone
                            </span>
                            <br/>
                            <span className="text-emerald-600 relative">
                                Building Districts.
                                <div
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transform scale-x-0 animate-[scaleX_2s_ease-in-out_2s_forwards]"></div>
                            </span>
                        </h1>
                    </div>

                    <div
                        className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                            A comprehensive platform connecting entrepreneurs with resources, funding,
                            and community support while fostering district-level development through
                            voluntary micro-contributions.
                        </p>
                    </div>

                    {/* Floating Elements */}
                    <div
                        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-10 animate-bounce delay-1000"></div>
                    <div
                        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-bounce delay-1500"></div>
                    <div
                        className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-10 animate-bounce delay-2000"></div>
                </div>

                {/* Two Platforms Section */}
                <div className="py-20">
                    <div
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Two Platforms, One Mission
                        </h2>
                        <div
                            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Business Support Hub */}
                        <Card
                            className={`group p-8 border-2 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div
                                    className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                                    <Zap className="h-8 w-8 text-white"/>
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-slate-800">Business Support
                                        Hub</CardTitle>
                                    <CardDescription className="text-slate-600 text-base">
                                        Comprehensive resources and tools for SME growth and development
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {features.map((feature, index) => (
                                    <div key={index}
                                         className="flex items-start gap-3 group/item hover:translate-x-2 transition-all duration-300">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-blue-200 transition-all duration-300">
                                            <feature.icon className="h-4 w-4 text-blue-600"/>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-800">{feature.title}</span>
                                            <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link href="/register">
                                <Button
                                    className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                                    size="lg">
                                    Entrepreneur Login / Register
                                    <ArrowRight
                                        className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300"/>
                                </Button>
                            </Link>
                        </Card>

                        {/* Love Your District */}
                        <Card
                            className={`group p-8 border-2 hover:border-emerald-200 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/30 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div
                                    className="h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                                    <Heart className="h-8 w-8 text-white"/>
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-slate-800">Love Your District
                                        (LYD)</CardTitle>
                                    <CardDescription className="text-slate-600 text-base">
                                        Foster Community-driven development through voluntary micro-contributions
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {lydFeatures.map((feature, index) => (
                                    <div key={index}
                                         className="flex items-start gap-3 group/item hover:translate-x-2 transition-all duration-300">
                                        <div
                                            className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-200 transition-all duration-300">
                                            <feature.icon className="h-4 w-4 text-emerald-600"/>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-800">{feature.title}</span>
                                            <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link href="/dashboard/lyd/donate">
                                <Button variant="outline"
                                        className="w-full group/btn border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300"
                                        size="lg">
                                    Donate to a District ("Love Your District")
                                    <Heart
                                        className="ml-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300"/>
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>

                {/* Business Registration Section */}
                <div
                    className={`py-20 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div
                        className="bg-gradient-to-r from-slate-50 to-blue-50 -mx-4 px-4 py-16 rounded-3xl border border-slate-200/50 shadow-xl">
                        <div className="max-w-5xl mx-auto text-center">
                            <div
                                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg mb-8">
                                <CheckCircle className="h-5 w-5 text-emerald-500"/>
                                <span className="font-medium text-slate-700">Essential Step</span>
                            </div>

                            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Recognition Begins With Business Registration
                            </h2>

                            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                No matter how small your business is, registering it is the first and most important
                                step
                                toward gaining recognition, protection, and growth opportunities.
                            </p>

                            <Link href="/register">
                                <Button size="lg"
                                        className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg">
                                    Register Your Business Now
                                    <ArrowRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Problem-Solving Section */}
                <div
                    className={`py-20 text-center transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Solve a Problem
                        </h2>

                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Discover how one great solution can spark a business - click to play the Fractal Grid game
                            and start solving!
                        </p>

                        <Button variant="outline" size="lg"
                                className="px-12 py-4 border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg group">
                            Turn Problems into Opportunities
                            <Zap className="ml-2 h-5 w-5 group-hover:text-purple-600 transition-colors duration-300"/>
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <section
                    className={`bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div
                        className="container mx-auto p-12">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat'
                            }}></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                            {stats.map((stat, index) => (
                                <div key={index}
                                     className="group hover:scale-110 transition-all duration-300 text-white">
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                                            <stat.icon className="h-6 w-6"/>
                                        </div>
                                    </div>
                                    <div
                                        className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm opacity-90 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Development Partners Section */}
                <div
                    className={`py-20 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Our Development Partners
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We collaborate with leading organizations to empower SME's across Sierra Leone
                        </p>
                    </div>

                    <div
                        className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-blue-50 py-12">
                        {/* Gradient overlays for smooth fade effect */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
                        <DevelopmentPartners/>
                    </div>
                </div>

                {/* CTA Section */
                }
                <div
                    className={`py-20 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div
                        className="bg-gradient-to-br from-slate-50 to-blue-50 -mx-4 px-4 py-16 border border-slate-200/50 shadow-xl">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Ready to Get Started?
                            </h2>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                Join thousands of entrepreneurs and community members building a
                                stronger Sierra Leone.
                            </p>

                            <Link href="/register">
                                <Button size="lg"
                                        className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg group">
                                    Entrepreneur Login / Register
                                    <ArrowRight
                                        className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"/>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <Testimonials/>
                {/*  Contact Us  */}
                <ContactUsSection/>
            </main>

            {/* Footer */}
            <Footer/>
        </div>
    )
        ;
}