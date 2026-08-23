import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ArrowLeft, ArrowUpRight, BadgeCheck, Banknote, CalendarDays, CheckCircle2, Clock3, MapPin, Sparkles} from 'lucide-react'
import {OPPORTUNITIES} from '@/lib/database/opportunities'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

type Props = {params: Promise<{id: string}>}

export function generateStaticParams() {
    return OPPORTUNITIES.map(({id}) => ({id}))
}

export default async function OpportunityDetailsPage({params}: Props) {
    const {id} = await params
    const opportunity = OPPORTUNITIES.find((item) => item.id === id)
    if (!opportunity) notFound()
    const TypeIcon = opportunity.typeIcon

    return <main className="min-h-screen bg-muted/30">
        <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))] text-white">
            <div className="absolute inset-0 opacity-25">
                <img src={opportunity.image} alt="" className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60"/>
            </div>
            <div className="container relative mx-auto px-4 py-12 lg:py-16">
                <Link href="/web/opportunities" className="mb-8 inline-flex items-center gap-2 text-sm text-white/70 hover:text-primary"><ArrowLeft className="h-4 w-4"/>Back to opportunities</Link>
                <div className="max-w-4xl space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground"><TypeIcon className="mr-1 h-3.5 w-3.5"/>{opportunity.type}</Badge>
                        {opportunity.isFeatured && <Badge variant="secondary"><Sparkles className="mr-1 h-3.5 w-3.5"/>Featured</Badge>}
                        <span className="inline-flex items-center gap-1 text-sm text-white/70"><BadgeCheck className="h-4 w-4 text-primary"/>Verified opportunity</span>
                    </div>
                    <h1 className="text-3xl font-semibold leading-tight [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">{opportunity.title}</h1>
                    <p className="max-w-3xl text-lg leading-7 text-white/75">{opportunity.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/>{opportunity.location}</span>
                        <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary"/>Deadline: {opportunity.deadline}</span>
                        <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary"/>Posted {opportunity.postedDate}</span>
                    </div>
                </div>
            </div>
        </section>

        <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-7">
                <InfoSection title="About this opportunity"><p className="leading-7 text-muted-foreground">{opportunity.description} This opportunity helps promising applicants strengthen their work, expand their reach, and connect with a wider network of partners and experts.</p></InfoSection>
                <InfoSection title="Who can apply"><ul className="space-y-3">{opportunity.eligibility.map((item) => <li key={item} className="flex gap-3 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary"/>{item}</li>)}</ul></InfoSection>
                <InfoSection title="What you receive"><div className="grid gap-3 sm:grid-cols-2">{opportunity.benefits.map((item) => <div key={item} className="rounded-xl bg-primary/5 p-4 text-sm font-medium"><Sparkles className="mb-2 h-5 w-5 text-primary"/>{item}</div>)}</div></InfoSection>
                <InfoSection title="How to apply"><ol className="space-y-4">{opportunity.applicationSteps.map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{index + 1}</span><span className="pt-1 text-muted-foreground">{step}</span></li>)}</ol></InfoSection>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <p className="text-sm text-muted-foreground">Offered by</p><p className="mt-1 font-semibold">{opportunity.provider}</p>
                    <div className="my-5 space-y-4 border-y py-5 text-sm">
                        {opportunity.funding && <Detail icon={<Banknote/>} label="Funding" value={opportunity.funding}/>} 
                        <Detail icon={<CalendarDays/>} label="Deadline" value={opportunity.deadline}/>
                        <Detail icon={<MapPin/>} label="Location" value={opportunity.location}/>
                    </div>
                    <a href={opportunity.officialUrl} target="_blank" rel="noopener noreferrer"><Button size="lg" className="w-full">{opportunity.applyLabel}<ArrowUpRight className="h-4 w-4"/></Button></a>
                    <p className="mt-3 text-center text-xs text-muted-foreground">You’ll continue on the official opportunity website.</p>
                </div>
            </aside>
        </div>
    </main>
}

function InfoSection({title, children}: {title: string, children: React.ReactNode}) {
    return <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h2 className="mb-5 text-xl font-semibold [font-family:var(--font-display)]">{title}</h2>{children}</section>
}

function Detail({icon, label, value}: {icon: React.ReactElement, label: string, value: string}) {
    return <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}{label}</span><strong className="text-right">{value}</strong></div>
}
