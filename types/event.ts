import {Resource} from "@/types/files";

export interface EventDto {
    id: string;
    title: string;
    flier?: string; // URL to the uploaded flier
    description: string;
    about: string; // Rich text content
    host: string;
    eventType: "CONFERENCE" | "CONCERT" | "WORKSHOP" | "MEETING" | "WEBINAR" | "OTHER";
    startDate: Date;
    endDate: Date;
    hostWebsite?: string;
    status: {
        state: string;
        rejectionReason: string;
        statusActionDate: string;
    }
    createdAt: string;
    updatedAt: string;
}

export interface EventMetadata {
    title: string;
    description: string;
    about: string;
    host: string;
    hostWebsite?: string;
    eventType: "CONFERENCE" | "CONCERT" | "WORKSHOP" | "MEETING" | "WEBINAR" | "OTHER";
    startDate: Date;
    endDate: Date;
}

export type EventListResponse = {
    count: number
    events: EventDto[]
}

export type CreateEventResponse = {
    message: string
    event: EventDto
}

