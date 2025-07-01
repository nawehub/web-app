'use client';

import React, {ReactNode, useState} from "react";
import {usePathname} from "next/navigation";
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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {bottomMenuItems, documentMenuItems, exploreMenuItems} from "@/components/MenuItems";

export default function DashboardLayout({children}: { children: ReactNode }) {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle("dark")
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className={`min-h-screen ${isDark ? "dark bg-[#0a0a0a]" : "bg-gray-50"}`}>
            <div
                className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"} border-r`}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden absolute top-4 right-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                    >
                        <X className="w-5 h-5"/>
                    </Button>
                </div>

                {/* Logo */}
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-center">
                        <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-11 w-auto"/>
                    </div>
                </div>

                {/* Quick Create Button */}
                <div className="p-4">
                    <Button className="w-full bg-[#6366f1] hover:bg-[#5855eb] text-white rounded-lg">
                        <Zap className="w-4 h-4 mr-2"/>
                        Quick Create
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="px-4 space-y-1">
                    {exploreMenuItems.map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <item.icon className="w-4 h-4"/>
                            <span className="text-sm">{item.name}</span>
                        </a>
                    ))}
                </nav>

                {/* Documents Section */}
                <div className="px-4 mt-6">
                    <h3 className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} mb-2`}>Documents</h3>
                    <div className="space-y-1">
                        {documentMenuItems.map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                <item.icon className="w-4 h-4"/>
                                <span className="text-sm">{item.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 w-64 p-4 space-y-2">
                    {bottomMenuItems.map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <item.icon className="w-4 h-4"/>
                            <span className="text-sm">{item.name}</span>
                        </a>
                    ))}

                    {/* User Profile */}
                    <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-600 text-white text-xs">MJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div
                                className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>James
                            </div>
                            <div
                                className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>mohamedjramsey@example.com
                            </div>
                        </div>
                        <MoreVertical
                            className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}/>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Fixed Top Navigation */}
                <div
                    className={`fixed top-0 right-0 left-0 lg:left-64 z-30 ${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"} border-b`}
                >
                    <div className="px-4 lg:px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleSidebar}
                                    className={`lg:hidden ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>

                                {/* Desktop Navigation */}
                                <nav className="hidden md:flex items-center gap-4 lg:gap-14">
                                    <a href="#" className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                        Welcome James!
                                    </a>
                                    <div className="relative flex md:max-w-sm items-center justify-center text-center">
                                        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input type="search" placeholder="Search..." className="rounded-full bg-background pl-8 md:w-[1500px]" />
                                    </div>
                                </nav>
                            </div>

                            <div className="flex items-center space-x-6">
                                <button
                                    onClick={toggleTheme}
                                    className={`${isDark ? "border-gray-700 text-gray-300" : "border-gray-200"}`}
                                >
                                    <Bell className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className={`${isDark ? "border-gray-700 text-gray-300" : "border-gray-200"}`}
                                >
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                                <button>
                                    <Avatar>
                                        <AvatarImage src="/placeholder-user.jpg" alt={"profile"} />
                                        <AvatarFallback>MJ</AvatarFallback>
                                    </Avatar>
                                </button>
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