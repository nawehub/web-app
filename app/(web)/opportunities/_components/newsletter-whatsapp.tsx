import { ArrowUpRight, MessageCircle } from "lucide-react";
import React from "react";
import Link from "next/link";
import { appMetadata } from "@/utils/app-metadata";
import { Reveal } from "@/components/motion/reveal";

// wa.me takes the number in international format without "+" or spaces.
const WHATSAPP_URL = `https://wa.me/${appMetadata.Authors.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi NaWeHub, I'd like to hear about new opportunities.",
)}`;

export function NewsletterWhatsapp() {
    return (
        <section className="mx-auto max-w-7xl space-y-4 px-4 pb-16 sm:px-6 lg:px-8">
            <Reveal className="grid grid-cols-1 items-center gap-6 rounded-2xl bg-gradient-to-r from-[hsl(var(--color-neutral-900))] to-[hsl(var(--color-neutral-800))] p-6 text-[hsl(var(--color-neutral-50))] lg:grid-cols-12 lg:p-8">
                <div className="space-y-1 lg:col-span-7">
                    <h3 className="text-lg font-bold [font-family:var(--font-display)]">Stay updated with new opportunities</h3>
                    <p className="text-sm text-[hsl(var(--color-neutral-300))]">
                        New grants, competitions and events are added as they&rsquo;re verified - check back often, or
                        message us on WhatsApp to ask about what&rsquo;s open for you.
                    </p>
                    <Link
                        href="/opportunities/all"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                        Browse all opportunities <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="flex items-center justify-start gap-4 border-t border-white/10 pt-4 lg:col-span-5 lg:justify-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div>
                        <div className="text-sm font-bold">Chat with us on WhatsApp</div>
                        <div className="text-xs text-[hsl(var(--color-neutral-300))]">{appMetadata.Authors.phone}</div>
                    </div>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat with NaWeHub on WhatsApp"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(142_71%_45%)] text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
                    >
                        <MessageCircle className="h-6 w-6" fill="currentColor" />
                    </a>
                </div>
            </Reveal>
        </section>
    )
}
