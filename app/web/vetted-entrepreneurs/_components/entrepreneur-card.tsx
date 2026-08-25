import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { VettedEntrepreneur } from "@/types/entrepreneurs";

export function EntrepreneurCard({
    e,
    showFeaturedBadge = false,
}: {
    e: VettedEntrepreneur;
    showFeaturedBadge?: boolean;
}) {
    return (
        <Link
            href={`/web/vetted-entrepreneurs/${e.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
        >
            <div className="relative h-[165px] bg-muted">
                <div className="h-full overflow-hidden">
                    {e.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={e.photo}
                            alt={e.name}
                            className="h-full w-full object-cover object-[center_22%] scale-[1.08]"
                        />
                    ) : (
                        <div
                            className="grid h-full w-full place-items-center font-display text-[40px] font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${e.c1}, ${e.c2})` }}
                        >
                            {e.initials}
                        </div>
                    )}
                </div>
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-neutral-900/55 px-2.5 py-1 font-display text-[12px] font-bold text-white backdrop-blur-sm">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
                {showFeaturedBadge && (
                    <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 px-2.5 py-1 font-display text-[11px] font-bold text-amber-950 shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                <span className="relative z-10 -mt-5 mb-2 inline-flex h-[34px] max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-full border bg-card pl-2 pr-3 font-display text-[12.5px] font-bold text-foreground shadow-sm">
                    <span
                        className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md text-[11px] text-white"
                        style={{ background: e.c1 }}
                    >
                        {e.logoInitial}
                    </span>
                    <span className="truncate">{e.district}</span>
                </span>
                <h3 className="font-display text-[17px] font-bold text-foreground">{e.name}</h3>
                <div className="mt-0.5 font-display text-[13px] font-semibold text-primary">
                    {e.role}
                </div>
                <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {e.short}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                    {e.skills.slice(0, 2).map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-1 font-display text-[12.5px] font-semibold text-primary"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <Separator className="my-3.5" />
                <div className="mt-auto flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {e.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-display text-[13.5px] font-bold text-primary transition-all group-hover:gap-2.5">
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
