'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIdeaTrackingQuery } from "@/hooks/repository/use-idea-submission"
import IdeaTrackingResult from "./idea-tracking-result"

export default function TrackIdeaForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const prefilledId = (searchParams.get("trackingId") ?? "").trim()
    const [input, setInput] = useState(prefilledId)
    // The looked-up ID lives in the URL, so a result can be bookmarked or shared (e.g. from the email link).
    const tracking = useIdeaTrackingQuery(prefilledId || null)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const id = input.replace(/\s+/g, "")
        if (!id) return
        router.replace(`/next-big-idea/track?trackingId=${encodeURIComponent(id)}`, { scroll: false })
    }

    return (
        <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] sm:p-8">
                <Label htmlFor="trackingId">Tracking ID</Label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    {/* Input renders inside its own wrapper div - size the wrapper, not the input. */}
                    <div className="flex-1">
                        <Input
                            id="trackingId"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 0123456789"
                            inputMode="numeric"
                            maxLength={14}
                            className="h-12 w-full font-mono tracking-widest"
                            autoFocus={!prefilledId}
                        />
                    </div>
                    <Button type="submit" disabled={tracking.isFetching || !input.trim()} className="h-12 gap-2 sm:min-w-[140px]">
                        {tracking.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        {tracking.isFetching ? "Searching..." : "Track"}
                    </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    Your 10-digit tracking ID is in the confirmation email we sent when you submitted your idea.
                </p>
            </form>

            {tracking.isError && (
                <div className="animate-fade-in-up mt-6 flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-5">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
                    <div>
                        <p className="font-medium text-foreground">We couldn&rsquo;t find that idea</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {tracking.error instanceof Error ? tracking.error.message : "Please check your tracking ID and try again."}
                        </p>
                    </div>
                </div>
            )}

            {tracking.data && !tracking.isError && (
                <div className="mt-8">
                    <IdeaTrackingResult data={tracking.data} />
                </div>
            )}
        </div>
    )
}
