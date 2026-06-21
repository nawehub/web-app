import React from "react";

const partners = [
    { name: "EU", url: "/images/partners/eu.png" },
    { name: "UNDP", url: "/images/partners/UNDP_logo.svg.png" },
    { name: "GIZ", url: "/images/partners/giz-Logo.gif" },
    { name: "SLEDP", url: "/images/partners/sledp.png" },
    { name: "SMEDA", url: "/images/partners/smeda.jpeg" },
    { name: "UNIMAK", url: "/images/partners/unimak.png" },
    { name: "EBK", url: "/images/partners/ebk.svg" },
    { name: "Government of Sierra Leone", url: "/images/partners/Coat_of_arm.svg.png" },
    { name: "ILO", url: "/images/partners/ilo.jpg" },
];

const FADE_CLASSES = {
    muted: { left: "from-muted", right: "from-muted" },
    background: { left: "from-background", right: "from-background" },
} as const

export default function ScrollPartners({ fadeFrom = "muted" }: { fadeFrom?: keyof typeof FADE_CLASSES }) {
    return (
        <div className="relative overflow-hidden">
            <ul className="flex w-max animate-scroll items-center [&_img]:max-w-none">
                {[...partners, ...partners].map((partner, idx) => (
                    <li key={`${partner.name}-${idx}`} className="flex-shrink-0 px-10 py-2">
                        <img
                            alt={partner.name}
                            loading="lazy"
                            width={120}
                            height={64}
                            className="h-16 w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                            src={partner.url}
                        />
                    </li>
                ))}
            </ul>

            <div
                className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r ${FADE_CLASSES[fadeFrom].left} to-transparent sm:w-32`}
            />
            <div
                className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l ${FADE_CLASSES[fadeFrom].right} to-transparent sm:w-32`}
            />
        </div>
    );
}