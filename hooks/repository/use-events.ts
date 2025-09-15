'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {eventService, approveOrRejectEventForm} from "@/lib/services/event";
import {z} from "zod";

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

export function useApproveRejectEventMutation(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['approve-reject-event', id],
        mutationFn: async (data: z.infer<typeof approveOrRejectEventForm>) => eventService().event.approveRejectEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', 'event', id] }).then();
        },
    });
}