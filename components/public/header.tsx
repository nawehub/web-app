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
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={open}
                className="inline-flex items-center gap-1.5 rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[hsl(var(--color-secondary-400))]"
            >
                Get started
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 z-10 mt-2 w-72 rounded-md border border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))] p-2 shadow-[var(--shadow-lg)]">
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

export default function Header() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header
            className={`sticky top-0 z-50 border-b border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))]/95 backdrop-blur-md`}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <Logo />

                {/* Desktop nav */}
                <nav className="hidden h-full items-center gap-8 lg:flex">
                    {platformLinks.map((link) => {
                        const active = pathname === link.href
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`flex h-full items-center border-b-2 text-sm font-medium transition-colors ${
                                    active
                                        ? 'border-[hsl(25_95%_53%)] text-[hsl(var(--color-neutral-50))]'
                                        : 'border-transparent text-[hsl(var(--color-neutral-300))] hover:border-[hsl(var(--color-neutral-700))] hover:text-[hsl(25_95%_53%)]'
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
                        href="/web/login"
                        className="text-sm font-medium text-[hsl(var(--color-neutral-200))] transition-colors hover:text-[hsl(25_95%_53%)]"
                    >
                        Login
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
            {mobileOpen && (
                <div className="border-t border-[hsl(var(--color-neutral-800))] bg-[hsl(var(--color-neutral-900))] px-4 py-6 lg:hidden">
                    <nav className="flex flex-col">
                        {platformLinks.map((link) => {
                            const active = pathname === link.href
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
                        href="/web/login"
                        onClick={() => setMobileOpen(false)}
                        className="mt-6 block rounded-sm border border-[hsl(var(--color-neutral-700))] py-2.5 text-center text-sm font-semibold text-[hsl(var(--color-neutral-50))]"
                    >
                        Login / Sign in
                    </Link>
                </div>
            )}
        </header>
    )
}