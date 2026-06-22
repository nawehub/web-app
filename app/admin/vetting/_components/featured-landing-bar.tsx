"use client";

import { useState } from "react";
import { ChevronDown, GripVertical, Plus, Star, X } from "lucide-react";
import { EntrepreneurProfile } from "@/app/dashboard/user-settings/_data/profile";
import { FEATURED_SLOT_COUNT } from "@/lib/featured-entrepreneurs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AVATAR_COLORS, initials } from "../_data/vetting";
import { cn } from "@/lib/utils";

export type FeaturedCandidate = {
    id: string;
    name: string;
    venture?: string;
};

interface FeaturedLandingBarProps {
    featuredIds: string[];
    profiles: Record<string, EntrepreneurProfile>;
    availableCandidates: FeaturedCandidate[];
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
}

export function FeaturedLandingBar({
    featuredIds,
    profiles,
    availableCandidates,
    onAdd,
    onRemove,
    onReorder,
}: FeaturedLandingBarProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const slots = Array.from({ length: FEATURED_SLOT_COUNT }, (_, i) => featuredIds[i] ?? null);
    const slotsFull = featuredIds.length >= FEATURED_SLOT_COUNT;

    const handleDrop = (toSlot: number) => {
        if (dragIndex === null) {
            setOverIndex(null);
            return;
        }
        const target = Math.min(toSlot, featuredIds.length - 1);
        if (dragIndex !== target) {
            onReorder(dragIndex, target);
        }
        setDragIndex(null);
        setOverIndex(null);
    };

    return (
        <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/80 to-card p-4 shadow-sm dark:border-amber-800/50 dark:from-amber-950/40 sm:p-5">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <h2 className="font-display text-[15px] font-extrabold text-foreground">
                        Featured on landing page
                    </h2>
                </div>
                <span className="font-display text-[12.5px] font-semibold text-muted-foreground">
                    {featuredIds.length}/{FEATURED_SLOT_COUNT}
                    <span className="mx-1.5 text-border">·</span>
                    drag to reorder
                    {!slotsFull && (
                        <>
                            <span className="mx-1.5 text-border">·</span>
                            pick vetted entrepreneurs to fill slots
                        </>
                    )}
                </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {slots.map((id, slotIndex) => {
                    if (!id) {
                        return (
                            <EmptyFeaturedSlot
                                key={`empty-${slotIndex}`}
                                slotIndex={slotIndex}
                                candidates={availableCandidates}
                                onAdd={onAdd}
                                onDragOver={(e) => {
                                    if (dragIndex === null) return;
                                    e.preventDefault();
                                    setOverIndex(slotIndex);
                                }}
                                onDragLeave={() => setOverIndex(null)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleDrop(slotIndex);
                                }}
                                isDropTarget={
                                    overIndex === slotIndex && dragIndex !== null
                                }
                            />
                        );
                    }

                    const profile = profiles[id];
                    const av = AVATAR_COLORS[id] ?? ["#78716b", "#44403a"];
                    const name = profile?.name ?? id;
                    const rank = featuredIds.indexOf(id) + 1;

                    return (
                        <div
                            key={id}
                            draggable
                            onDragStart={() => setDragIndex(slotIndex)}
                            onDragEnd={() => {
                                setDragIndex(null);
                                setOverIndex(null);
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOverIndex(slotIndex);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleDrop(slotIndex);
                            }}
                            className={cn(
                                "group flex min-h-[52px] items-center gap-2 rounded-xl border bg-card px-2 py-2 shadow-sm transition-shadow",
                                "border-amber-200/90 hover:shadow-md dark:border-amber-800/60",
                                dragIndex === slotIndex && "opacity-50",
                                overIndex === slotIndex &&
                                    dragIndex !== null &&
                                    dragIndex !== slotIndex &&
                                    "ring-2 ring-amber-400"
                            )}
                        >
                            <SlotRankBadge rank={rank} />
                            <EntrepreneurAvatar id={id} name={name} colors={av} />
                            <span className="min-w-0 flex-1 truncate font-display text-[13px] font-bold text-foreground">
                                {name}
                            </span>
                            <button
                                type="button"
                                className="cursor-grab touch-none p-1 text-muted-foreground opacity-60 hover:opacity-100 active:cursor-grabbing"
                                aria-label={`Drag ${name}`}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <GripVertical className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(id)}
                                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                aria-label={`Remove ${name} from featured`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function SlotRankBadge({ rank, muted = false }: { rank: number; muted?: boolean }) {
    return (
        <span
            className={cn(
                "grid h-6 w-6 shrink-0 place-items-center rounded-md font-display text-[11px] font-extrabold",
                muted
                    ? "border border-dashed border-amber-300/80 text-amber-700/70 dark:border-amber-700/50 dark:text-amber-400/70"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
            )}
        >
            {rank}
        </span>
    );
}

function EntrepreneurAvatar({
    id,
    name,
    colors,
    placeholder = false,
}: {
    id: string;
    name: string;
    colors?: [string, string];
    placeholder?: boolean;
}) {
    const av = colors ?? AVATAR_COLORS[id] ?? ["#78716b", "#44403a"];

    if (placeholder) {
        return (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-dashed border-amber-300/70 bg-background text-amber-600/70 dark:border-amber-700/50 dark:text-amber-400/70">
                <Plus className="h-3.5 w-3.5" />
            </span>
        );
    }

    return (
        <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
            style={{
                background: `linear-gradient(135deg, ${av[0]}, ${av[1]})`,
            }}
        >
            {initials(name)}
        </span>
    );
}

function CandidateLabel({
    candidate,
    compact = false,
}: {
    candidate: FeaturedCandidate;
    compact?: boolean;
}) {
    return (
        <div className="flex min-w-0 flex-1 items-center gap-2">
            <EntrepreneurAvatar id={candidate.id} name={candidate.name} />
            <span className="min-w-0 flex-1 text-left">
                <span className="block truncate font-display text-[13px] font-bold text-foreground">
                    {candidate.name}
                </span>
                {candidate.venture && !compact && (
                    <span className="block truncate text-[11.5px] font-medium text-muted-foreground">
                        {candidate.venture}
                    </span>
                )}
            </span>
        </div>
    );
}

function EmptyFeaturedSlot({
    slotIndex,
    candidates,
    onAdd,
    onDragOver,
    onDragLeave,
    onDrop,
    isDropTarget,
}: {
    slotIndex: number;
    candidates: FeaturedCandidate[];
    onAdd: (id: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    isDropTarget: boolean;
}) {
    const [selectKey, setSelectKey] = useState(0);
    const hasCandidates = candidates.length > 0;

    return (
        <div
            className={cn(
                "min-h-[52px] rounded-xl border-2 border-dashed border-amber-200/80 bg-background/70 transition-colors dark:border-amber-800/50",
                isDropTarget && "border-amber-400 bg-amber-50 dark:bg-amber-950/50",
                hasCandidates && "hover:border-amber-300 hover:bg-background dark:hover:border-amber-700"
            )}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Select
                key={selectKey}
                disabled={!hasCandidates}
                onValueChange={(id) => {
                    onAdd(id);
                    setSelectKey((k) => k + 1);
                }}
            >
                <SelectTrigger
                    aria-label={`Add entrepreneur to slot ${slotIndex + 1}`}
                    className={cn(
                        "h-auto min-h-[52px] w-full gap-2 rounded-xl border-0 bg-transparent px-2 py-2 shadow-none",
                        "font-display text-[13px] font-bold text-foreground",
                        "focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-0",
                        "disabled:cursor-not-allowed disabled:opacity-100",
                        "[&>svg:last-child]:ml-auto [&>svg:last-child]:h-4 [&>svg:last-child]:w-4 [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-muted-foreground"
                    )}
                >
                    <SlotRankBadge rank={slotIndex + 1} muted />
                    <EntrepreneurAvatar id={`empty-${slotIndex}`} name="" placeholder />
                    <SelectValue
                        placeholder={
                            <span className="truncate font-display text-[13px] font-bold text-muted-foreground">
                                {hasCandidates
                                    ? "Add vetted entrepreneur…"
                                    : "No vetted entrepreneurs available"}
                            </span>
                        }
                    />
                </SelectTrigger>

                <SelectContent
                    className="overflow-hidden rounded-xl border-amber-200/80 p-1.5 shadow-lg dark:border-amber-800/60"
                    position="popper"
                    sideOffset={6}
                >
                    {candidates.map((candidate) => (
                        <SelectItem
                            key={candidate.id}
                            value={candidate.id}
                            className={cn(
                                "cursor-pointer rounded-lg py-2 pl-2 pr-3",
                                "focus:bg-amber-50 dark:focus:bg-amber-950/50",
                                "[&>span:first-child]:hidden"
                            )}
                        >
                            <CandidateLabel candidate={candidate} />
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
