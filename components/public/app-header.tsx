import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

interface AppHeaderProps {
    isVisible: boolean;
}

export default function AppHeader({isVisible}: AppHeaderProps) {
    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
            <div className="container flex h-16 items-center justify-between py-4">
                <div
                    className={`flex items-center gap-2 transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    {/*<div*/}
                    {/*    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">*/}
                    {/*    <span className="text-xs font-bold text-white">eW</span>*/}
                    {/*</div>*/}
                    {/*<span*/}
                    {/*    className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">*/}
                    {/*    eWomen*/}
                    {/*</span>*/}
                    <div className="items-center h-16 mb-8 pt-5">
                        <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-10 w-auto mr-2"/>
                        <span className="font-light text-xs -mt-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
                    </div>
                </div>

                <nav
                    className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
                    {['Services', 'Contact Us', 'Blog', 'FAQ'].map((item, index) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105 relative group"
                        >
                            {item}
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                <div
                    className={`flex items-center gap-2 transition-all duration-700 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <Link href="/login">
                        <Button variant="outline" size="sm"
                                className="hover:scale-105 transition-all duration-300 hover:shadow-lg bg-[#f4813f] hover:bg-[#e67730] text-white ">
                            Go To App 👉🏻
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}