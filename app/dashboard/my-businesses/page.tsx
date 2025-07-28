"use client";

import {useState, useMemo, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
    Building2,
    Plus,
    Search,
    Filter,
    Calendar,
    MapPin,
    User,
    Phone,
    Mail,
    Building,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Edit,
    Trash2,
    SortAsc,
    SortDesc
} from "lucide-react";

import {businessService} from "@/lib/services/business";
import {NewBizDialog} from "@/app/dashboard/my-businesses/_components/NewBizDialog";
import {HydrationBoundary, QueryClient, dehydrate} from "@tanstack/react-query";
import AllBusinesses from "@/app/dashboard/my-businesses/_components/all-businesses";

interface Business {
    id: string;
    businessName: string;
    businessAddress: string;
    owner: string;
    addressOfOwner: string;
    placeOfBirth: string;
    dateOfBirth: string;
    mothersName: string;
    contactNumber: string;
    email: string;
    businessCategory: string;
    registerDate: string;
    registrationStatus: 'approved' | 'pending' | 'rejected';
}

const initialBusinesses: Business[] = [
    {
        id: "1",
        businessName: "SL Fashion Creations",
        businessAddress: "15 Siaka Stevens Street, Freetown",
        owner: "Sarah Lansana",
        addressOfOwner: "23 Hill Station, Freetown",
        placeOfBirth: "Bo, Sierra Leone",
        dateOfBirth: "1985-03-15",
        mothersName: "Fatmata Lansana",
        contactNumber: "+232 76 123 4567",
        email: "sarah@slfashion.sl",
        businessCategory: "Fashion & Textiles",
        registerDate: "2024-01-15",
        registrationStatus: "approved"
    },
    {
        id: "2",
        businessName: "Freetown Tech Solutions",
        businessAddress: "45 Wilkinson Road, Freetown",
        owner: "Mohamed Kamara",
        addressOfOwner: "12 Congo Cross, Freetown",
        placeOfBirth: "Makeni, Sierra Leone",
        dateOfBirth: "1990-07-22",
        mothersName: "Aminata Kamara",
        contactNumber: "+232 77 987 6543",
        email: "mohamed@freetowntech.sl",
        businessCategory: "Technology",
        registerDate: "2024-02-20",
        registrationStatus: "pending"
    },
    {
        id: "3",
        businessName: "Bo Agricultural Supplies",
        businessAddress: "78 Damballa Road, Bo",
        owner: "Ibrahim Turay",
        addressOfOwner: "34 New London, Bo",
        placeOfBirth: "Kenema, Sierra Leone",
        dateOfBirth: "1982-11-08",
        mothersName: "Isata Turay",
        contactNumber: "+232 78 456 7890",
        email: "ibrahim@boagri.sl",
        businessCategory: "Agriculture",
        registerDate: "2024-03-10",
        registrationStatus: "approved"
    }
];

const businessCategories = [
    "Agriculture", "Technology", "Fashion & Textiles", "Food & Beverage",
    "Healthcare", "Education", "Construction", "Transportation", "Retail",
    "Manufacturing", "Services", "Tourism", "Mining", "Energy"
];

export default function MyBusinessesPage() {
    const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("registerDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewBusiness, setViewBusiness] = useState<Business | null>(null);
    const queryClient = new QueryClient();
    const [client, setClient] = useState<QueryClient>(queryClient);

    const filteredAndSortedBusinesses = useMemo(() => {
        let filtered = businesses.filter(business => {
            const matchesSearch = business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.businessCategory.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || business.registrationStatus === statusFilter;
            const matchesCategory = categoryFilter === "all" || business.businessCategory === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort businesses
        filtered.sort((a, b) => {
            let aValue = a[sortBy as keyof Business];
            let bValue = b[sortBy as keyof Business];

            if (sortBy === "registerDate") {
                aValue = new Date(aValue as string).getTime().toString();
                bValue = new Date(bValue as string).getTime().toString();
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [businesses, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            approved: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            rejected: "bg-red-100 text-red-800 border-red-200"
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </Badge>
        );
    };

    useEffect(() => {
        async function fetchData() {
            await queryClient.prefetchQuery({
                queryKey: ['businesses'],
                queryFn: () => businessService().business.listAll(""),
            });

            setClient(queryClient);
        }

        fetchData().then();
    }, []);

    return (
        <div className="space-y-6 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        My Businesses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your registered businesses and track their status
                    </p>
                </div>
                <NewBizDialog />
            </div>
            <HydrationBoundary state={dehydrate(client!)}>
                <AllBusinesses />
            </HydrationBoundary>
        </div>
    );
}