import {
    BarChart3,
    BookOpen, Briefcase, BriefcaseBusiness, Building2,
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
    { name: "Funding Opportunities", href: "/dashboard/funding-opportunities", icon: DollarSign },
    { name: "Events", href: "/dashboard/events", icon: PartyPopper },
    { name: "My Business", href: "/dashboard/my-businesses", icon: Building2 },
    // { name: "Network", href: "/dashboard/network", icon: Network },
    { name: "Discussion Forums", href: "/dashboard/forums", icon: Network },
    { name: "Funding Providers", href: "/dashboard/funding-providers", icon: Briefcase },
    { name: "Resource Library", href: "/dashboard/resources", icon: BookOpen },
];

export const documentMenuItems = [
    { name: "File Manager", href: "/dashboard/files", icon: Folder },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "App Settings", href: "/dashboard/settings", icon: Settings },
    // { name: "Reports", href: "/dashboard/reports", icon: Copy },
    { name: "System Logs", href: "/dashboard/audit-logs", icon: Logs },
];

export const bottomMenuItems = [
    { name: "User Settings", href: "/dashboard/user-settings", icon: Settings },
    // { name: "Get Help", href: "/dashboard/file-manager", icon: HelpCircle },
    { name: "Search", href: "#", icon: Search, action: () => void{} }
];