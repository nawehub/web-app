'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    ExternalLink,
    ArrowLeft
} from 'lucide-react';
import { useEventQuery } from '@/hooks/repository/use-events';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {IfAllowed} from "@/components/auth/IfAllowed";
import {useIsMobile} from "@/hooks/use-mobile";
import React, {useEffect, useState} from "react";
import {EventApproveRejectDialog} from "@/app/dashboard/events/_components/event-approve-reject-dialog";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {eventService} from "@/lib/services/event";

export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.id as string;
    const isMobile = useIsMobile();
    const [selectedStatus, setSelectedStatus] = useState<"Approve" | "Reject">();
    const [openAlert, setOpenAlert] = useState(false);
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    const { data: event, isLoading, error } = useEventQuery(eventId);

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['event', eventId],
                queryFn: () => eventService().event.getEvent(eventId),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isEventActive = (event: any) => {
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return now >= startDate && now <= endDate;
    };

    const isEventUpcoming = (event: any) => {
        const now = new Date();
        const startDate = new Date(event.startDate);
        return now < startDate;
    };

    if (isLoading) {
        return (
            <div className={`space-y-6 ${isMobile ? 'pt-8' : 'pt-16'}`}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/events">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading event...</div>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/events">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <h3 className="text-lg font-medium mb-2">Event not found</h3>
                    <p className="text-muted-foreground">
                        The event you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    const onActionChange = (action: "Approve" | "Reject") => {
        setSelectedStatus(action);
        setOpenAlert(true);
    };

    return (
        <div className={`space-y-6 ${isMobile ? 'pt-4' : 'pt-8'}`}>
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/events">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Events
                    </Button>
                </Link>
            </div>

            {/* Event Details */}
            <HydrationBoundary state={dehydrate(client!)}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Header */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <CardTitle className="text-2xl">{event.title}</CardTitle>
                                        <CardDescription className="text-base">
                                            {event.description}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        {isEventActive(event) && (
                                            <Badge className="bg-green-500 hover:bg-green-600">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Live
                                            </Badge>
                                        )}
                                        {isEventUpcoming(event) && (
                                            <Badge className="bg-blue-500 hover:bg-blue-600">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Upcoming
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {event.flier && (
                                <CardContent className="pt-0">
                                    <div className="aspect-video relative overflow-hidden rounded-lg">
                                        <img
                                            src={event.flier}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert dark:text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: event.about }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Event Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4" />
                                        Start Date
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-6">
                                        {formatDate(event.startDate.toString())} at {formatTime(event.startDate.toString())}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4" />
                                        End Date
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-6">
                                        {formatDate(event.endDate.toString())} at {formatTime(event.endDate.toString())}
                                    </p>
                                </div>

                                {event.hostWebsite && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <ExternalLink className="h-4 w-4" />
                                                Host Website
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full" asChild>
                                                <a
                                                    href={event.hostWebsite}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Visit Website
                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                </a>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        {event.status.state === 'Pending_Approval' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {event.hostWebsite && (
                                        <Button className="w-full" asChild>
                                            <a
                                                href={event.hostWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Visit Event Website
                                                <ExternalLink className="h-4 w-4 ml-2" />
                                            </a>
                                        </Button>
                                    )}

                                    <IfAllowed>
                                        <Button
                                            variant="outline"
                                            className="w-full text-white hover:bg-green-700 bg-green-600"
                                            onClick={() => onActionChange("Approve")}
                                        >
                                            Approve Event
                                        </Button>
                                        <Button variant="outline" className="w-full text-white hover:bg-red-700 bg-red-600"
                                                onClick={() => onActionChange("Reject")}
                                        >
                                            Reject Event
                                        </Button>
                                    </IfAllowed>

                                    <Button variant="outline" className="w-full">
                                        Add to Calendar
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </HydrationBoundary>
            <EventApproveRejectDialog evtId={event?.id!} action={selectedStatus as "Approve" | "Reject"} openAlert={openAlert} openAlertAction={setOpenAlert} />
        </div>
    );
}
