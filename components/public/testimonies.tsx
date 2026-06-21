import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { testimonials } from "@/types/testimonies";

const BRAND_GRADIENT =
    'linear-gradient(90deg, #F0A03C 0%, #E94FA8 25%, #BC2AD5 50%, #1F8FE0 75%, #13BF97 100%)'

type Testimonial = (typeof testimonials)[number]

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <div className="w-96 flex-shrink-0 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 shadow-[var(--shadow-lg)] transition-shadow duration-300 hover:shadow-[var(--shadow-xl)]">
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-background"
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                        <Quote className="h-3 w-3 text-accent-foreground" />
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground [font-family:var(--font-display)]">
                        {testimonial.name}
                    </p>
                    <p className="truncate text-sm font-medium text-primary">{testimonial.position}</p>
                    <p className="truncate text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
            </div>
            <blockquote className="mt-4 line-clamp-6 leading-relaxed text-foreground/80">
                &ldquo;{testimonial.message}&rdquo;
            </blockquote>
        </div>
    );
}

export default function Testimonies() {
    return (
        <section id="testimonials" className="overflow-hidden py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                        <Quote className="mr-2 h-4 w-4" />
                        What Our Community Says
                    </Badge>
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground [font-family:var(--font-display)] sm:text-4xl">
                        Trusted by Leaders Across{' '}
                        <span style={{ backgroundImage: BRAND_GRADIENT }} className="bg-clip-text text-transparent">
                            Sierra Leone
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From entrepreneurs to government officials, see how NaWeHub is transforming
                        communities and businesses.
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className="flex animate-scroll gap-6">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
                    ))}
                </div>

                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-32" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-32" />
            </div>
        </section>
    );
}