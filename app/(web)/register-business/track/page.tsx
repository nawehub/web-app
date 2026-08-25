import { Suspense } from "react"
import { FileSearch, Loader2 } from "lucide-react"
import TrackForm from "./_components/track-form"

export default function TrackRegistrationPage() {
    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-b from-primary-50 to-muted/40 dark:from-primary/10 dark:to-background">
                <div className="container mx-auto px-4 py-16 text-center sm:py-20">
                    <div className="mx-auto inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-accent">
                        <FileSearch className="h-3.5 w-3.5" />
                        Track Registration
                    </div>
                    <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold text-foreground [font-family:var(--font-display)] sm:text-5xl">
                        Track Your Business Registration
                    </h1>
                    <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                        Enter the tracking ID you received when you submitted your registration to see its current status.
                    </p>
                </div>
            </section>

            {/* Search + results */}
            <section className="py-12 sm:py-16">
                <div className="container mx-auto px-4">
                    <Suspense fallback={<Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />}>
                        <TrackForm />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
