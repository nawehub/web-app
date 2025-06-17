"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    BarChart3,
    Calendar,
    Copy,
    FileText,
    HelpCircle,
    MoreHorizontal,
    Search,
    Settings,
    TrendingUp,
    TrendingDown,
    Users,
    Zap,
    Moon,
    Sun,
    MoreVertical,
    Menu,
    X,
} from "lucide-react"

export default function Dashboard() {
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
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleSidebar} />}

            {/* Sidebar */}
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
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Logo */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Acme Inc.</span>
                    </div>
                </div>

                {/* Quick Create Button */}
                <div className="p-4">
                    <Button className="w-full bg-[#6366f1] hover:bg-[#5855eb] text-white rounded-lg">
                        <Zap className="w-4 h-4 mr-2" />
                        Quick Create
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="px-4 space-y-1">
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Dashboard</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Lifecycle</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Analytics</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Projects</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Team</span>
                    </a>
                </nav>

                {/* Documents Section */}
                <div className="px-4 mt-6">
                    <h3 className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} mb-2`}>Documents</h3>
                    <div className="space-y-1">
                        <a
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Data Library</span>
                        </a>
                        <a
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Reports</span>
                        </a>
                        <a
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Word Assistant</span>
                        </a>
                        <a
                            href="#"
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                            <span className="text-sm">More</span>
                        </a>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="absolute bottom-0 w-64 p-4 space-y-2">
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Get Help</span>
                    </a>
                    <a
                        href="#"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search</span>
                    </a>

                    {/* User Profile */}
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-600 text-white text-xs">CN</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>shadcn</div>
                            <div className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>m@example.com</div>
                        </div>
                        <MoreVertical className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
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
                                <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                                    <a href="#" className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                                        Cards
                                    </a>
                                    <a
                                        href="#"
                                        className={`text-sm font-medium ${isDark ? "text-white bg-gray-800" : "text-gray-900 bg-gray-100"} px-3 py-1 rounded-md`}
                                    >
                                        Dashboard
                                    </a>
                                    <a href="#" className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                        Pricing
                                    </a>
                                    <a href="#" className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                        Mail
                                    </a>
                                    <a href="#" className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} hidden lg:block`}>
                                        Tasks
                                    </a>
                                    <a href="#" className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} hidden lg:block`}>
                                        Music
                                    </a>
                                    <a href="#" className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} hidden xl:block`}>
                                        Color Palette
                                    </a>
                                </nav>
                            </div>

                            <div className="flex items-center gap-2 lg:gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleTheme}
                                    className={`${isDark ? "border-gray-700 text-gray-300" : "border-gray-300"}`}
                                >
                                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </Button>
                                {!isDark && (
                                    <Button size="sm" className="bg-[#6366f1] hover:bg-[#5855eb] text-white hidden sm:inline-flex">
                                        Toggle Theme
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="pt-16 p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4 lg:mb-6">
                        <Copy className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                        <h1 className={`text-lg lg:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Documents</h1>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    Total Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                    $1,250.00
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-500">+12.5%</span>
                                </div>
                                <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Trending up this month</p>
                                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                                    Visitors for the last 6 months
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    New Customers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>1,234</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                    <span className="text-xs text-red-500">-20%</span>
                                </div>
                                <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Down 20% this period</p>
                                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Acquisition needs attention</p>
                            </CardContent>
                        </Card>

                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    Active Accounts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>45,678</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-500">+12.5%</span>
                                </div>
                                <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Strong user retention</p>
                                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Engagement exceed targets</p>
                            </CardContent>
                        </Card>

                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                    Growth Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>4.5%</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-500">+4.5%</span>
                                </div>
                                <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Steady performance</p>
                                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Meets growth projections</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Section */}
                    <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"} mb-6 lg:mb-8`}>
                        <CardHeader>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className={`${isDark ? "text-white" : "text-gray-900"}`}>Total Visitors</CardTitle>
                                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Total for the last 3 months</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`text-xs ${isDark ? "border-gray-700 text-gray-300" : ""}`}
                                    >
                                        Last 3 months
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`text-xs ${isDark ? "border-gray-700 text-gray-300" : ""}`}
                                    >
                                        Last 30 days
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={`text-xs ${isDark ? "border-gray-700 text-gray-300" : ""}`}
                                    >
                                        Last 7 days
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 lg:h-80 relative">
                                {/* Simplified chart representation */}
                                <svg className="w-full h-full" viewBox="0 0 800 300">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 50 250 Q 100 200 150 180 T 250 160 T 350 140 T 450 120 T 550 100 T 650 80 T 750 60"
                                        stroke="#6366f1"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 50 250 Q 100 200 150 180 T 250 160 T 350 140 T 450 120 T 550 100 T 650 80 T 750 60 L 750 280 L 50 280 Z"
                                        fill="url(#gradient)"
                                    />
                                    {/* Date labels */}
                                    <text x="50" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 2
                                    </text>
                                    <text x="150" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 6
                                    </text>
                                    <text x="250" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 10
                                    </text>
                                    <text x="350" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 16
                                    </text>
                                    <text x="450" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 20
                                    </text>
                                    <text x="550" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 24
                                    </text>
                                    <text x="650" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 28
                                    </text>
                                    <text x="750" y="295" className={`text-xs ${isDark ? "fill-gray-400" : "fill-gray-600"}`}>
                                        Jun 30
                                    </text>
                                </svg>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                        {/* Pie Chart */}
                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader>
                                <CardTitle className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                    Pie Chart - Donut with Text
                                </CardTitle>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>January - June 2024</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center h-48 lg:h-64">
                                    <div className="relative">
                                        <svg width="160" height="160" viewBox="0 0 200 200" className="lg:w-[200px] lg:h-[200px]">
                                            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="80"
                                                fill="none"
                                                stroke="#6366f1"
                                                strokeWidth="20"
                                                strokeDasharray="377"
                                                strokeDashoffset="94"
                                                transform="rotate(-90 100 100)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className={`text-xl lg:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                                                1,125
                                            </div>
                                            <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Visitors</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bar Chart */}
                        <Card className={`${isDark ? "bg-[#1a1a1a] border-gray-800" : "bg-white border-gray-200"}`}>
                            <CardHeader>
                                <CardTitle className={`${isDark ? "text-white" : "text-gray-900"}`}>Bar Chart - Mixed</CardTitle>
                                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>January - June 2024</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm w-16 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Chrome</span>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "85%" }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm w-16 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Safari</span>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "70%" }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm w-16 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Firefox</span>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                            <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "60%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
