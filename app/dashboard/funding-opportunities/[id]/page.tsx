"use client"

import React, {use, useEffect, useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    Calendar,
    DollarSign,
    Building2,
    Users,
    Clock,
    Star,
    ArrowLeft,
    TrendingUp,
    FileText,
    Send,
} from "lucide-react"
import {ApplicationForm} from "@/app/dashboard/funding-opportunities/_components/application-form"
import {ApplicantsList} from "@/app/dashboard/funding-opportunities/_components/applicants-list"
import Link from "next/link"
import {useGetOpportunityQuery, useListApplicationsQuery} from "@/hooks/repository/use-funding";
import {formatDate} from "@/types/funding";
import {useSession} from "next-auth/react";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {fundingService} from "@/lib/services/funding";
import {Icons} from "@/components/ui/icon";
import { formatCurrency } from "@/utils/formatters";

interface PageProps {
    params: Promise<{
        id: string
    }>
    searchParams?: Promise<{ apply?: string }>
}


export default function FundingOpportunityDetail({params, searchParams}: PageProps) {
    const unwrappedParams = use(params)
    const unwrappedSearchParams = searchParams ? use(searchParams) : undefined

    const [showApplicationForm, setShowApplicationForm] = useState(unwrappedSearchParams?.apply === "true")
    const [activeTab, setActiveTab] = useState("overview")
    const { data: applicants } = useListApplicationsQuery(unwrappedParams.id)

    const {data: remoteOpportunity, isLoading} = useGetOpportunityQuery(unwrappedParams.id)
    const {data: session} = useSession();

    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    const opportunityApplications = applicants?.applications

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

    const handleApplicationSubmit = () => {
        setShowApplicationForm(false)
        setActiveTab("overview")
    }

    const isApplicationDeadlinePassed = new Date() > remoteOpportunity?.applicationDeadline!
    const canApply = remoteOpportunity?.status === "Open" && !isApplicationDeadlinePassed
    const alreadyApplied = opportunityApplications?.some((app) => app.applicantEmail === session?.user?.email)

    if (showApplicationForm) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <ApplicationForm
                    opportunity={remoteOpportunity!}
                    onSubmitAction={handleApplicationSubmit}
                    onCancelAction={() => setShowApplicationForm(false)}
                />
            </div>
        )
    }

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
                    <TabsTrigger value="applicants" className="flex items-center space-x-2">
                        <Users className="h-4 w-4"/>
                        Applicants ({remoteOpportunity?.totalApplications})
                    </TabsTrigger>
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
                                                    variant={getStatusColor(remoteOpportunity?.status!) as any}>{remoteOpportunity?.status}</Badge>
                                                <Badge variant="outline">{remoteOpportunity?.type.replace("_", " ")}</Badge>
                                                {remoteOpportunity?.isFeatured && (
                                                    <Badge variant="secondary">
                                                        <Star className="mr-1 h-3 w-3"/>
                                                        Featured
                                                    </Badge>
                                                )}
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

                                        <Separator/>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Eligibility Summary</h3>
                                            <p className="text-muted-foreground">{remoteOpportunity?.eligibilitySummary}</p>
                                        </div>

                                        {remoteOpportunity?.criteria.length! > 0 && (
                                            <>
                                                <Separator/>
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-3">Eligibility Criteria</h3>
                                                    <div className="space-y-3">
                                                        {remoteOpportunity?.criteria.map((criteria, index) => (
                                                            <div key={index}
                                                                 className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span
                                                                            className="font-medium">{criteria.key}</span>
                                                                        {criteria.required && (
                                                                            <Badge variant="destructive"
                                                                                   className="text-xs">
                                                                                Required
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mt-1">{criteria.value}</p>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {criteria.type}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {remoteOpportunity?.tags.length! > 0 && (
                                            <>
                                                <Separator/>
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {remoteOpportunity?.tags.map((tag) => (
                                                            <Badge key={tag} variant="secondary">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
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
                                    {canApply && !alreadyApplied ? (
                                        <Button className="w-full" size="lg"
                                                onClick={() => setShowApplicationForm(true)}>
                                            <Send className="mr-2 h-4 w-4"/>
                                            Apply Now
                                        </Button>
                                    ) : (
                                        <Button className="w-full" size="lg" disabled>
                                            {remoteOpportunity?.status === "Closed" || isApplicationDeadlinePassed
                                                ? "Applications Closed"
                                                : remoteOpportunity?.status === "Upcoming"
                                                    ? "Coming Soon"
                                                    : "Already Applied"}
                                        </Button>
                                    )}
                                    {/*<Link href={`/dashboard/funding-opportunities/${remoteOpportunity?.id}/applicants`}>*/}
                                    {/*    <Button variant="outline" className="w-full bg-transparent">*/}
                                    {/*        View All Applications*/}
                                    {/*    </Button>*/}
                                    {/*</Link>*/}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Application Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4 text-muted-foreground"/>
                                            <span className="text-sm">Total Applications</span>
                                        </div>
                                        <span className="font-semibold">{remoteOpportunity?.totalApplications}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                                            <span className="text-sm">Approved</span>
                                        </div>
                                        <span className="font-semibold">
                                          {opportunityApplications?.filter((app) => app.applicationStatus === "Approved").length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-muted-foreground"/>
                                            <span className="text-sm">Pending Review</span>
                                        </div>
                                        <span className="font-semibold">
                                          {
                                              opportunityApplications?.filter((app) =>
                                                  ["Submitted", "Under_Review"].includes(app.applicationStatus),
                                              ).length
                                          }
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="applicants">
                    <HydrationBoundary state={dehydrate(client!)}>
                        <ApplicantsList
                            opportunity={remoteOpportunity!}
                            applications={applicants?.applications!}
                        />
                    </HydrationBoundary>
                </TabsContent>
            </Tabs>
        </div>
    )
}
