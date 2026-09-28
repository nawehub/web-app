import Link from "next/link"
import { EventItem } from "@/types/opportunities"
import { Button } from "@/components/ui/button"

export function EventCard({ ev }: { ev: EventItem }) {
    return (
        <div className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-md)]">
            <div className="flex min-w-[50px] flex-col items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-transform duration-300 group-hover:scale-105 dark:bg-red-950/40 dark:text-red-400">
                <span className="text-[10px] font-bold leading-none tracking-wider">{ev.month}</span>
                <span className="mt-0.5 text-xl font-black">{ev.day}</span>
            </div>
            <div className="min-w-0 space-y-1">
                <h4 className="line-clamp-2 text-xs font-bold text-foreground">{ev.title}</h4>
                {ev.time && <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">{ev.time}</p>}
                <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">{ev.location}</p>
                <Button size="sm" variant="outline" className="mt-3 h-7 px-3 text-xs" asChild>
                    <Link href={`/opportunities/${ev.id}`}>Register</Link>
                </Button>
            </div>
        </div>
    )
}
