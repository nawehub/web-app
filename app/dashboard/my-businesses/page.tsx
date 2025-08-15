"use client";

import {useState, useEffect} from "react";

import {businessService} from "@/lib/services/business";
import {NewBizDialog} from "@/app/dashboard/my-businesses/_components/NewBizDialog";
import {HydrationBoundary, QueryClient, dehydrate} from "@tanstack/react-query";
import AllBusinesses from "@/app/dashboard/my-businesses/_components/all-businesses";
import {IfAllowed} from "@/components/auth/IfAllowed";

export default function MyBusinessesPage() {
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['businesses'],
                queryFn: () => businessService().business.listAll(""),
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
                        My Businesses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your registered businesses and track their status
                    </p>
                </div>
                <IfAllowed permission={"user:read"}>
                    <NewBizDialog />
                </IfAllowed>
            </div>
            <HydrationBoundary state={dehydrate(client!)}>
                <AllBusinesses />
            </HydrationBoundary>
        </div>
    );
}