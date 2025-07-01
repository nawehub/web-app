import {
    BarChart3,
    BookOpen,
    Copy,
    DollarSign,
    Folder, Heart,
    HelpCircle,
    Logs, MessageSquare, Network,
    PartyPopper, Rocket, Search,
    Settings,
    Users
} from "lucide-react";

export const exploreMenuItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Funding Opportunities", href: "/dashboard/opportunities", icon: DollarSign },
    { name: "Events", href: "/dashboard/events", icon: PartyPopper },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Network", href: "/dashboard/network", icon: Network },
    { name: "Lyd Board", href: "/dashboard/lyd", icon: Heart },
    { name: "Projects", href: "/dashboard/projects", icon: Rocket },
];

export const documentMenuItems = [
    { name: "Resource Library", href: "/dashboard/resources", icon: BookOpen },
    { name: "File Manager", href: "/dashboard/file-manager", icon: Folder },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "App Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Reports", href: "/dashboard/reports", icon: Copy },
    { name: "System Logs", href: "/dashboard/logs", icon: Logs },
];

export const bottomMenuItems = [
    { name: "User Settings", href: "/dashboard/user-settings", icon: Settings },
    { name: "Get Help", href: "/dashboard/file-manager", icon: HelpCircle },
    { name: "Search", href: "#", icon: Search, action: () => void{} }
];