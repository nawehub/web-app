'use client';

import React, {ReactNode, useState} from "react";
import {redirect, usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Bell,
    Menu, Moon,
    MoreVertical, Search,
    Sun,
    X,
    Zap
} from "lucide-react";
import {useSession} from "next-auth/react";
import Loading from "@/components/loading";
import {UserNav} from "@/components/dashboard/user-nav";
import {ThemeToggle} from "@/components/theme-toggle";
import {Sidebar} from "@/components/dashboard/Sidebar";

export default function DashboardLayout({children}: { children: ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login');
        },
    });

    if (status === 'loading') {
        return <Loading/>
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className={`min-h-screen bg-gray-50`}>
            {/* Side nav */}
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} pathname={pathname} />
            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Fixed Top Navigation */}
                <div
                    className={`head-wrap fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white border-gray-200 border-b`}
                >
                    <div className="px-4 lg:px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className={`lg:hidden text-gray-600 hover:text-gray-900`}
                                >
                                    <Menu className="w-5 h-5"/>
                                </Button>

                                {/* Desktop Navigation */}
                                <nav className="hidden md:flex items-center gap-4 lg:gap-14">
                                    <a href="#"
                                       className={`user-name text-sm font-medium text-gray-900`}>
                                        Hello {session?.user?.firstName}!
                                    </a>
                                    <div className="relative flex md:max-w-sm items-center justify-center text-center">
                                        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground"/>
                                        <Input type="search" placeholder="Search..."
                                               className="rounded-full bg-background pl-8 md:w-[1500px]"/>
                                    </div>
                                </nav>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex md:gap-2">
                                    <Button variant="outline" size="sm" onClick={() => redirect("/lyd")}>
                                        Contribute to Your Community
                                    </Button>
                                </div>
                                <ThemeToggle />
                                <UserNav />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 bg-background p-6 overflow-y-auto mt-10">
                    {children}
                </main>
            </div>
        </div>
    );
}