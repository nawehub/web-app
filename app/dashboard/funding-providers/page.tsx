"use client"

import {useEffect, useState} from "react"
import { motion } from "framer-motion"
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {fundingService} from "@/lib/services/funding";
import AllProviders from "@/app/dashboard/funding-providers/_components/all-providers";
import CreateProviderModal from "@/app/dashboard/funding-providers/_components/CreateProviderModal";
import {IfAllowed} from "@/components/auth/IfAllowed";

export default function FundingProvidersPage() {
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['providers'],
                queryFn: () => fundingService().providers.listAll(),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, []);


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Funding Providers</h2>
                    <p className="text-muted-foreground">Manage and browse funding providers</p>
                </div>

                {/*<IfAllowed permission={"funding:create"}>*/}
                {/*    <CreateProviderModal />*/}
                {/*</IfAllowed>*/}

            </motion.div>

            <HydrationBoundary state={dehydrate(client!)}>
                <AllProviders />
            </HydrationBoundary>
        </div>
    )
}
