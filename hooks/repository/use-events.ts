'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api4app, api4FileUpload } from '@/lib/api4app';

export interface Event {
    id: string;
    title: string;
    flier?: string; // URL to the uploaded flier
    description: string;
    about: string; // Rich text content
    host: string;
    type: "CONFERENCE" | "CONCERT" | "WORKSHOP" | "MEETING" | "WEBINAR" | "OTHER";
    startDate: string;
    endDate: string;
    hostWebsite?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventData {
    title: string;
    flier: File;
    description: string;
    about: string;
    host: string;
    type: "CONFERENCE" | "CONCERT" | "WORKSHOP" | "MEETING" | "WEBINAR" | "OTHER";
    startDate: Date;
    endDate: Date;
    hostWebsite?: string;
}

// Events
export function useEventsQuery(status: 'open' | 'closed' | 'all' = 'open') {
    return useQuery({
        queryKey: ['events', status],
        queryFn: async () => {
            const params = status !== 'all' ? `?status=${status}` : '';
            const response = await api4app(`/api/events${params}`);
            return response.data as Event[];
        },
    });
}

export function useEventQuery(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const response = await api4app(`/api/events/${id}`);
            return response.data as Event;
        },
        enabled: !!id,
    });
}

export function useCreateEventMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api4FileUpload('/api/events', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] }).then();
        },
    });
}