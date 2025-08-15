"use client";

import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {fundingService} from "@/lib/services/funding";
import FundingList from "@/app/dashboard/funding-opportunities/_components/funding-list";
import CreateProviderModal from "@/app/dashboard/funding-providers/_components/CreateProviderModal";
import {IfAllowed} from "@/components/auth/IfAllowed";

export default function FundingOpportunitiesPage() {
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['opportunities'],
                queryFn: () => fundingService().opportunities.listAll(),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, []);

    return (
        <div className="space-y-6 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Funding Opportunities
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Discover grants, loans, and investment opportunities for your business
                    </p>
                </div>

                <IfAllowed permission={"funding:create"}>
                    <Link href="/dashboard/funding-opportunities/create">
                        <Button
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Opportunity
                        </Button>
                    </Link>
                </IfAllowed>

            </div>

            <HydrationBoundary state={dehydrate(client!)}>
                <FundingList />
            </HydrationBoundary>
        </div>
    );
}