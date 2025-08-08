import React from "react";

const partners = [
    // {name: "eWomen", url: "/images/partners/ewomen.png"},
    {name: "EU", url: "/images/partners/eu.png"},
    {name: "UNDP", url: "/images/partners/UNDP_logo.svg.png"},
    {name: "GIZ", url: "/images/partners/giz-Logo.gif"},
    {name: "SLEDP", url: "/images/partners/sledp.png"},
    {name: "SMEDA", url: "/images/partners/smeda.jpeg"},
    {name: "UNIMAK", url: "/images/partners/unimak.png"},
    {name: "EBK", url: "/images/partners/ebk.svg"},
    {name: "Government of Sierra Leone", url: "/images/partners/Coat_of_arm.svg.png"},
    {name: "ILO", url: "/images/partners/ilo.jpg"},
];

export default function DevelopmentPartners() {
    return (
        <section className="w-full">
            <div className="px-4">
                <div className="overflow-hidden relative">
                    <div className="flex gap-12 animat animate-scroll-partners whitespace-nowrap">
                        {partners.concat(partners).map((partner, idx) => (
                            <div
                                key={idx}
                                className="mx-8 flex flex-col items-center justify-center h-20 rounded-lg transition-all hover:scale-105"
                            >
                                <img
                                    src={partner.url}
                                    alt={partner.name + ' logo'}
                                    className={`h-20 max-w-[260px] object-contain grayscale hover:grayscale-0 transition duration-300`}
                                    loading="lazy"
                                />
                                {/*<div className="text-xs font-medium text-slate-600 text-center">{partner.name}</div>*/}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes scroll-partners {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }

                .animate-scroll-partners {
                    animation: scroll-partners 40s linear infinite;
                }
            `}</style>
        </section>
    );
}