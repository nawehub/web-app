"use client"

import {useEffect, useState} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {useSearchParams, useRouter} from "next/navigation"
import Link from "next/link"
import {Heart, ArrowRight, Home, Share2, Check} from "lucide-react"
import {Button} from "@/components/ui/button"
import AppHeader from "@/components/public/app-header"
import {useIsMobile} from "@/hooks/use-mobile"

// ─── Confetti particle ────────────────────────────────────────────────────────
interface Particle {
    id: number
    x: number
    y: number
    rotation: number
    scale: number
    color: string
    duration: number
    delay: number
    drift: number
}

const COLORS = [
    "#22c55e", // green
    "#f59e0b", // gold
    "#10b981", // emerald
    "#fbbf24", // amber
    "#4ade80", // light green
    "#fcd34d", // light gold
    "#ffffff",
]

function useParticles(count = 60) {
    const [particles, setParticles] = useState<Particle[]>([])
    useEffect(() => {
        setParticles(
            Array.from({length: count}, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                scale: 0.4 + Math.random() * 0.8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 1.2,
                drift: (Math.random() - 0.5) * 30,
            }))
        )
    }, [count])
    return particles
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function CountUp({target, duration = 1800}: {target: number; duration?: number}) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        const start = performance.now()
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
        }
        const raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [target, duration])
    return <>{value.toLocaleString()}</>
}

// ─── Ripple ring ─────────────────────────────────────────────────────────────
function RippleRings() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border border-emerald-400/30"
                    initial={{width: 80, height: 80, opacity: 0.8}}
                    animate={{width: 320, height: 320, opacity: 0}}
                    transition={{
                        duration: 2.4,
                        delay: i * 0.6,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ContributionSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isMobile = useIsMobile()
    const contributionId = searchParams.get("id")
    const particles = useParticles(70)
    const [shared, setShared] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Slight delay so mount animation feels intentional
        const t = setTimeout(() => setVisible(true), 80)
        return () => clearTimeout(t)
    }, [])

    const handleShare = async () => {
        const text = "I just contributed to my district's development through Love Your District! 🇸🇱❤️ Join me in building Sierra Leone — one Leone at a time."
        if (navigator.share) {
            await navigator.share({title: "Love Your District", text})
        } else {
            await navigator.clipboard.writeText(text)
        }
        setShared(true)
        setTimeout(() => setShared(false), 2500)
    }

    // stagger config
    const stagger = (i: number) => ({
        initial: {opacity: 0, y: 24},
        animate: {opacity: 1, y: 0},
        transition: {duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" as const},
    })

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white selection:bg-emerald-500/30">
            <AppHeader isVisible={true}/>

            {/* ── Deep layered background ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Radial glow centre */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(16,185,129,0.12),transparent)]"/>
                {/* Top gold sweep */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"/>
                {/* Bottom vignette */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950 to-transparent"/>
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            {/* ── Confetti ── */}
            <AnimatePresence>
                {visible && particles.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute pointer-events-none"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: 8 * p.scale,
                            height: 8 * p.scale,
                            backgroundColor: p.color,
                            borderRadius: p.id % 3 === 0 ? "50%" : p.id % 3 === 1 ? "2px" : "0",
                            rotate: p.rotation,
                        }}
                        initial={{y: 0, opacity: 1, x: 0}}
                        animate={{
                            y: "110vh",
                            opacity: [1, 1, 0],
                            x: p.drift * 10,
                            rotate: p.rotation + 360 * (p.id % 2 === 0 ? 1 : -1),
                        }}
                        transition={{
                            duration: p.duration,
                            delay: p.delay,
                            ease: "easeIn",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* ── Content ── */}
            <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 ${isMobile ? "pt-24 pb-12" : "pt-20 pb-16"}`}>

                {/* Icon with ripple */}
                <motion.div
                    className="relative mb-10"
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    transition={{duration: 0.5, delay: 0.1, type: "spring", stiffness: 200, damping: 16}}
                >
                    <RippleRings/>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                        <motion.div
                            initial={{scale: 0, rotate: -30}}
                            animate={{scale: 1, rotate: 0}}
                            transition={{delay: 0.4, type: "spring", stiffness: 260, damping: 18}}
                        >
                            <Check className="w-10 h-10 text-white stroke-[2.5]"/>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Label */}
                <motion.p
                    className="text-emerald-400 text-sm font-semibold tracking-[0.2em] uppercase mb-3"
                    {...stagger(0)}
                >
                    Payment Confirmed
                </motion.p>

                {/* Hero headline — serif for emotional weight */}
                <motion.h1
                    className="text-center font-serif font-bold leading-tight mb-4"
                    style={{fontSize: isMobile ? "2.4rem" : "3.6rem", letterSpacing: "-0.02em"}}
                    {...stagger(1)}
                >
                    <span className="text-white">Thank you for </span>
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                        loving
                    </span>
                    <br/>
                    <span className="text-white">your district. </span>
                    <span className="inline-block">🇸🇱</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    className="text-zinc-400 text-center max-w-md text-base leading-relaxed mb-10"
                    {...stagger(2)}
                >
                    Your contribution has been received and will go directly towards
                    development projects that transform communities across Sierra Leone.
                </motion.p>

                {/* Stat card */}
                <motion.div
                    className="relative mb-10 w-full max-w-sm"
                    {...stagger(3)}
                >
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-6 text-center overflow-hidden">
                        {/* Inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none rounded-2xl"/>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">You've joined</p>
                        <p className="text-5xl font-bold font-serif text-white mb-1">
                            <CountUp target={12847}/>
                        </p>
                        <p className="text-zinc-400 text-sm">Sierra Leoneans building a better future</p>
                        <div className="mt-4 flex items-center justify-center gap-1.5">
                            {Array.from({length: 5}).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-emerald-500"
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    transition={{delay: 1.2 + i * 0.08, type: "spring"}}
                                />
                            ))}
                            <span className="text-zinc-500 text-xs ml-1">and counting</span>
                        </div>
                    </div>
                </motion.div>

                {/* Contribution ID */}
                {contributionId && (
                    <motion.p
                        className="text-zinc-600 text-xs font-mono mb-8 text-center"
                        {...stagger(4)}
                    >
                        Reference: <span className="text-zinc-400">{contributionId}</span>
                    </motion.p>
                )}

                {/* Actions */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
                    {...stagger(5)}
                >
                    <Button
                        onClick={handleShare}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white font-medium gap-2 transition-all"
                    >
                        {shared
                            ? <><Check className="w-4 h-4 text-emerald-400"/> Copied!</>
                            : <><Share2 className="w-4 h-4"/> Share the love</>
                        }
                    </Button>

                    <Link href="/lyd" className="flex-1">
                        <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-900/40 transition-all">
                            <Home className="w-4 h-4"/>
                            Back to LYD Dashboard
                        </Button>
                    </Link>
                </motion.div>

                {/* Secondary link */}
                <motion.div {...stagger(6)} className="mt-6">
                    <Link
                        href="/lyd/projects"
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm transition-colors group"
                    >
                        Explore district projects
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </motion.div>

                {/* Bottom flourish */}
                <motion.div
                    className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 pointer-events-none"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 1.6, duration: 1}}
                >
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-zinc-700"/>
                    <Heart className="w-3 h-3 text-zinc-700 fill-zinc-700"/>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-zinc-700"/>
                </motion.div>
            </div>
        </div>
    )
}