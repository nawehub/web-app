import {MessageCircle} from "lucide-react";
import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export function NewsletterWhatsapp () {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 dark:bg-background rounded-2xl p-6 lg:p-8 text-foreground grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4 space-y-1">
                    <h3 className="text-lg font-bold text-muted-foreground">Stay Updated with New Opportunities</h3>
                    <p className="text-xs text-slate-300">Subscribe to our newsletter for instant delivery ecosystem updates.</p>
                </div>
                <div className="lg:col-span-5 flex gap-0">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-2.5 rounded-l-lg text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-400"
                    />
                    <button className="bg-accent hover:bg-[hsl(var(--color-secondary-400))] text-white px-5 py-2.5 rounded-r-lg text-xs font-bold transition">
                        Subscribe
                    </button>
                </div>
                <div className="lg:col-span-3 flex items-center justify-start lg:justify-end gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                        <div className="text-xs font-bold">Join our WhatsApp Channel</div>
                        <div className="text-[10px] text-slate-300">Get snapshot updates instantly.</div>
                    </div>
                    <Link href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                        <div className="text-emerald-400"><MessageCircle size={32} fill="currentColor" className="text-[hsl(142_71%_45%)] stroke-[hsl(142_71%_45%)]" /></div>
                    </Link>
                </div>
            </div>
        </section>
    )
}