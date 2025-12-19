"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UserActivity } from "@/components/dashboard/UserActivity";
import { FeaturedOpportunities } from "@/components/dashboard/featured-opportunities";
import { IfDevPartner } from "@/components/auth/IfAllowed";
import { useState } from "react";
import { FundingOpportunityDto } from "@/types/funding";
import {
    Plus,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Users,
    Briefcase,
    Heart,
    Rocket,
    Target,
    BarChart3
} from "lucide-react";

const quickActions = [
    {
        title: "Register Business",
        description: "Add a new business to the platform",
        href: "/business-registration",
        icon: Briefcase,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        title: "Find Funding",
        description: "Browse available opportunities",
        href: "/dashboard/funding-opportunities",
        icon: Target,
        gradient: "from-emerald-500 to-teal-500"
    },
    {
        title: "Love Your District",
        description: "Contribute to community projects",
        href: "/lyd",
        icon: Heart,
        gradient: "from-rose-500 to-pink-500"
    },
    {
        title: "View Resources",
        description: "Access business resources",
        href: "/dashboard/resources",
        icon: BarChart3,
        gradient: "from-violet-500 to-purple-500"
    }
];

export default function Dashboard() {
    const [opportunities, setOpportunities] = useState<FundingOpportunityDto[]>([]);
    
    return (
        <TooltipProvider>
            <div className="space-y-8 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                                Dashboard
                            </h1>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Welcome
                            </Badge>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Manage your businesses and track your progress
                        </p>
                    </div>
                    <IfDevPartner>
                        <Link href="/dashboard/funding-opportunities/create">
                            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Opportunity
                            </Button>
                        </Link>
                    </IfDevPartner>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={index}
                                    href={action.href}
                                    className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <Card className="h-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                                        <CardContent className="p-5 md:p-6 flex h-full flex-col gap-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-105 transition-transform duration-300`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                                <ArrowRight className="mt-1 h-4 w-4 text-zinc-400 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                            </div>

                                            <div className="min-w-0 space-y-1">
                                                <h3 className="text-base sm:text-lg font-semibold leading-tight text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                                    {action.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-2">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {/* Stats Cards */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <StatsCards opportunities={opportunities.length} users={100} businesses={10} />
                    </motion.div>
                    
                    {/* User Activity */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <UserActivity />
                    </motion.div>
                    
                    {/* Featured Opportunities */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <FeaturedOpportunities setOpportunities={setOpportunities} />
                    </motion.div>
                </motion.div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="dashboard-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#dashboard-grid)" />
                            </svg>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        
                        <CardContent className="relative py-8 px-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 text-white">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Rocket className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Ready to grow your business?</h3>
                                        <p className="text-white/80">
                                            Explore funding opportunities and connect with partners
                                        </p>
                                    </div>
                                </div>
                                <Link href="/dashboard/funding-opportunities">
                                    <Button className="bg-white text-emerald-600 hover:bg-zinc-100 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                                        Explore Opportunities
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </TooltipProvider>
    );
}
