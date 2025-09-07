'use client';

import {useEffect, useState} from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search,
    Building2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    User,
    FileText,
    Filter,
    Grid3X3,
    List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {businessService} from "@/lib/services/business";
import ApprovedBusinesses from "@/app/dashboard/top-businesses/_components/all-approved-businesses";

export default function TopBusinessesPage() {
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['businesses'],
                queryFn: () => businessService().business.listAll(),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, []);

    return (
        <HydrationBoundary state={dehydrate(client!)}>
            <ApprovedBusinesses />
        </HydrationBoundary>
    );
}