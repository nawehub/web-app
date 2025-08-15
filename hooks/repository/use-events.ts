'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {eventService} from "@/lib/services/event";

// Events
export function useEventsQuery() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => await eventService().event.listAllEvents()
    });
}

export function useEventQuery(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async () => eventService().event.getEvent(id),
        enabled: !!id,
    });
}

export function useCreateEventMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-event'],
        mutationFn: async (formData: FormData) => {
            return eventService().event.createEvent(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] }).then();
        },
    });
}