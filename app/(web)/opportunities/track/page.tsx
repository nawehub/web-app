import { Suspense } from "react"
import { Loader2, SearchCheck } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import TrackOpportunityForm from "./_components/track-opportunity-form"

export default function TrackOpportunityPage() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                <Reveal className="container mx-auto px-4 py-16 text-center sm:py-20">
                    <div className="mx-auto inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                        <SearchCheck className="h-3.5 w-3.5" />
                        Track Your Opportunity
                    </div>
                    <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl">
                        Where&rsquo;s my <span className="text-primary">opportunity</span>?
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Enter the tracking ID we emailed you when you submitted your opportunity to see where it is in review.
                    </p>
                </Reveal>
            </section>

            {/* Search + results */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />}>
                        <TrackOpportunityForm />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
