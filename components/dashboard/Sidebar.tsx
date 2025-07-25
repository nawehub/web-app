import {Button} from "@/components/ui/button";
import {MoreVertical, X, Zap} from "lucide-react";
import React from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {bottomMenuItems, documentMenuItems, exploreMenuItems} from "@/components/MenuItems";
import { SidebarItem } from "./SidebarItem";
import {useSession} from "next-auth/react";

interface SidebarProps {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    pathname: string;
}

export function Sidebar({isSidebarOpen, toggleSidebar, pathname}: SidebarProps) {
    const {data: session} = useSession();
    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } border-r`}
        >
            {/* Mobile Close Button */}
            <div className="lg:hidden absolute top-4 right-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className={`"text-gray-600 hover:text-gray-900`}
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

            {/* Quickly Create Button */}
            <div className="p-4">
                <Button className="w-full bg-[#6366f1] hover:bg-[#5855eb] text-white rounded-lg">
                    <Zap className="w-4 h-4 mr-2"/>
                    Quick Create
                </Button>
            </div>

            {/* Navigation */}
            <nav className="px-4 space-y-1">
                {exploreMenuItems.map((item, i) => (
                    <SidebarItem key={i} href={item.href} icon={<item.icon className="w-4 h-4"/>} title={item.name} isActive={pathname === item.href} />
                ))}
            </nav>

            {/* Documents Section */}
            <div className="px-4 mt-6">
                <h3 className={`text-xs font-medium text-gray-500 mb-2`}>Documents</h3>
                <div className="space-y-1">
                    {documentMenuItems.map((item, i) => (
                        <SidebarItem key={i} href={item.href} icon={<item.icon className="w-4 h-4"/>} title={item.name} isActive={pathname === item.href} />
                    ))}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 w-64 p-4 space-y-2">
                {bottomMenuItems.map((item, i) => (
                    <SidebarItem key={i} href={item.href} icon={<item.icon className="w-4 h-4"/>} title={item.name} isActive={pathname === item.href} />
                ))}

                {/* User Profile */}
                <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100`}>
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div
                            className={`text-sm font-medium truncate text-gray-900`}>{session?.user?.firstName}
                        </div>
                        <div
                            className={`text-xs truncate text-gray-500`}>{session?.user?.email}
                        </div>
                    </div>
                    <MoreVertical
                        className={`w-4 h-4 flex-shrink-0 text-gray-500`}/>
                </div>
            </div>
        </div>
    );
}