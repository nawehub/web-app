'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, Calendar } from 'lucide-react';
import { useCreateEventMutation } from '@/hooks/repository/use-events';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QuillEditor from "@/components/QuillEditor";
import {EventMetadata} from "@/types/event";

export default function CreateEventPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [about, setAbout] = useState('');
    const [host, setHost] = useState('');
    const [eventType, setEventType] = useState('');
    const [flier, setFlier] = useState<File | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hostWebsite, setHostWebsite] = useState('');

    const { toast } = useToast();
    const router = useRouter();
    const createEventMutation = useCreateEventMutation();

    const handleFlierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.type.startsWith('image/')) {
                toast({
                    title: 'Invalid file type',
                    description: 'Please select an image file for the event flier.',
                    variant: 'destructive',
                });
                return;
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'Please select an image smaller than 5MB.',
                    variant: 'destructive',
                });
                return;
            }

            setFlier(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !host.trim() || !about.trim() || !flier || !startDate || !endDate) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
                duration: 5000
            });
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            toast({
                title: 'Error',
                description: 'End date must be after start date',
                variant: 'destructive',
                duration: 5000,
            });
            return;
        }

        try {
            const formData = new FormData();

            // Create metadata as JSON blob with proper content-type
            const metadata: EventMetadata = {
                title: title.trim(),
                description: description.trim(),
                host: host.trim(),
                eventType: eventType as EventMetadata['eventType'],
                about: about.trim(),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                hostWebsite: hostWebsite.trim() || "",
            };

            // Append the metadata as a JSON string
            formData.append('metadata', new Blob([JSON.stringify(metadata)], {
                type: 'application/json'
            }));
            formData.append('flier', flier);

            await createEventMutation.mutateAsync(formData);

            toast({
                title: 'Success',
                description: 'Event created successfully',
                variant: 'default'
            });

            // Navigate back to an events list
            router.push('/dashboard/events');
        } catch (error) {
            toast({
                title: 'Error',
                description: `${error instanceof Error ? error.message : 'Failed to upload file'}`,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mt-3">
                <Link href="/dashboard/events">
                    <Button variant="ghost" size="sm" className={"mb-5"}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Events
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create New Event</h1>
                    <p className="text-muted-foreground">
                        Create a new business event or workshop for the community
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the basic details about your event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter event title"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the event"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="host">Event Host</Label>
                                        <Input
                                            id="host"
                                            value={host}
                                            onChange={(e) => setHost(e.target.value)}
                                            placeholder="Enter event host name or organization"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Event Type</Label>
                                        <Select value={eventType} onValueChange={(value) => setEventType(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={'Select Event Type'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CONFERENCE">Conference</SelectItem>
                                                <SelectItem value="CONCERT">Concert</SelectItem>
                                                <SelectItem value="WORKSHOP">Workshop</SelectItem>
                                                <SelectItem value="MEETING">Meeting</SelectItem>
                                                <SelectItem value="WEBINAR">Webinar</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hostWebsite">Host Website (Optional)</Label>
                                    <Input
                                        id="hostWebsite"
                                        type="url"
                                        value={hostWebsite}
                                        onChange={(e) => setHostWebsite(e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                    Provide detailed information about the event
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2">
                                    <Label htmlFor="about">About This Event</Label>
                                    <div className="min-h-[300px]">
                                        <QuillEditor value={about} onChange={setAbout} placeholder="Provide detailed information about the event..." />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Event Flier */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Flier</CardTitle>
                                <CardDescription>
                                    Upload an image for your event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="flier">Upload Flier</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="flier"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFlierChange}
                                            className="flex-1"
                                        />
                                        {flier && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFlier(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {flier && (
                                        <div className="mt-2">
                                            <p className="text-sm text-muted-foreground">
                                                Selected: {flier.name} ({Math.round(flier.size / 1024)} KB)
                                            </p>
                                            <div className="mt-2 aspect-video relative overflow-hidden rounded-lg border">
                                                <img
                                                    src={URL.createObjectURL(flier)}
                                                    alt="Event flier preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Date & Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Date & Time</CardTitle>
                                <CardDescription>
                                    Set the event schedule
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="startDate">Start Date & Time</Label>
                                    <Input
                                        id="startDate"
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">End Date & Time</Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={createEventMutation.isPending || !title.trim() || !description.trim() || !host.trim() || !about.trim() || !flier || !startDate || !endDate}
                                        className="w-full"
                                    >
                                        {createEventMutation.isPending ? (
                                            <>
                                                <Upload className="h-4 w-4 mr-2 animate-spin" />
                                                Creating Event...
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Create Event
                                            </>
                                        )}
                                    </Button>
                                    <Link href="/dashboard/events" className="w-full">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}