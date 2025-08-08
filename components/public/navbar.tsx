import Link from "next/link";
import {Button} from "@/components/ui/button";
import React from "react";

export default function Navbar() {
    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="items-center h-16 mb-8 pt-5">
                        <Link href={"/"}>
                            <img src={"/images/wehub-sample-logo.png"} alt="Logo" className="h-10 w-auto mr-2"/>
                            <span className="font-light text-xs -mt-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
                        </Link>
                    </div>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href={"/services"} className="text-gray-600 hover:text-emerald-600">
                        Services
                    </Link>
                    <Link href={"/contact"} className="text-gray-600 hover:text-emerald-600">
                        Contact Us
                    </Link>
                    <Link href={"/faq"} className="text-gray-600 hover:text-emerald-600">
                        FAQs
                    </Link>
                    <Link href={"/login"} className="text-gray-600 hover:text-emerald-600">
                        Login
                    </Link>
                    <Button asChild>
                        <Link href={"/register"}>Get Started</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}