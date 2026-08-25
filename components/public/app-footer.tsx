import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {ClothBorder, Logo} from "@/components/icons";
import {getStartedLinks, platformLinks, socials} from "@/lib/navigations";

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer
            className={`[font-family:var(--font-body)] bg-[hsl(var(--color-neutral-900))] text-[hsl(var(--color-neutral-50))]`}
        >
            <ClothBorder />

            <div className="container mx-auto px-4 pt-16 pb-10">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
                    {/* Org column */}
                    <div>
                        <Logo />

                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-[hsl(var(--color-neutral-300))]">
                            Connecting entrepreneurs, investors, and government partners
                            across Sierra Leone &mdash; backing 1,000+ businesses across all
                            16 districts.
                        </p>

                        <p className="mt-4 [font-family:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--color-neutral-500))]">
                            Built in Freetown, Sierra Leone
                        </p>

                        <div className="mt-6 flex gap-2">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--color-neutral-700))] text-[hsl(var(--color-neutral-300))] transition-colors hover:border-[hsl(25_95%_53%)] hover:text-[hsl(25_95%_53%)]"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform column */}
                    <div>
                        <h3 className="[font-family:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--color-neutral-400))]">
                            Platform
                        </h3>
                        <ul className="mt-5 flex flex-col gap-3 text-sm">
                            {platformLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[hsl(var(--color-neutral-200))] transition-colors hover:text-[hsl(25_95%_53%)]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get started column */}
                    <div>
                        <h3 className="[font-family:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--color-neutral-400))]">
                            Get started
                        </h3>
                        <ul className="mt-5 flex flex-col gap-3.5 text-sm">
                            {getStartedLinks.map(({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="group flex items-center gap-2.5 text-[hsl(var(--color-neutral-200))] transition-colors hover:text-[hsl(25_95%_53%)]"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-neutral-800))] text-[hsl(25_95%_53%)] transition-colors group-hover:bg-[hsl(25_95%_53%)] group-hover:text-[hsl(var(--color-neutral-900))]">
                                          <Icon className="h-3.5 w-3.5" />
                                        </span>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account column */}
                    <div>
                        <h3 className="[font-family:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--color-neutral-400))]">
                            Business
                        </h3>
                        <Link
                            href="/register-business/track"
                            className="mt-5 inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--color-neutral-700))] px-4 py-2 text-sm font-semibold text-[hsl(var(--color-neutral-50))] transition-colors hover:border-[hsl(25_95%_53%)] hover:text-[hsl(25_95%_53%)]"
                        >
                            Track Business
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <p className="mt-4 max-w-[16rem] text-xs leading-relaxed text-[hsl(var(--color-neutral-500))]">
                            Check the status of a business registration you&rsquo;ve already submitted.
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 flex flex-col gap-4 border-t border-[hsl(var(--color-neutral-800))] pt-6 text-xs text-[hsl(var(--color-neutral-500))] sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {year} NaWeHub. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="transition-colors hover:text-[hsl(25_95%_53%)]">
                            Privacy Policy
                        </Link>
                        <span aria-hidden="true">&middot;</span>
                        <Link href="/terms" className="transition-colors hover:text-[hsl(25_95%_53%)]">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}