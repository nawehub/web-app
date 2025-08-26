import React from "react";
import Link from "next/link";

export const Logo = () => {
    return (
        <div className="items-center h-16 mb-8 pt-5">
            <Link href={"/"}>
                <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-10 w-auto mr-2"/>
            </Link>
        </div>
    )
}