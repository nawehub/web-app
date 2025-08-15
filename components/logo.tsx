import React from "react";
import Link from "next/link";

export const Logo = () => {
    return (
        <div className="items-center h-16 mb-8 pt-5">
            <Link href={"/"}>
                <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-10 w-auto mr-2"/>
                <span className="font-light text-xs -top-5 ml-4 tracking-tight text-zinc-900 dark:text-white">Salone Success</span>
            </Link>
        </div>
    )
}