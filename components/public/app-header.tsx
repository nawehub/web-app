import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";
import { usePathname } from "next/navigation"
import {useSession} from "next-auth/react";
import {ThemeToggle} from "@/components/theme-toggle";

const HeaderNavs = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Love Your District",
        link: "/lyd",
    },
    {
        name: "Services",
        link: "/services",
    },
    {
        name: "Contact Us",
        link: "/contact-us",
    },
    {
        name: "FAQ",
        link: "/faq",
    }
];

interface AppHeaderProps {
    isVisible: boolean;
}

export default function AppHeader({isVisible}: AppHeaderProps) {
    const { data: session } = useSession();
    const pathname = usePathname();
    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
            <div className="container flex h-16 items-center justify-between py-4">
                <div
                    className={`flex items-center gap-2 transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <div className="items-center h-16 mb-8 pt-5">
                        <Link href={"/"}>
                            <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-10 w-auto mr-2"/>
                            <span className="font-light text-xs -mt-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
                        </Link>
                    </div>
                </div>

                <nav
                    className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
                    {HeaderNavs.map((item, index) => (
                        <Link
                            key={index}
                            href={item.link}
                            className={`text-sm font-medium hover:text-emerald-600 ${item.link == pathname ? 'text-emerald-600 underline font-extrabold' : 'text-slate-600'} transition-all duration-300 hover:scale-105 relative group`}
                        >
                            {item.name}
                            <span
                                className={`${item.link == pathname ? 'absolute -bottom-1 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all group-active:w-full' : ''} absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full`}></span>
                        </Link>
                    ))}
                </nav>

                <div
                    className={`flex items-center gap-2 transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <Link href="/business-registration">
                        <Button variant="outline" size="sm"
                                className="hover:scale-105 transition-all duration-300 hover:shadow-lg">
                            Register Your Business
                        </Button>
                    </Link>
                    <Link href={session?.user ? "/dashboard" : "/login"}>
                        <Button variant="outline" size="sm"
                                className="hover:scale-105 transition-all duration-300 hover:shadow-lg bg-[#f4813f] hover:bg-[#e67730] text-white hover:text-white">
                            {session?.user ? "Go To Dashboard" : "Sign In" }
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}