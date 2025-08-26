import {Button} from "@/components/ui/button";
import {MoreVertical, X, Zap} from "lucide-react";
import React from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {bottomMenuItems, documentMenuItems, exploreMenuItems} from "@/components/MenuItems";
import {SidebarItem} from "./SidebarItem";
import {useSession} from "next-auth/react";
import {IfAllowed} from "@/components/auth/IfAllowed";
import Link from "next/link";

interface SidebarProps {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    pathname: string;
}

export function Sidebar({isSidebarOpen, toggleSidebar, pathname}: SidebarProps) {
    const {data: session} = useSession();

    // Shared inner content for the sidebar
    const SidebarInner = (
        <>
            {/* Mobile Close Button */}
            <div className="lg:hidden absolute top-4 right-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    aria-label="Close sidebar"
                >
                    <X className="w-5 h-5"/>
                </Button>
            </div>

            {/* Logo */}
            <div className="logo-wrap px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-center">
                    <Link href={"/"}>
                        <img src="/images/wehub-sample-logo.png" alt="Logo" className="h-11 w-auto"/>
                    </Link>
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
                    <SidebarItem
                        key={i}
                        href={item.href}
                        icon={<item.icon className="w-4 h-4"/>}
                        title={item.name}
                        isActive={pathname === item.href}
                    />
                ))}
            </nav>

            {/* Documents Section */}
            <IfAllowed anyOf={["funding:create", "full:access"]}>
                <div className="px-4 mt-6">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Management</h3>
                    <div className="space-y-1">
                        {documentMenuItems.map((item, i) => (
                            <SidebarItem
                                key={i}
                                href={item.href}
                                icon={<item.icon className="w-4 h-4"/>}
                                title={item.name}
                                isActive={pathname === item.href}
                            />
                        ))}
                    </div>
                </div>
            </IfAllowed>

            {/* Bottom Section */}
            <div className="absolute bottom-0 w-64 p-4 space-y-2">
                {bottomMenuItems.map((item, i) => (
                    <SidebarItem
                        key={i}
                        href={item.href}
                        icon={<item.icon className="w-4 h-4"/>}
                        title={item.name}
                        isActive={pathname === item.href}
                    />
                ))}

                {/* User Profile */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                            {session?.user?.firstName}
                        </div>
                        <div className="text-xs truncate text-gray-500 dark:text-gray-400">
                            {session?.user?.email}
                        </div>
                    </div>
                    <MoreVertical className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"/>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop (always visible) */}
            <div
                className="hidden lg:block left-sidebar fixed top-0 left-0 h-full w-64 border-r bg-white dark:bg-neutral-900 z-40"
            >
                {SidebarInner}
            </div>

            {/* Mobile overlay is always mounted to allow smooth transitions */}
            <div
                className={`fixed inset-0 z-[80] lg:hidden transition-[opacity] duration-300 ${
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isSidebarOpen}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
                        isSidebarOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={toggleSidebar}
                    aria-label="Close sidebar backdrop"
                />

                {/* Drawer panel */}
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`absolute top-0 left-0 h-svh w-64 bg-white dark:bg-neutral-900 border-r shadow-2xl transform transition-transform duration-300 ease-out ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    onClick={(e) => {
                        // Keep clicks inside from closing due to backdrop
                        e.stopPropagation();
                        // If a link is clicked anywhere inside, close the drawer
                        const anchor = (e.target as HTMLElement).closest("a[href]");
                        if (anchor) {
                            toggleSidebar();
                        }
                    }}
                    style={{willChange: "transform"}}
                >
                    {SidebarInner}
                </div>
            </div>
        </>
    );
}