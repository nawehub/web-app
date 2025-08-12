"use client"

import React, {use, useEffect, useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    Calendar,
    DollarSign,
    Building2,
    Clock,
    ArrowLeft,
    Send,
} from "lucide-react"
import Link from "next/link"
import {useGetOpportunityQuery} from "@/hooks/repository/use-funding";
import {formatDate} from "@/types/funding";
import {QueryClient} from "@tanstack/react-query";
import {fundingService} from "@/lib/services/funding";
import {Icons} from "@/components/ui/icon";
import { formatCurrency } from "@/utils/formatters";

interface PageProps {
    params: Promise<{
        id: string
    }>
}


export default function FundingOpportunityDetail({params}: PageProps) {
    const unwrappedParams = use(params)

    const [activeTab, setActiveTab] = useState("overview")
    const {data: remoteOpportunity, isLoading} = useGetOpportunityQuery(unwrappedParams.id)
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['applications', unwrappedParams.id],
                queryFn: () => fundingService().applications.listApplications(unwrappedParams.id),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open":
                return "default"
            case "Upcoming":
                return "secondary"
            case "Closed":
                return "destructive"
            case "Archived":
                return "outline"
            default:
                return "secondary"
        }
    }

    const isApplicationDeadlinePassed = new Date() > remoteOpportunity?.applicationDeadline!
    const canApply = !isApplicationDeadlinePassed

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-center space-x-2">
                            <Clock className="h-5 w-5 text-muted-foreground"/>
                            <span className={"py-12"}><Icons.spinner className={'h-5 w-5 animate-spin'} /></span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard/funding-opportunities">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back to Opportunities
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Badge
                                                    variant={getStatusColor(!isApplicationDeadlinePassed ? "Open" : "Closed") as any}>{isApplicationDeadlinePassed ? "Open" : "Closed"}</Badge>
                                            </div>
                                            <CardTitle className="text-2xl">{remoteOpportunity?.title}</CardTitle>
                                            <CardDescription className="text-base">Provided
                                                by {remoteOpportunity?.provider?.name}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                                            <p className="text-muted-foreground leading-relaxed">{remoteOpportunity?.description}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">About</h3>
                                            <div
                                                className="prose prose-sm max-w-none dark:prose-invert"
                                                dangerouslySetInnerHTML={{ __html: remoteOpportunity?.about! }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Funding Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <DollarSign className="h-5 w-5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Funding Range</p>
                                            <p className="font-semibold">
                                                {formatCurrency(remoteOpportunity?.amountMin!)} -{" "}
                                                {formatCurrency(remoteOpportunity?.amountMax!)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Application Deadline</p>
                                            <p className="font-semibold">{formatDate(remoteOpportunity?.applicationDeadline.toString()!)}</p>
                                            {isApplicationDeadlinePassed &&
                                                <p className="text-xs text-red-600 mt-1">Deadline has passed</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Building2 className="h-5 w-5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Funding Provider</p>
                                            <p className="font-semibold">{remoteOpportunity?.provider?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-muted-foreground"/>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Created</p>
                                            <p className="font-semibold">{formatDate(remoteOpportunity?.createdAt.toString())}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {canApply ? (
                                        <Button className="w-full" size="lg"
                                                onClick={() => window.open(remoteOpportunity?.applyLink, "_blank")}
                                        >
                                            <Send className="mr-2 h-4 w-4"/>
                                            Apply Now
                                        </Button>
                                    ) : (
                                        <Button className="w-full" size="lg" disabled>
                                            {isApplicationDeadlinePassed
                                                ? "Applications Closed"
                                                :  "Applications Opened"}
                                        </Button>
                                    )}
                                    {/*<Link href={`/dashboard/funding-opportunities/${remoteOpportunity?.id}/applicants`}>*/}
                                    {/*    <Button variant="outline" className="w-full bg-transparent">*/}
                                    {/*        View All Applications*/}
                                    {/*    </Button>*/}
                                    {/*</Link>*/}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
