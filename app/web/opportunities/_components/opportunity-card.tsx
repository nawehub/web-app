import {Opportunity} from "@/types/opportunities";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Bookmark, MapPin, Share2} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

export function OpportunityCard({opp}: { opp: Opportunity }) {
    const TypeIcon = opp.typeIcon
    return (
        <div
            className="flex shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
            {/* Image */}
            <div className="relative h-44 bg-muted">
                <img src={opp.image} alt={opp.title} className="h-full w-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                }}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

                {/* Top-left: Featured + New badges */}
                <div className="absolute left-3 top-3 flex gap-1.5">
                    {opp.isFeatured && <span
                        className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Featured</span>}
                    {opp.isNew && <span
                        className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">New</span>}
                </div>

                {/* Top-right: urgency badge */}
                {opp.urgencyBadge && (
                    <span
                        className={cn('absolute right-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white', opp.urgencyColor)}>
                        {opp.urgencyBadge}
                    </span>
                )}

                {/* Bottom-left: type icon badge */}
                <div
                    className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                    <TypeIcon className="h-4 w-4 text-primary"/>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{opp.type}</Badge>
                    <span>→</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>{opp.location}</span>
                </div>
                <h3 className="line-clamp-2 font-semibold text-foreground [font-family:var(--font-display)]">{opp.title}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{opp.description}</p>

                <div className="mt-auto space-y-1.5 text-xs">
                    {opp.funding && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Funding</span>
                            <span className="font-semibold text-primary">{opp.funding}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline</span>
                        <span className="font-semibold text-[hsl(var(--color-error))]">{opp.deadline}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href={`/web/opportunities/${opp.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
                    </Link>
                    <a href={opp.officialUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full text-xs">{opp.applyLabel}</Button>
                    </a>
                </div>

                <div className="flex items-end gap-3 border-t border-border pt-2 justify-end">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                        <Bookmark className="h-3.5 w-3.5"/> Save
                    </button>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                        <Share2 className="h-3.5 w-3.5"/> Share
                    </button>
                </div>
            </div>
        </div>
    )
}
