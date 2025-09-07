"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import {StatsCards} from "@/components/dashboard/StatsCards";
import {UserActivity} from "@/components/dashboard/UserActivity";
import {FeaturedOpportunities} from "@/components/dashboard/featured-opportunities";
import {IfDevPartner} from "@/components/auth/IfAllowed";
import {useState} from "react";
import {FundingOpportunityDto} from "@/types/funding";

export default function Dashboard() {
    const [opportunities, setOpportunities] = useState<FundingOpportunityDto[]>([]);
    return (
        <TooltipProvider>
            <div className="flex items-center justify-between space-y-2 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <IfDevPartner>
                        <Link href="/dashboard/funding-opportunities/create">
                            <Button>Create Opportunity</Button>
                        </Link>
                    </IfDevPartner>
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
                    <StatsCards opportunities={opportunities.length} users={100} businesses={10} />
                    <UserActivity />
                    <FeaturedOpportunities setOpportunities={setOpportunities} />
                </motion.div>

            </div>
        </TooltipProvider>
    );
}