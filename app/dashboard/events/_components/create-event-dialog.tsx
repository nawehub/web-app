'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Upload, X } from 'lucide-react';
import { useCreateEventMutation } from '@/hooks/repository/use-events';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import QuillEditor from "@/components/QuillEditor";

interface CreateEventDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChangeAction }: CreateEventDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [about, setAbout] = useState('');
    const [flier, setFlier] = useState<File | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hostWebsite, setHostWebsite] = useState('');

    const { toast } = useToast();
    const createEventMutation = useCreateEventMutation();

    // Rich text editor configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'list', 'bullet',
        'indent',
        'direction', 'align',
        'blockquote', 'code-block',
        'link'
    ];

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

        if (!title.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter an event title',
                variant: 'destructive',
            });
            return;
        }

        if (!description.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter an event description',
                variant: 'destructive',
            });
            return;
        }

        if (!about.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter event details in the About section',
                variant: 'destructive',
            });
            return;
        }

        if (!flier) {
            toast({
                title: 'Error',
                description: 'Please upload an event flier',
                variant: 'destructive',
            });
            return;
        }

        if (!startDate || !endDate) {
            toast({
                title: 'Error',
                description: 'Please select start and end dates',
                variant: 'destructive',
            });
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            toast({
                title: 'Error',
                description: 'End date must be after start date',
                variant: 'destructive',
            });
            return;
        }

        try {
            const formData = new FormData();

            // Create metadata as JSON blob with proper content-type
            const metadata = {
                title: title.trim(),
                description: description.trim(),
                about: about.trim(),
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                hostWebsite: hostWebsite.trim() || undefined,
            };

            const metadataBlob = new Blob([JSON.stringify(metadata)], {
                type: 'application/json'
            });

            formData.append('metadata', metadataBlob);
            formData.append('flier', flier);

            await createEventMutation.mutateAsync(formData);

            toast({
                title: 'Success',
                description: 'Event created successfully',
            });

            // Reset form
            setTitle('');
            setDescription('');
            setAbout('');
            setFlier(null);
            setStartDate('');
            setEndDate('');
            setHostWebsite('');
            onOpenChangeAction(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create event',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Create a new business event or workshop for the community.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter event title"
                            />
                        </div>

                        {/* Description */}
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

                        {/* Flier Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="flier">Event Flier</Label>
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
                                    <div className="mt-2 aspect-video max-w-xs relative overflow-hidden rounded-lg border">
                                        <img
                                            src={URL.createObjectURL(flier)}
                                            alt="Event flier preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        {/* Host Website */}
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

                        {/* About - Rich Text Editor */}
                        <div className="grid gap-2">
                            <Label htmlFor="about">About This Event</Label>
                            <div className="min-h-[200px]">
                                <QuillEditor value={about} onChange={setAbout} placeholder={'Provide detailed information about the event...'} />
                                {/*<ReactQuill*/}
                                {/*    theme="snow"*/}
                                {/*    value={about}*/}
                                {/*    onChange={setAbout}*/}
                                {/*    modules={quillModules}*/}
                                {/*    formats={quillFormats}*/}
                                {/*    placeholder="Provide detailed information about the event..."*/}
                                {/*    style={{ height: '150px', marginBottom: '50px' }}*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChangeAction(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createEventMutation.isPending}
                        >
                            {createEventMutation.isPending ? (
                                <>
                                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Create Event
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}