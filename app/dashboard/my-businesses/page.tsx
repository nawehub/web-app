"use client";

import { useState, useMemo } from "react";
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
    const { toast } = useToast();

    // New business form state
    const [newBusiness, setNewBusiness] = useState({
        businessName: "",
        businessAddress: "",
        owner: "",
        addressOfOwner: "",
        placeOfBirth: "",
        dateOfBirth: "",
        mothersName: "",
        contactNumber: "",
        email: "",
        businessCategory: ""
    });

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

    const handleCreateBusiness = () => {
        if (!newBusiness.businessName || !newBusiness.owner || !newBusiness.businessCategory) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const business: Business = {
            id: Date.now().toString(),
            ...newBusiness,
            registerDate: new Date().toISOString().split('T')[0],
            registrationStatus: "pending"
        };

        setBusinesses([...businesses, business]);
        setNewBusiness({
            businessName: "",
            businessAddress: "",
            owner: "",
            addressOfOwner: "",
            placeOfBirth: "",
            dateOfBirth: "",
            mothersName: "",
            contactNumber: "",
            email: "",
            businessCategory: ""
        });
        setIsDialogOpen(false);

        toast({
            title: "Business Registered",
            description: "Your business has been successfully registered and is pending approval."
        });
    };

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

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <Plus className="h-4 w-4 mr-2" />
                            Register New Business
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Register New Business</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to register your new business
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="business" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="business">Business Information</TabsTrigger>
                                <TabsTrigger value="owner">Owner Information</TabsTrigger>
                            </TabsList>

                            <TabsContent value="business" className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessName">Business Name *</Label>
                                        <Input
                                            id="businessName"
                                            value={newBusiness.businessName}
                                            onChange={(e) => setNewBusiness({...newBusiness, businessName: e.target.value})}
                                            placeholder="Enter business name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessCategory">Business Category *</Label>
                                        <Select
                                            value={newBusiness.businessCategory}
                                            onValueChange={(value) => setNewBusiness({...newBusiness, businessCategory: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {businessCategories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="businessAddress">Business Address</Label>
                                    <Input
                                        id="businessAddress"
                                        value={newBusiness.businessAddress}
                                        onChange={(e) => setNewBusiness({...newBusiness, businessAddress: e.target.value})}
                                        placeholder="Enter business address"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="owner" className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="owner">Owner Name *</Label>
                                        <Input
                                            id="owner"
                                            value={newBusiness.owner}
                                            onChange={(e) => setNewBusiness({...newBusiness, owner: e.target.value})}
                                            placeholder="Enter owner name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={newBusiness.dateOfBirth}
                                            onChange={(e) => setNewBusiness({...newBusiness, dateOfBirth: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                                        <Input
                                            id="placeOfBirth"
                                            value={newBusiness.placeOfBirth}
                                            onChange={(e) => setNewBusiness({...newBusiness, placeOfBirth: e.target.value})}
                                            placeholder="Enter place of birth"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mothersName">Mother's Name</Label>
                                        <Input
                                            id="mothersName"
                                            value={newBusiness.mothersName}
                                            onChange={(e) => setNewBusiness({...newBusiness, mothersName: e.target.value})}
                                            placeholder="Enter mother's name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="addressOfOwner">Owner Address</Label>
                                    <Input
                                        id="addressOfOwner"
                                        value={newBusiness.addressOfOwner}
                                        onChange={(e) => setNewBusiness({...newBusiness, addressOfOwner: e.target.value})}
                                        placeholder="Enter owner address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber">Contact Number</Label>
                                        <Input
                                            id="contactNumber"
                                            value={newBusiness.contactNumber}
                                            onChange={(e) => setNewBusiness({...newBusiness, contactNumber: e.target.value})}
                                            placeholder="+232 XX XXX XXXX"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={newBusiness.email}
                                            onChange={(e) => setNewBusiness({...newBusiness, email: e.target.value})}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateBusiness} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                Register Business
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and Search */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search businesses, owners, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Building className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {businessCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                                const [field, order] = value.split('-');
                                setSortBy(field);
                                setSortOrder(order as "asc" | "desc");
                            }}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="registerDate-desc">Newest First</SelectItem>
                                    <SelectItem value="registerDate-asc">Oldest First</SelectItem>
                                    <SelectItem value="businessName-asc">Name A-Z</SelectItem>
                                    <SelectItem value="businessName-desc">Name Z-A</SelectItem>
                                    <SelectItem value="registrationStatus-asc">Status A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Business Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedBusinesses.map((business) => (
                    <Card key={business.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-100 hover:border-emerald-200">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                                        {business.businessName}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3" />
                                        {business.businessCategory}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(business.registrationStatus)}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{business.owner}</span>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span className="truncate">{business.businessAddress}</span>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Registered: {new Date(business.registerDate).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{business.contactNumber}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-3 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 hover:bg-emerald-50 hover:border-emerald-300"
                                    onClick={() => setViewBusiness(business)}
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredAndSortedBusinesses.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Get started by registering your first business"}
                        </p>
                        {!searchTerm && statusFilter === "all" && categoryFilter === "all" && (
                            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Register Your First Business
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* View Business Dialog */}
            <Dialog open={!!viewBusiness} onOpenChange={() => setViewBusiness(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{viewBusiness?.businessName}</DialogTitle>
                        <DialogDescription>
                            Complete business registration details
                        </DialogDescription>
                    </DialogHeader>

                    {viewBusiness && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Registration Status</h3>
                                {getStatusBadge(viewBusiness.registrationStatus)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-emerald-600">Business Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewBusiness.businessName}</div>
                                        <div><strong>Category:</strong> {viewBusiness.businessCategory}</div>
                                        <div><strong>Address:</strong> {viewBusiness.businessAddress}</div>
                                        <div><strong>Registration Date:</strong> {new Date(viewBusiness.registerDate).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-emerald-600">Owner Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewBusiness.owner}</div>
                                        <div><strong>Date of Birth:</strong> {viewBusiness.dateOfBirth ? new Date(viewBusiness.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                                        <div><strong>Place of Birth:</strong> {viewBusiness.placeOfBirth}</div>
                                        <div><strong>Mother's Name:</strong> {viewBusiness.mothersName}</div>
                                        <div><strong>Address:</strong> {viewBusiness.addressOfOwner}</div>
                                        <div><strong>Contact:</strong> {viewBusiness.contactNumber}</div>
                                        <div><strong>Email:</strong> {viewBusiness.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}