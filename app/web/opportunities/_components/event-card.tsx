import { EventItem } from "@/types/opportunities"
import {Button} from "@/components/ui/button";

export function EventCard({ ev }: { ev: EventItem }) {
    return (
        <div className="bg-card border border-border p-4 rounded-xl flex items-start gap-4 hover:shadow-xs transition">
            <div className="bg-red-50 text-red-600 flex flex-col items-center justify-center p-2 rounded-lg min-w-[50px]">
                <span className="text-[10px] font-bold tracking-wider leading-none">{ev.month}</span>
                <span className="text-xl font-black mt-0.5">{ev.day}</span>
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground line-clamp-1">{ev.title}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{ev.time}</p>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{ev.location}</p>
                <Button size="sm" variant="outline" className="mt-3 h-7 px-3 text-xs">Register</Button>
            </div>
        </div>
    )
}
