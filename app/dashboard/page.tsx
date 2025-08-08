"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { List, FileText, Users, HeartHandshake, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {StatsCards} from "@/components/dashboard/StatsCards";
import {UserActivity} from "@/components/dashboard/UserActivity";
import {FeaturedOpportunities} from "@/components/dashboard/featured-opportunities";

export default function Dashboard() {
    return (
        <TooltipProvider>
            <div className="flex items-center justify-between space-y-2 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/funding-opportunities/create">
                        <Button>Create Opportunity</Button>
                    </Link>
                </div>
            </div>
            <div className="space-y-10">
                <motion.div
                    className={"flex-1 space-y-4 pt-6"}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {/* stats */}
                    <StatsCards />
                    <UserActivity />
                    <FeaturedOpportunities />
                </motion.div>

            </div>
        </TooltipProvider>
    );
}