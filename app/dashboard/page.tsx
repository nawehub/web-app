"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, List, FileText, Users, HeartHandshake, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "My Businesses",
        value: "3",
        icon: <List className="w-7 h-7 text-primary" />,
        description: "Registered businesses you manage.",
        color: "bg-primary/10",
        link: "/dashboard/my-businesses",
        button: "View Businesses",
    },
    {
        title: "Audit Logs",
        value: "5",
        icon: <FileText className="w-7 h-7 text-primary" />,
        description: "Recent audit entries for your account.",
        color: "bg-blue-100 dark:bg-blue-900/30",
        link: "/dashboard/audit-logs",
        button: "View Logs",
    },
    {
        title: "Users",
        value: "12",
        icon: <Users className="w-7 h-7 text-primary" />,
        description: "Active users in your organization.",
        color: "bg-green-100 dark:bg-green-900/30",
        link: "#",
        button: "View Users",
    },
    {
        title: "Donations",
        value: "$2,500",
        icon: <HeartHandshake className="w-7 h-7 text-primary" />,
        description: "Total donations made by your businesses.",
        color: "bg-pink-100 dark:bg-pink-900/30",
        link: "#",
        button: "View Donations",
    },
    {
        title: "Community Impact",
        value: "18",
        icon: <ShieldCheck className="w-7 h-7 text-primary" />,
        description: "Projects funded by your contributions.",
        color: "bg-yellow-100 dark:bg-yellow-900/30",
        link: "#",
        button: "View Impact",
    },
];

export default function Dashboard() {
    return (
        <TooltipProvider>
            <div className="space-y-10">
                {/* Topbar user dropdown (simulate, since layout is outside this file) */}
                <div className="flex justify-end mb-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* Feature Summary Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.1 },
                        },
                    }}
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
                            }}
                        >
                            <Card className={`rounded-3xl shadow-2xl border border-[#28282d] p-8 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${feature.color}`}>
                                <CardHeader className="pb-2 flex flex-row items-center gap-4">
                                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-md">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-lg font-semibold text-muted-foreground tracking-tight">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">{feature.value}</div>
                                    <div className="text-sm text-muted-foreground font-medium mb-4 min-h-[40px]">{feature.description}</div>
                                    <Link href={feature.link}>
                                        <Button variant="secondary" className="w-full hover:scale-105 transition-transform">
                                            {feature.button}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </TooltipProvider>
    );
}