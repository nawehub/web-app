'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardDescription, CardTitle} from '@/components/ui/card';
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
    Target,
    Sparkles,
    Building2,
    Rocket,
    ChevronRight
} from 'lucide-react';
import {Footer} from "@/components/public/footer";
import AppHeader from "@/components/public/app-header";
import ContactUsSection from "@/components/public/ContactUsSection";
import ScrollPartners from "@/components/public/ScrollPartners";
import Testimonies from "@/components/public/testimonies";
import Benefits from "@/components/public/benefit";

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        {number: "16", label: "Districts Covered", icon: Globe},
        {number: "1,000+", label: "Businesses Supported", icon: Users},
        {number: "SLE 10M+", label: "Funds Raised", icon: DollarSign},
        {number: "24/7", label: "Support Available", icon: Shield}
    ];

    const features = [
        {
            icon: BookOpen,
            title: "Resource Library",
            description: "Comprehensive business guides and templates"
        },
        {
            icon: DollarSign,
            title: "Financing & Grants",
            description: "Funding opportunities tailored to you"
        },
        {icon: FileText, title: "Compliance Guides", description: "Navigate legal requirements"},
        {icon: Network, title: "Business Network", description: "Connect with entrepreneurs"}
    ];

    const lydFeatures = [
        {icon: Heart, title: "Micro-contributions", description: "Starting from just 5 NLE"},
        {icon: TrendingUp, title: "District Leaderboards", description: "Track achievements"},
        {icon: Shield, title: "Transparency", description: "Full fund visibility"},
        {icon: Target, title: "Project Funding", description: "Support local initiatives"}
    ];

    return (
        <div className="min-h-screen overflow-x-hidden bg-white dark:bg-zinc-950">
            {/* Header */}
            <AppHeader isVisible={isVisible}/>

            <main>
                {/* ========== HERO SECTION ========== */}
                <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950/20" />
                    
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
                         style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                         }} 
                    />

                    {/* Floating Gradient Orbs */}
                    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="text-center space-y-8">
                            {/* Trust Badge */}
                            <div className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        Sierra Leone's Leading Business Platform
                                    </span>
                                </div>
                            </div>

                            {/* Main Headline */}
                            <div className={`transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                                    Empowering{' '}
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                                            Entrepreneurs
                                        </span>
                                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                            <path d="M2 10C50 4 150 0 298 6" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                                            <defs>
                                                <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                                                    <stop stopColor="#10b981"/>
                                                    <stop offset="0.5" stopColor="#14b8a6"/>
                                                    <stop offset="1" stopColor="#10b981"/>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                    <br />
                                    <span className="text-zinc-600 dark:text-zinc-300">Across Sierra Leone</span>
                                </h1>
                            </div>

                            {/* Subheadline */}
                            <div className={`transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                    Access funding, resources, and a thriving community. 
                                    Register your business and join the movement building a stronger economy.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className={`transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                    {/* Primary CTA */}
                                    <Link href="/register" className="w-full sm:w-auto">
                                        <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                                            <span className="relative z-10 flex items-center gap-2">
                                                <Rocket className="w-5 h-5" />
                                                Start Your Journey
                                            </span>
                                            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </button>
                                    </Link>

                                    {/* Secondary CTA */}
                                    <Link href="/lyd" className="w-full sm:w-auto">
                                        <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-zinc-900 dark:text-white bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:-translate-y-0.5 transition-all duration-300">
                                            <Heart className="w-5 h-5 text-rose-500" />
                                            <span>Love Your District</span>
                                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </button>
                                    </Link>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-zinc-500 dark:text-zinc-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span>Free to Register</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-emerald-500" />
                                        <span>Secure Platform</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-emerald-500" />
                                        <span>1,000+ Businesses</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex items-start justify-center pt-2">
                            <div className="w-1.5 h-3 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
                        </div>
                    </div>
                </section>

                {/* ========== QUICK STATS BAR ========== */}
                <section className="relative -mt-8 z-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className={`bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-6 lg:p-8 transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center group">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-3 group-hover:scale-110 transition-transform duration-300">
                                            {stat.label === 'Funds Raised' ? (
                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">SLE</span>
                                            ) : (
                                                <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                            )}
                                        </div>
                                        <div className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-white">
                                            {stat.number}
                                        </div>
                                        <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== TWO PLATFORMS SECTION ========== */}
                <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <span className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                Two Paths, One Mission
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                                Choose Your Journey
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                                Whether you're building a business or building community, NaWeHub is your partner in progress.
                            </p>
                        </div>

                        {/* Platform Cards */}
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Business Platform Card */}
                            <div className={`group relative transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10 h-full hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500">
                                    {/* Icon */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                        Business Support Hub
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                                        Everything you need to start, grow, and scale your business in Sierra Leone.
                                    </p>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-zinc-900 dark:text-white block">{feature.title}</span>
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{feature.description}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link href="/register" className="block">
                                        <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                            Get Started Free
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* LYD Platform Card */}
                            <div className={`group relative transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 lg:p-10 h-full hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500">
                                    {/* Icon */}
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                        Love Your District
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                                        Unite communities through micro-contributions that create real impact.
                                    </p>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {lydFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                    <feature.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-zinc-900 dark:text-white block">{feature.title}</span>
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{feature.description}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link href="/lyd" className="block">
                                        <button className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                            Contribute Now
                                            <Heart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== BENEFITS SECTION ========== */}
                <Benefits />

                {/* ========== BUSINESS REGISTRATION CTA ========== */}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            {/* Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                            <div className="absolute inset-0 opacity-30" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }} />
                            
                            {/* Gradient Orb */}
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl" />

                            {/* Content */}
                            <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-emerald-300">Essential First Step</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                    Recognition Begins With
                                    <br />
                                    <span className="text-emerald-400">Business Registration</span>
                                </h2>

                                <p className="text-lg text-zinc-300 max-w-2xl mx-auto mb-10">
                                    No matter how small your business is, registering it is the first step toward gaining recognition, protection, and growth opportunities.
                                </p>

                                <Link href="/business-registration">
                                    <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-2xl shadow-2xl hover:shadow-white/25 hover:-translate-y-1 transition-all duration-300 group">
                                        <span>Register Your Business</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== PARTNERS SECTION ========== */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold text-sm tracking-wider uppercase mb-4">
                                Trusted By
                            </span>
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                                Our Development Partners
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Collaborating with leading organizations to empower SMEs across Sierra Leone
                            </p>
                        </div>
                        <ScrollPartners />
                    </div>
                </section>

                {/* ========== FINAL CTA SECTION ========== */}
                <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6">
                                Ready to Transform
                                <br />
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Your Future?
                                </span>
                            </h2>
                            
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
                                Join thousands of entrepreneurs and community members building a stronger Sierra Leone together.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/register">
                                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
                                        <span>Register Now</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                                <Link href="/contact">
                                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:-translate-y-0.5 transition-all duration-300">
                                        <span>Contact Us</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== TESTIMONIALS ========== */}
                <Testimonies />

                {/* ========== CONTACT SECTION ========== */}
                <ContactUsSection />
            </main>

            {/* Footer */}
            <Footer/>
        </div>
    );
}
