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

export default function ScrollPartners() {
    return (
        <div className="dashboard-slider flex items-center">
            <div className="w-full inline-flex flex-nowrap overflow-scroll"
                 style={{maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
                <ul className="flex items-center justify-center md:justify-start [&amp;_img]:max-w-none animate-scroll animate-marquee">
                    {partners.map((partner, idx) => (
                        <li key={idx} className="py-1 px-10 flex-shrink-0 position-relative">
                            <img alt={partner.name} loading="lazy" width="120" height="78" decoding="async"
                                 data-nimg="1"
                                 className="w-auto h-20 object-contain transition-opacity duration-200"
                                 src={partner.url}
                                 style={{color: 'transparent'}}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx>{`
               
                .marquee {
                    animation: marqueeScroll 35s linear infinite
                }
                
                .marquee:hover {
                    animation-play-state: paused
                }

                @keyframes marqueeScroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    )
}