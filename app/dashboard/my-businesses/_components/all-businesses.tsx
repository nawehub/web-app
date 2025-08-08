import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Building,
    Building2,
    Calendar, CheckCircle, Clock,
    Edit,
    Eye,
    Filter,
    MapPin,
    Phone,
    Search,
    SortAsc,
    SortDesc,
    User, XCircle
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useListBusinessQuery} from "@/hooks/repository/use-business";
import Loading from "@/components/loading";
import {useEffect, useMemo, useState} from "react";
import {BusinessData} from "@/lib/services/business";
import {categories} from "@/utils/business-categories";
import {Badge} from "@/components/ui/badge";
import {NewBizDialog} from "@/app/dashboard/my-businesses/_components/NewBizDialog";
import {usePermissions} from "@/hooks/use-permissions";

export default function AllBusinesses() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("registerDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [viewBusiness, setViewBusiness] = useState<BusinessData | null>(null);
    const [viewMode, setViewMode] = useState<"all" | "own">("own");

    const { hasPermission, isAdmin } = usePermissions();

    const {data, isLoading} = useListBusinessQuery("all");

    useEffect(() => {
        if (isAdmin() || hasPermission("business:read-all")){
            setViewMode("all");
        }

    }, [viewMode]);

    const filteredAndSortedBusinesses = useMemo(() => {
        let filtered = data?.businesses.filter(business => {
            const matchesSearch = business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                business.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || business.status.state === statusFilter;
            const matchesCategory = categoryFilter === "all" || business.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort businesses
        filtered?.sort((a, b) => {
            let aValue = a[sortBy as keyof BusinessData];
            let bValue = b[sortBy as keyof BusinessData];

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
    }, [data?.businesses, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="h-4 w-4 text-green-500"/>;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-500"/>;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-500"/>;
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
        <div className={"space-y-6"}>
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
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
                                    <Filter className="h-4 w-4 mr-2"/>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Building className="h-4 w-4 mr-2"/>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.name} value={category.name}>
                                            {category.name}
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
                                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2"/> :
                                        <SortDesc className="h-4 w-4 mr-2"/>}
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                                    <SelectItem value="businessName-asc">Name A-Z</SelectItem>
                                    <SelectItem value="businessName-desc">Name Z-A</SelectItem>
                                    <SelectItem value="status.state-asc">Status A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Business Cards */}
            {isLoading && (
                <Loading/>
            )}
            {!isLoading && data && data.businesses.length === 0 && (
                <div className="flex flex-col items-center justify-center h-96">
                    <div className="flex flex-col items-center">
                        <Building2 className="h-16 w-16 text-slate-400"/>
                        <p className="text-lg font-bold text-slate-400">No businesses found</p>
                        <NewBizDialog />
                    </div>
                </div>
            )}
            {!isLoading && data && data.businesses.length > 0 && (
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAndSortedBusinesses?.map((business) => (
                            <Card key={business.id}
                                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-slate-100 hover:border-emerald-200">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle
                                                className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300">
                                                {business.businessName}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <Building2 className="h-3 w-3"/>
                                                {business.category}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(business.status.state.toLowerCase())}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-4 w-4"/>
                                            <span>{business.ownerName}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4"/>
                                            <span className="truncate">{business.businessAddress}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4"/>
                                            <span>Registered: {new Date(business.registerDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4"/>
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
                                            <Eye className="h-4 w-4 mr-1"/>
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                                        >
                                            <Edit className="h-4 w-4 mr-1"/>
                                            Edit
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

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
                                            {getStatusBadge(viewBusiness.status.state)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-emerald-600">Business Information</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div><strong>Name:</strong> {viewBusiness.businessName}</div>
                                                    <div><strong>Category:</strong> {viewBusiness.category}</div>
                                                    <div><strong>Address:</strong> {viewBusiness.businessAddress}</div>
                                                    <div><strong>Registration
                                                        Date:</strong> {new Date(viewBusiness.registerDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-emerald-600">Owner Information</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div><strong>Name:</strong> {viewBusiness.ownerName}</div>
                                                    <div><strong>Date of
                                                        Birth:</strong> {viewBusiness.dateOfBirth ? new Date(viewBusiness.dateOfBirth).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <div><strong>Place of Birth:</strong> {viewBusiness.placeOfBirth}</div>
                                                    <div><strong>Mother's Name:</strong> {viewBusiness.mothersName}</div>
                                                    <div><strong>Address:</strong> {viewBusiness.ownerAddress}</div>
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
                    {filteredAndSortedBusinesses?.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                                <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "Get started by registering your first business"}
                                </p>
                                {
                                    !searchTerm && statusFilter === "all" && categoryFilter === "all" && (
                                        <NewBizDialog />
                                    )
                                }
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )

}