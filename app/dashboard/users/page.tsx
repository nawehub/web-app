"use client";

import { useState, useEffect } from "react";

import Businesses from "@/app/dashboard/my-businesses/_components/businesses";
import {HydrationBoundary, QueryClient, dehydrate} from "@tanstack/react-query";
import {userService} from "@/lib/services/user";
import ListRequireApproval from "@/app/dashboard/users/_components/list-require-approval";

export default function UsersPage() {
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['requireApproval'],
                queryFn: () => userService().user.listAllRequireApproval(),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, []);

    return (
        <div>
            <HydrationBoundary state={dehydrate(client!)}>
                <ListRequireApproval />
            </HydrationBoundary>
        </div>
    );
}