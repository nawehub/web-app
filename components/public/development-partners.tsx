import React from "react";

const partners = [
    {name: "eWomen", url: "/images/partners/ewomen.png"},
    {name: "World Bank", url: "/images/partners/worldbank.svg"},
    {name: "UNDP", url: "/images/partners/UNDP_logo.svg.png"},
    {name: "USAID", url: "/images/partners/usaid.png"},
    {name: "EU", url: "/images/partners/eu.png"},
    {name: "DFID", url: "/images/partners/dfid.png"},
    {name: "GIZ", url: "/images/partners/giz-Logo.gif"},
    {
        name: "AfDB",
        url: "https://www.afdb.org/sites/default/files/styles/scale_width_1200/public/2021-03/afdb-logo.png"
    },
    {name: "UN Women", url: "/images/partners/unwomen.png"},
    {name: "IFC", url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/IFC_logo.svg"},
    {name: "ECOWAS", url: "/images/partners/ecowas.png"},
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