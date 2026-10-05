import { Award, Crown } from "lucide-react";
import type { CompetitionEntrant } from "@/types/competition";
import { ordinal } from "./phase";

/** Announced entrants: winners with their rank, or a plain list for the shortlist and finalists. */
export function EntrantsList({ entrants, ranked = false, compact = false }: { entrants: CompetitionEntrant[]; ranked?: boolean; compact?: boolean }) {
    return (
        <ul className={compact ? "space-y-2" : "divide-y divide-border"}>
            {entrants.map((e) => (
                <li key={e.applicationId} className={`flex items-center gap-3 ${compact ? "" : "py-3"}`}>
                    {ranked && e.winnerRank ? (
                        <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                                e.winnerRank === 1 ? "bg-accent text-accent-foreground" : "bg-accent/15 text-accent"
                            }`}
                        >
                            {e.winnerRank === 1 ? <Crown className="h-4 w-4" /> : e.winnerRank}
                        </span>
                    ) : (
                        <Award className="h-5 w-5 shrink-0 text-primary" />
                    )}
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">{e.idea.ideaName}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                            {e.idea.applicantName}
                            {e.idea.applicantLocation ? ` · ${e.idea.applicantLocation}` : ""}
                        </span>
                    </span>
                    {ranked && e.winnerRank && <span className="text-xs font-semibold text-accent">{ordinal(e.winnerRank)}</span>}
                </li>
            ))}
        </ul>
    );
}
