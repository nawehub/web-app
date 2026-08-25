import {Bell, Bookmark, Share2, ShieldCheck} from "lucide-react";
import React from "react";

export function ValuePositionBanner () {
    return (
        <section className="border-y border border-border bg-background py-10 my-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: ShieldCheck, title: "Verified Opportunities", desc: "All listings are vetted directly by NaWeHub.", color: "text-emerald-500" },
                    { icon: Bell, title: "Never Miss Out", desc: "Enable customized alert updates on new grants.", color: "text-blue-500" },
                    { icon: Bookmark, title: "Save & Track", desc: "Bookmark opportunities and applications milestones.", color: "text-rose-500" },
                    { icon: Share2, title: "Share Opportunities", desc: "Spread value inside your network with single-clicks.", color: "text-amber-500" }
                ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <div className={`${item.color} p-2 bg-slate-50 rounded-xl h-fit`}>
                            <item.icon size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-normal">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}