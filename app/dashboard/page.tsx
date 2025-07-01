"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Copy, TrendingUp, TrendingDown, BarChart3} from "lucide-react"

export default function Dashboard() {
    return (
        <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <BarChart3 className={`w-5 h-5 text-gray-400 text-gray-600"}`} />
                <h1 className={`text-lg lg:text-xl font-semibold dark:text-white text-gray-900`}>Dashboard</h1>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium dark:text-gray-400 text-gray-600"}`}>
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl lg:text-2xl font-bold dark:text-white text-gray-900`}>
                            $1,250.00
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">+12.5%</span>
                        </div>
                        <p className={`text-xs mt-2 dark:text-gray-400 text-gray-600`}>Trending up this month</p>
                        <p className={`text-xs dark:text-gray-500 text-gray-500`}>
                            Visitors for the last 6 months
                        </p>
                    </CardContent>
                </Card>

                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium dark:text-gray-400 text-gray-600`}>
                            New Customers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl lg:text-2xl font-bold dark:text-white text-gray-900`}>1,234</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingDown className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-500">-20%</span>
                        </div>
                        <p className={`text-xs mt-2 dark:text-gray-400 text-gray-600`}>Down 20% this period</p>
                        <p className={`text-xs dark:text-gray-500 text-gray-500`}>Acquisition needs attention</p>
                    </CardContent>
                </Card>

                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium dark:"text-gray-400 text-gray-600`}>
                            Active Accounts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl lg:text-2xl font-bold dark:text-white text-gray-900`}>45,678</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">+12.5%</span>
                        </div>
                        <p className={`text-xs mt-2 dark:text-gray-400 text-gray-600`}>Strong user retention</p>
                        <p className={`text-xs dark:text-gray-500 text-gray-500`}>Engagement exceed targets</p>
                    </CardContent>
                </Card>

                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader className="pb-2">
                        <CardTitle className={`text-sm font-medium dark:text-gray-400 text-gray-600`}>
                            Growth Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl lg:text-2xl font-bold dark:text-white text-gray-900`}>4.5%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-500">+4.5%</span>
                        </div>
                        <p className={`text-xs mt-2 dark:text-gray-400 text-gray-600`}>Steady performance</p>
                        <p className={`text-xs dark:text-gray-500 text-gray-500`}>Meets growth projections</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200 mb-6 lg:mb-8`}>
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <CardTitle className={`dark:text-white text-gray-900`}>Total Visitors</CardTitle>
                            <p className={`text-sm dark:text-gray-400 text-gray-600`}>Total for the last 3 months</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs dark:border-gray-700 dark:text-gray-300}`}
                            >
                                Last 3 months
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs dark:border-gray-700 dark:text-gray-300}`}
                            >
                                Last 30 days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`text-xs dark:border-gray-700 dark:text-gray-300}`}
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
                            <text x="50" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 2
                            </text>
                            <text x="150" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 6
                            </text>
                            <text x="250" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 10
                            </text>
                            <text x="350" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 16
                            </text>
                            <text x="450" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 20
                            </text>
                            <text x="550" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 24
                            </text>
                            <text x="650" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 28
                            </text>
                            <text x="750" y="295" className={`text-xs dark:fill-gray-400 fill-gray-600`}>
                                Jun 30
                            </text>
                        </svg>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                {/* Pie Chart */}
                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader>
                        <CardTitle className={`dark:text-white text-gray-900`}>
                            Pie Chart - Donut with Text
                        </CardTitle>
                        <p className={`text-sm dark:text-gray-400 text-gray-600`}>January - June 2024</p>
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
                                    <div className={`text-xl lg:text-2xl font-bold dark:text-white text-gray-900`}>
                                        1,125
                                    </div>
                                    <div className={`text-sm dark:text-gray-400 text-gray-600`}>Visitors</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card className={`rounded-3xl shadow-2xl border dark:bg-[#1a1a1a] dark:border-gray-800 bg-white border-gray-200`}>
                    <CardHeader>
                        <CardTitle className={`dark:text-white text-gray-900`}>Bar Chart - Mixed</CardTitle>
                        <p className={`text-sm dark:text-gray-400 text-gray-600`}>January - June 2024</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`text-sm w-16 dark:text-gray-400 text-gray-600`}>Chrome</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm w-16 dark:text-gray-400 text-gray-600`}>Safari</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm w-16 dark:text-gray-400text-gray-600`}>Firefox</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div className="bg-[#6366f1] h-3 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
