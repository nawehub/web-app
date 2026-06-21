"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Sparkles, ArrowRight, Briefcase, Heart, Rocket, Target, BarChart3 } from "lucide-react";
import {ClothBorder} from "@/components/icons";

const quickActions = [
    {
        title: "Register Business",
        description: "Add a new business to the platform",
        href: "/register-business",
        icon: Briefcase,
        tone: "bg-primary text-primary-foreground",
    },
    {
        title: "Find Funding",
        description: "Browse available opportunities",
        href: "/dashboard/funding-opportunities",
        icon: Target,
        tone: "bg-accent text-accent-foreground",
    },
    {
        title: "Next Big Idea",
        description: "Contribute to community projects",
        href: "/lyd",
        icon: Heart,
        tone: "bg-[hsl(var(--color-info))] text-white",
    },
    {
        title: "View Resources",
        description: "Access business resources",
        href: "/dashboard/resources",
        icon: BarChart3,
        tone: "bg-[hsl(var(--color-secondary-700))] text-white",
    },
];

export default function DashboardPage() {
    const [opportunities, setOpportunities] = useState<FundingOpportunityDto[]>([]);

    return (
        <TooltipProvider>
            <div className="space-y-8 py-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-3xl">
                                Dashboard
                            </h1>
                            <Badge variant="secondary" className="bg-primary/15 text-primary">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Welcome
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">Manage your businesses and track your progress</p>
                    </div>
                    <IfDevPartner>
                        <Link href="/dashboard/funding-opportunities/create">
                            <Button className="rounded-xl bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[var(--shadow-lg)]">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Opportunity
                            </Button>
                        </Link>
                    </IfDevPartner>
                </div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <Card className="h-full rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
                                    <CardContent className="flex h-full flex-col gap-4 p-5 md:p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-105 ${action.tone}`}>
                                                <action.icon className="h-5 w-5" />
                                            </div>
                                            <ArrowRight className="mt-1 h-4 w-4 translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                        </div>

                                        <div className="min-w-0 space-y-1">
                                            <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-lg [font-family:var(--font-display)]">
                                                {action.title}
                                            </h3>
                                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                                                {action.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <StatsCards opportunities={opportunities.length} users={100} businesses={10} />
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <UserActivity />
                    </motion.div>

                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <FeaturedOpportunities setOpportunities={setOpportunities} />
                    </motion.div>
                </motion.div>

                {/* CTA Banner */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="overflow-hidden rounded-3xl bg-[hsl(var(--color-neutral-900))]">
                        <ClothBorder fillTone="hsl(25 95% 53%)" fillUrl="dashboard-cloth-border" />
                        <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
                            <div className="flex items-center gap-4 text-[hsl(var(--color-neutral-50))]">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                                    <Rocket className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold [font-family:var(--font-display)]">
                                        Ready to grow your business?
                                    </h3>
                                    <p className="text-[hsl(var(--color-neutral-300))]">
                                        Explore funding opportunities and connect with partners
                                    </p>
                                </div>
                            </div>
                            <Link href="/dashboard/funding-opportunities">
                                <Button className="rounded-xl bg-accent font-semibold text-accent-foreground shadow-[var(--shadow-lg)] transition-all duration-300 hover:bg-[hsl(var(--color-secondary-400))]">
                                    Explore Opportunities
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <ClothBorder fillTone="hsl(60 9% 98%)" fillUrl="dashboard-cloth-border" />
                    </div>
                </motion.div>
            </div>
        </TooltipProvider>
    );
}