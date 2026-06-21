import Link from "next/link";
import Image from "next/image";

type IconProps = { className?: string }

export function FacebookGlyph({className}: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <path d="M14 9h-2a2 2 0 0 0-2 2v9"/>
            <path d="M9 13h4"/>
        </svg>
    )
}

export function XGlyph({className}: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <line x1="8" y1="8" x2="16" y2="16"/>
            <line x1="16" y1="8" x2="8" y2="16"/>
        </svg>
    )
}

export function InstagramGlyph({className}: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/>
        </svg>
    )
}

export function LinkedinGlyph({className}: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
             strokeLinejoin="round" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <line x1="7.5" y1="10.5" x2="7.5" y2="16"/>
            <circle cx="7.5" cy="7.3" r="0.6" fill="currentColor" stroke="none"/>
            <path d="M11 16v-3.5a2 2 0 0 1 4 0V16"/>
            <line x1="11" y1="10.5" x2="11" y2="16"/>
        </svg>
    )
}

// ---------------------------------------------------------------------------
// Cloth border (same signature divider as the rest of the build)
// ---------------------------------------------------------------------------

interface ClothBorderProps {
    fillTone?: string;
    fillUrl?: string;
}

export function ClothBorder({fillTone = "hsl(25 95% 53%)", fillUrl = "#footer-cloth-border"}: ClothBorderProps) {
    return (
        <div className="h-3 w-full overflow-hidden" aria-hidden="true">
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <pattern id={fillUrl} width="24" height="12" patternUnits="userSpaceOnUse">
                    <path d="M0 6 L12 0 L24 6 L12 12 Z" fill={fillTone} fillOpacity="0.55"/>
                </pattern>
                <rect width="100%" height="100%" fill={`url(#${fillUrl})`}/>
            </svg>
        </div>
    )
}

// The same orange → pink → purple → blue → teal sweep sampled from the
// "Hub" lettering in the source logo file
export const BRAND_GRADIENT =
    'linear-gradient(90deg, #F0A03C 0%, #E94FA8 25%, #BC2AD5 50%, #1F8FE0 75%, #13BF97 100%)'

export function Logo() {
    return (
        <Link href="/web" className="flex shrink-0 items-center gap-2.5">
            <Image
                src="/nawehub-mark.png"
                alt="NaWeHub"
                width={164}
                height={180}
                priority
                className="h-9 w-auto"
            />
            <span
                className="text-xl font-semibold [font-family:var(--font-display)] text-[hsl(var(--color-neutral-50))]">
                NaWe
                <span style={{backgroundImage: BRAND_GRADIENT}} className="bg-clip-text text-transparent">
                  Hub
                </span>
            </span>
        </Link>
    )
}