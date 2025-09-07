import React from "react";

export const RightHero = () => {
    return (
        <div className="hidden md:flex w-1/2 bg-black relative items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-80 z-0"/>
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center h-full w-full">
                        <span className="mb-8 mt-[-60px]">
                            <img src={"/images/wehub-sample-logo.png"} alt={"NaWeHub"} className={"h-10 w-auto"} />
                        </span>
                    <h1 className="text-3xl font-bold text-white mb-4">Idea to business, fast</h1>
                    <img src="/images/salone-transparent-map.png" alt="Globe" className="w-4/5 max-w-md rounded-xl shadow-2xl"/>
                </div>
            </div>
        </div>
    )
}