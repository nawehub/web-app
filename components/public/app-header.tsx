"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const HeaderNavs = [
    { name: "Home", link: "/" },
    { name: "Love Your District", link: "/lyd" },
    { name: "LYD Projects", link: "/lyd-projects" },
    { name: "Contact Us", link: "/contact" },
    { name: "FAQ", link: "/faq" },
];

interface AppHeaderProps {
    isVisible: boolean;
}

export default function AppHeader({ isVisible }: AppHeaderProps) {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Mobile menu state
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => setMounted(true), []);

    // Close the menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Track scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Globally prevent horizontal scroll on mobile
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
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-normal",
                scrolled
                    ? "bg-background/95 backdrop-blur-xl border-b shadow-sm"
                    : "bg-background/80 backdrop-blur-md border-b border-transparent"
            )}
        >
            <div className="container-mobile flex h-16 items-center justify-between">
                {/* Logo */}
                <div
                    className={cn(
                        "flex items-center gap-2 transition-all duration-slow",
                        isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                    )}
                >
                    <Link href="/" className="flex items-center">
                        <img
                            src="/images/wehub-sample-logo.png"
                            alt="NaWeHub Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav
                    className={cn(
                        "hidden lg:flex items-center gap-1 transition-all duration-slow delay-200",
                        isVisible ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
                    )}
                    role="navigation"
                    aria-label="Main navigation"
                >
                    {HeaderNavs.map((item) => {
                        const isActive = item.link === pathname;
                        return (
                            <Link
                                key={item.link}
                                href={item.link}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-fast",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Actions */}
                <div
                    className={cn(
                        "hidden lg:flex items-center gap-3 transition-all duration-slow delay-300",
                        isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                    )}
                >
                    <Link href="/business-registration">
                        <Button variant="outline" size="sm">
                            Register Your Business
                        </Button>
                    </Link>
                    <Link href={session?.user ? "/dashboard" : "/login"}>
                        <Button variant="accent" size="sm" glow>
                            {session?.user ? "Go To Dashboard" : "Sign In"}
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Mobile Actions */}
                <div className="lg:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMobileOpen(true)}
                        className="h-11 w-11"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Mobile Drawer - Rendered via Portal */}
            {mounted &&
                createPortal(
                    <div
                        className={cn(
                            "fixed inset-0 z-modal lg:hidden",
                            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
                        )}
                        aria-hidden={!mobileOpen}
                    >
                        {/* Backdrop */}
                        <div
                            className={cn(
                                "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-normal",
                                mobileOpen ? "opacity-100" : "opacity-0"
                            )}
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                        />

                        {/* Drawer Panel */}
                        <div
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile navigation menu"
                            className={cn(
                                "absolute right-0 top-0 h-[100dvh] w-[85%] max-w-sm",
                                "bg-background shadow-xl border-l",
                                "flex flex-col transition-transform duration-slow ease-out",
                                "safe-area-top safe-area-bottom",
                                mobileOpen ? "translate-x-0" : "translate-x-full"
                            )}
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-4 py-4 border-b">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <img
                                        src="/images/wehub-sample-logo.png"
                                        alt="NaWeHub Logo"
                                        className="h-8 w-auto"
                                    />
                                </Link>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Close menu"
                                    onClick={() => setMobileOpen(false)}
                                    className="h-11 w-11"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 overflow-y-auto px-4 py-6">
                                <ul className="space-y-1" role="menu">
                                    {HeaderNavs.map((item) => {
                                        const isActive = item.link === pathname;
                                        return (
                                            <li key={item.link} role="none">
                                                <Link
                                                    href={item.link}
                                                    role="menuitem"
                                                    onClick={() => setMobileOpen(false)}
                                                    className={cn(
                                                        "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors duration-fast",
                                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                        isActive
                                                            ? "text-primary bg-primary/10"
                                                            : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                                    )}
                                                    aria-current={isActive ? "page" : undefined}
                                                >
                                                    {item.name}
                                                    <ChevronRight
                                                        className={cn(
                                                            "h-5 w-5 transition-transform",
                                                            isActive ? "text-primary" : "text-muted-foreground"
                                                        )}
                                                    />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* Drawer Footer Actions */}
                            <div className="border-t px-4 py-6 space-y-3">
                                <Link
                                    href="/business-registration"
                                    onClick={() => setMobileOpen(false)}
                                    className="block"
                                >
                                    <Button variant="outline" fullWidth>
                                        Register Your Business
                                    </Button>
                                </Link>
                                <Link
                                    href={session?.user ? "/dashboard" : "/login"}
                                    onClick={() => setMobileOpen(false)}
                                    className="block"
                                >
                                    <Button variant="accent" fullWidth glow>
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
