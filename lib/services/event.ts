import {api4app, api4FileUpload} from "@/lib/api4app";
import {CreateEventResponse, EventDto, EventListResponse} from "@/types/event";

export const eventService = () => {
    return {
        event: {
            listAllEvents: async () => {
                const response = await api4app('/events', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                return response as Promise<EventListResponse>
            },
            getEvent: async (eventId: string) => {
                const response = await api4app('/events/' + eventId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                return response as Promise<EventDto>
            },
            createEvent: async (data: FormData) => {
                const response = await api4FileUpload('/events', {
                    method: 'POST',
                    body: data,
                })
                return response as Promise<CreateEventResponse>
            }
        }

    }
}