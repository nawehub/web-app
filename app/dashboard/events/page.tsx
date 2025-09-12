'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {
    Calendar,
    Plus,
    Search,
    ExternalLink,
    Clock
} from 'lucide-react';
import {CreateEventDialog} from '@/app/dashboard/events/_components/create-event-dialog';
import {useEventsQuery} from '@/hooks/repository/use-events';
import Link from 'next/link';
import {formatDate} from "@/types/funding";
import {useRouter} from "next/navigation";
import {IfAllowed, IfDevPartner} from "@/components/auth/IfAllowed";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {useIsMobile} from "@/hooks/use-mobile";

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'open' | 'closed' | 'all'>('open');
    const router = useRouter();
    const isMobile = useIsMobile()

    const {data: allEvents, isLoading} = useEventsQuery();

    // Filter events based on end date to determine status
    const now = new Date();
    const filteredEvents = allEvents?.events.filter(event => {
        const endDate = new Date(event.endDate);
        const isOpen = endDate > now;

        if (statusFilter === 'open') return isOpen;
        if (statusFilter === 'closed') return !isOpen;
        return true; // 'all'
    });

    const searchedEvents = filteredEvents?.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const getEventTypeColor = (type: string) => {
        const colors = {
            CONFERENCE: 'bg-blue-500',
            CONCERT: 'bg-purple-500',
            WORKSHOP: 'bg-green-500',
            MEETING: 'bg-orange-500',
            WEBINAR: 'bg-cyan-500',
            OTHER: 'bg-gray-500'
        };
        return colors[type as keyof typeof colors] || 'bg-gray-500';
    };

    return (
        <div className={`space-y-6 ${isMobile ? 'pt-8' : 'pt-16'}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
                    <p className="text-muted-foreground">
                        Discover and manage business events and workshops
                    </p>
                </div>
                <IfDevPartner>
                    <Button onClick={() => router.push('/dashboard/events/create')} className={'text-white'}>
                        <Plus className="h-4 w-4 "/>
                        Create {isMobile ? '' : 'New Event'}
                    </Button>
                </IfDevPartner>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 items-center ">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as 'open' | 'closed' | 'all')}>
                    <SelectTrigger className={isMobile ? 'w-32' : 'w-48'}>
                        <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Filters</SelectLabel>
                            <SelectItem value="open">Open Events</SelectItem>
                            <SelectItem value="closed">Past Events</SelectItem>
                            <SelectItem value="all">All Events</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Events Grid */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">Loading events...</div>
                    </div>
                ) : filteredEvents?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4"/>
                        <h3 className="text-lg font-medium mb-2">No events found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? 'No events match your search.' : 'No events available at the moment.'}
                        </p>
                        {!searchQuery && (
                            <IfDevPartner>
                                <Link href="/dashboard/events/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Create First Event
                                    </Button>
                                </Link>
                            </IfDevPartner>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchedEvents?.map((event) => (
                            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                {event.flier && (
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={event.flier}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            {isEventActive(event) && (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <Clock className="h-3 w-3 mr-1"/>
                                                    Live
                                                </Badge>
                                            )}
                                            {isEventUpcoming(event) && (
                                                <Badge className="bg-blue-500 hover:bg-blue-600">
                                                    <Calendar className="h-3 w-3 mr-1"/>
                                                    Upcoming
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute top-2 left-2">
                                            <Badge
                                                className={`${getEventTypeColor(event.eventType)} hover:opacity-90 text-white`}>
                                                {event.eventType}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                <CardHeader className="pb-2">
                                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                                    <CardDescription className="line-clamp-3">
                                        {event.description}
                                    </CardDescription>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                        <span>Hosted by {event.host}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4"/>
                                        <span>
                      {formatDate(event.startDate.toString())} - {formatDate(event.endDate.toString())}
                    </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4"/>
                                        <span>
                      {formatTime(event.startDate.toString())} - {formatTime(event.endDate.toString())}
                    </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                    <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Learn More
                                        </Button>
                                    </Link>
                                    {event.hostWebsite && (
                                        <Button size="sm" variant="ghost" asChild>
                                            <a
                                                href={event.hostWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4"/>
                                            </a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Event Dialog */}
            <CreateEventDialog
                open={showCreateEvent}
                onOpenChangeAction={setShowCreateEvent}
            />
        </div>
    );
}