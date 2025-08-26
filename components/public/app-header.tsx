"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";
import {ThemeToggle} from "@/components/theme-toggle";
import {Menu, X} from "lucide-react";
import {createPortal} from "react-dom";

const HeaderNavs = [
    { name: "Home", link: "/" },
    { name: "Love Your District", link: "/lyd" },
    { name: "Services", link: "/services" },
    { name: "Contact Us", link: "/contact" },
    { name: "FAQ", link: "/faq" },
];

interface AppHeaderProps {
    isVisible: boolean;
}

export default function AppHeader({isVisible}: AppHeaderProps) {
    const {data: session} = useSession();
    const pathname = usePathname();

    // Mobile menu state
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Close the menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Globally prevent horizontal scroll on mobile (and desktop) for the page
    useEffect(() => {
        if (!mounted) return;
        const html = document.documentElement;
        const prevHtmlOverflowX = html.style.overflowX;
        const prevBodyOverflowX = document.body.style.overflowX;

        html.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";

        return () => {
            html.style.overflowX = prevHtmlOverflowX;
            document.body.style.overflowX = prevBodyOverflowX;
        };
    }, [mounted]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (!mounted) return;
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [mobileOpen, mounted]);

    return (
        <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
            <div className="container container--header flex h-16 items-center justify-between py-4">
                {/* Logo */}
                <div
                    className={`flex items-center gap-2 transition-all duration-700 ${
                        isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                    }`}
                >
                    <div className="items-center">
                        <Link href={"/"}>
                            <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-10 w-auto mr-2" />
                        </Link>
                    </div>
                </div>

                {/* Desktop nav */}
                <nav
                    className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-200 ${
                        isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
                    }`}
                >
                    {HeaderNavs.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            className={`text-sm font-medium hover:text-emerald-600 ${
                                item.link == pathname ? "text-emerald-600 underline font-extrabold" : "text-slate-600"
                            } transition-all duration-300 hover:scale-105 relative group`}
                        >
                            {item.name}
                            <span
                                className={`${
                                    item.link == pathname
                                        ? "absolute -bottom-1 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all group-active:w/full"
                                        : ""
                                } absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full`}
                            />
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div
                    className={`hidden md:flex items-center gap-2 transition-all duration-700 delay-300 ${
                        isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                    }`}
                >
                    <Link href="/business-registration">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-all duration-300 hover:shadow-lg"
                        >
                            Register Your Business
                        </Button>
                    </Link>
                    <Link href={session?.user ? "/dashboard" : "/login"}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-all duration-300 hover:shadow-lg bg-[#f4813f] hover:bg-[#e67730] text-white hover:text-white"
                        >
                            {session?.user ? "Go To Dashboard" : "Sign In"}
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Mobile hamburger */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMobileOpen(true)}
                        className="h-9 w-9"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile drawer rendered in a portal to avoid being constrained by the header's backdrop/filter */}
            {mounted && createPortal(
                <div
                    className={`fixed inset-0 z-[60] md:hidden overflow-x-hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                    aria-hidden={!mobileOpen}
                    style={{ overscrollBehavior: "contain" }}
                >
                    {/* Backdrop */}
                    <button
                        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                            mobileOpen ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu backdrop"
                    />

                    {/* Panel */}
                    <div
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        className={`absolute right-0 top-0 h-[100dvh] w-[85%] max-w-xs bg-white dark:bg-black shadow-xl border-l flex flex-col transition-transform duration-300 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${
                            mobileOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                                <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-8 w-auto" />
                            </Link>
                            <Button
                                size="icon"
                                variant={"ghost"}
                                aria-label="Close menu"
                                onClick={() => setMobileOpen(false)}
                                className="h-9 w-9 dark:text-white dark:bg-black"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 py-4">
                            <ul className="space-y-2">
                                {HeaderNavs.map((item) => {
                                    const active = item.link === pathname;
                                    return (
                                        <li key={item.link}>
                                            <Link
                                                href={item.link}
                                                onClick={() => setMobileOpen(false)}
                                                className={`block rounded-md px-3 py-2 text-base transition ${
                                                    active
                                                        ? "text-emerald-700 bg-emerald-50 font-semibold"
                                                        : "text-slate-700 : dark:text-slate-200 hover:bg-slate-100"
                                                }`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="flex flex-col border-t px-4 py-4 space-y-3">
                            <Link href="/business-registration" onClick={() => setMobileOpen(false)}>
                                <Button variant="outline" className="w-full">
                                    Register Your Business
                                </Button>
                            </Link>
                            <Link href={session?.user ? "/dashboard" : "/login"} onClick={() => setMobileOpen(false)}>
                                <Button className="w-full bg-[#f4813f] hover:bg-[#e67730] text-white">
                                    {session?.user ? "Go To Dashboard" : "Sign In"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}