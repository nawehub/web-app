'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
    Menu,
    X,
    ChevronDown,
    Sun,
    Moon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import {getStartedLinks, platformLinks} from "@/lib/navigations";
import {Logo} from "@/components/icons";

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return <div className="h-9 w-9" aria-hidden="true" />
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-neutral-700))] text-[hsl(var(--color-neutral-300))] transition-colors hover:border-[hsl(25_95%_53%)] hover:text-[hsl(25_95%_53%)]"
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    )
}

// ---------------------------------------------------------------------------
// Desktop "Get started" dropdown
// ---------------------------------------------------------------------------

function RegisterMenu() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', onClickOutside)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--color-secondary-400))] hover:shadow-[0_6px_20px_-6px_hsl(25_95%_53%/0.6)] active:translate-y-0"
            >
                Get started
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="animate-scale-in absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md border border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))] p-2 shadow-[var(--shadow-lg)]">
                    {getStartedLinks.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-[hsl(var(--color-neutral-200))] transition-colors hover:bg-[hsl(var(--color-neutral-800))] hover:text-[hsl(25_95%_53%)]"
                        >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-neutral-800))] text-[hsl(25_95%_53%)]">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

/** A section's nav item stays highlighted on its sub-pages (e.g. /opportunities/all). */
function isActive(pathname: string, href: string) {
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export default function Header() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Compact, shadowed bar once the page scrolls under it.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close the mobile menu after navigating (including back/forward).
    useEffect(() => setMobileOpen(false), [pathname])

    return (
        <header
            className={`sticky top-0 z-50 border-b border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))]/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-[0_8px_30px_-12px_rgb(0_0_0/0.6)]' : ''}`}
        >
            <div className={`container mx-auto flex items-center justify-between px-4 transition-[height] duration-300 ease-out ${scrolled ? 'h-16' : 'h-20'}`}>
                <Logo />

                {/* Desktop nav */}
                <nav className="hidden h-full items-center gap-8 lg:flex">
                    {platformLinks.map((link) => {
                        const active = isActive(pathname, link.href)
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                aria-current={active ? 'page' : undefined}
                                className={`relative flex h-full items-center text-sm font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-[hsl(25_95%_53%)] after:transition-transform after:duration-300 after:ease-out ${
                                    active
                                        ? 'text-[hsl(var(--color-neutral-50))] after:scale-x-100'
                                        : 'text-[hsl(var(--color-neutral-300))] after:scale-x-0 hover:text-[hsl(25_95%_53%)] hover:after:scale-x-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Desktop right cluster */}
                <div className="hidden items-center gap-5 lg:flex">
                    <Link
                        href="/register-business/track"
                        className="text-sm font-medium text-[hsl(var(--color-neutral-200))] transition-colors hover:text-[hsl(25_95%_53%)]"
                    >
                        Track Business
                    </Link>
                    <ThemeToggle />
                    <RegisterMenu />
                </div>

                {/* Mobile right cluster */}
                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-neutral-700))] text-[hsl(var(--color-neutral-200))]"
                    >
                        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            <AnimatePresence initial={false}>
            {mobileOpen && (
                <motion.div
                    key="mobile-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))] lg:hidden"
                >
                <div className="px-4 py-6">
                    <nav className="flex flex-col">
                        {platformLinks.map((link) => {
                            const active = isActive(pathname, link.href)
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`border-b border-[hsl(var(--color-neutral-800))] py-3 text-sm font-medium transition-colors last:border-none ${
                                        active ? 'text-[hsl(25_95%_53%)]' : 'text-[hsl(var(--color-neutral-200))]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <p className="mt-5 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--color-neutral-500))]">
                        Get started
                    </p>
                    <div className="mt-3 flex flex-col gap-1">
                        {getStartedLinks.map(({ label, href, icon: Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-sm py-2 text-sm text-[hsl(var(--color-neutral-200))] transition-colors hover:text-[hsl(25_95%_53%)]"
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-neutral-800))] text-[hsl(25_95%_53%)]">
                                  <Icon className="h-3.5 w-3.5" />
                                </span>
                                {label}
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/register-business/track"
                        onClick={() => setMobileOpen(false)}
                        className="mt-6 block rounded-sm border border-[hsl(var(--color-neutral-700))] py-2.5 text-center text-sm font-semibold text-[hsl(var(--color-neutral-50))]"
                    >
                        Track Business
                    </Link>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    )
}