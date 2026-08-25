'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTrackBusinessMutation } from "@/hooks/repository/use-business-tracking"
import TrackingResult from "./tracking-result"

export default function TrackForm() {
    const searchParams = useSearchParams()
    const prefilledId = searchParams.get("trackingId") ?? ""
    const [trackingId, setTrackingId] = useState(prefilledId)
    const track = useTrackBusinessMutation()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const id = trackingId.trim()
        if (!id) return
        track.mutate(id)
    }

    useEffect(() => {
        if (prefilledId.trim()) track.mutate(prefilledId.trim())
        // Only run once, for the initial deep-link - not on every keystroke.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <Label htmlFor="trackingId">Tracking ID</Label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <Input
                        id="trackingId"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        placeholder="e.g. BIZ-2026-000123"
                        className="h-12 flex-1 font-mono"
                        autoFocus
                    />
                    <Button type="submit" disabled={track.isPending || !trackingId.trim()} className="h-12 gap-2 sm:min-w-[140px]">
                        {track.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        {track.isPending ? "Searching..." : "Track"}
                    </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    You received this tracking ID when you submitted your business registration.
                </p>
            </form>

            {track.isError && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-5">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
                    <div>
                        <p className="font-medium text-foreground">We couldn&rsquo;t find that registration</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {track.error instanceof Error ? track.error.message : "Please check your tracking ID and try again."}
                        </p>
                    </div>
                </div>
            )}

            {track.isSuccess && (
                <div className="mt-8">
                    <TrackingResult data={track.data} />
                </div>
            )}
        </div>
    )
}
