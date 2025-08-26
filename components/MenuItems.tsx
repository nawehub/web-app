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
    // { name: "Discussion Forums", href: "/dashboard/forums", icon: Network },
    { name: "Resource Library", href: "/dashboard/resources", icon: BookOpen },
];

export const documentMenuItems = [
    { name: "Funding Providers", href: "/dashboard/funding-providers", icon: Briefcase },
    { name: "File Manager", href: "/dashboard/files", icon: Folder },
    { name: "Users", href: "/dashboard/users", icon: Users },
];

export const bottomMenuItems = [
    { name: "User Settings", href: "/dashboard/user-settings", icon: Settings, action: () => void{} },
    { name: "Search", href: "#", icon: Search, action: () => void{} }
];