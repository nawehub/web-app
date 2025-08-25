"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
    Users,
    Plus,
    Search,
    Filter,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Building,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    Edit,
    Trash2,
    UserPlus,
    Shield,
    Crown,
    User
} from "lucide-react";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: 'entrepreneur' | 'donor' | 'government' | 'partner';
    district: string;
    registrationDate: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    businessesCount: number;
    totalDonations: number;
}

const initialUsers: User[] = [
    {
        id: "1",
        firstName: "Sarah",
        lastName: "Lansana",
        email: "sarah@example.com",
        phone: "+232 76 123 4567",
        userType: "entrepreneur",
        district: "Bo",
        registrationDate: "2024-01-15",
        status: "active",
        lastLogin: "2025-01-15",
        businessesCount: 2,
        totalDonations: 50000
    },
    {
        id: "2",
        firstName: "Mohamed",
        lastName: "Kamara",
        email: "mohamed@example.com",
        phone: "+232 77 987 6543",
        userType: "entrepreneur",
        district: "Freetown",
        registrationDate: "2024-02-20",
        status: "active",
        lastLogin: "2025-01-14",
        businessesCount: 1,
        totalDonations: 25000
    },
    {
        id: "3",
        firstName: "Dr. Fatmata",
        lastName: "Sesay",
        email: "fatmata.sesay@gov.sl",
        phone: "+232 78 456 7890",
        userType: "government",
        district: "Kenema",
        registrationDate: "2024-03-10",
        status: "active",
        lastLogin: "2025-01-13",
        businessesCount: 0,
        totalDonations: 0
    },
    {
        id: "4",
        firstName: "Ibrahim",
        lastName: "Turay",
        email: "ibrahim@worldbank.org",
        phone: "+232 79 321 6540",
        userType: "partner",
        district: "Makeni",
        registrationDate: "2024-01-05",
        status: "active",
        lastLogin: "2025-01-15",
        businessesCount: 0,
        totalDonations: 500000
    },
    {
        id: "5",
        firstName: "Aminata",
        lastName: "Bangura",
        email: "aminata@example.com",
        phone: "+232 76 654 3210",
        userType: "donor",
        district: "Kailahun",
        registrationDate: "2024-04-12",
        status: "inactive",
        lastLogin: "2024-12-20",
        businessesCount: 0,
        totalDonations: 75000
    }
];

const userTypes = ["entrepreneur", "donor", "government", "partner"];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const { toast } = useToast();

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.district.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || user.status === statusFilter;
            const matchesType = typeFilter === "all" || user.userType === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [users, searchTerm, statusFilter, typeFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "inactive":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "suspended":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            active: "bg-green-100 text-green-800 border-green-200",
            inactive: "bg-yellow-100 text-yellow-800 border-yellow-200",
            suspended: "bg-red-100 text-red-800 border-red-200"
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </Badge>
        );
    };

    const getUserTypeIcon = (type: string) => {
        switch (type) {
            case "entrepreneur":
                return <Building className="h-4 w-4 text-blue-600" />;
            case "donor":
                return <Crown className="h-4 w-4 text-purple-600" />;
            case "government":
                return <Shield className="h-4 w-4 text-green-600" />;
            case "partner":
                return <Users className="h-4 w-4 text-orange-600" />;
            default:
                return <User className="h-4 w-4 text-gray-600" />;
        }
    };

    const getUserTypeBadge = (type: string) => {
        const variants = {
            entrepreneur: "bg-blue-100 text-blue-800 border-blue-200",
            donor: "bg-purple-100 text-purple-800 border-purple-200",
            government: "bg-green-100 text-green-800 border-green-200",
            partner: "bg-orange-100 text-orange-800 border-orange-200"
        };

        return (
            <Badge className={variants[type as keyof typeof variants]}>
                {getUserTypeIcon(type)}
                <span className="ml-1 capitalize">{type}</span>
            </Badge>
        );
    };

    return (
        <div className="space-y-6 mt-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage platform users and their access permissions
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Users</p>
                                <p className="text-3xl font-bold text-blue-700">{users.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Active Users</p>
                                <p className="text-3xl font-bold text-green-700">
                                    {users.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Entrepreneurs</p>
                                <p className="text-3xl font-bold text-purple-700">
                                    {users.filter(u => u.userType === 'entrepreneur').length}
                                </p>
                            </div>
                            <Building className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Partners</p>
                                <p className="text-3xl font-bold text-orange-700">
                                    {users.filter(u => u.userType === 'partner').length}
                                </p>
                            </div>
                            <Crown className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users by name, email, or district..."
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Users className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {userTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            <div className="flex items-center gap-2">
                                                {getUserTypeIcon(type)}
                                                <span className="capitalize">{type}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader>
                    <CardTitle>Platform Users</CardTitle>
                    <CardDescription>
                        Manage and monitor all registered users on the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">District</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Last Login</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Businesses</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getUserTypeBadge(user.userType)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-slate-400" />
                                            <span className="text-sm text-slate-600">{user.district}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-600">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-slate-700">{user.businessesCount}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setViewUser(user)}
                                                className="hover:bg-emerald-50 hover:border-emerald-300"
                                            >
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-blue-50 hover:border-blue-300"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "No users have been registered yet"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View User Dialog */}
            <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {viewUser?.firstName} {viewUser?.lastName}
                        </DialogTitle>
                        <DialogDescription>
                            Complete user profile and activity information
                        </DialogDescription>
                    </DialogHeader>

                    {viewUser && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">User Status</h3>
                                {getStatusBadge(viewUser.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-emerald-600">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {viewUser.firstName} {viewUser.lastName}</div>
                                        <div><strong>Email:</strong> {viewUser.email}</div>
                                        <div><strong>Phone:</strong> {viewUser.phone}</div>
                                        <div><strong>District:</strong> {viewUser.district}</div>
                                        <div><strong>User Type:</strong> {getUserTypeBadge(viewUser.userType)}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-emerald-600">Activity Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Registration Date:</strong> {new Date(viewUser.registrationDate).toLocaleDateString()}</div>
                                        <div><strong>Last Login:</strong> {new Date(viewUser.lastLogin).toLocaleDateString()}</div>
                                        <div><strong>Businesses:</strong> {viewUser.businessesCount}</div>
                                        <div><strong>Total Donations:</strong> Le {viewUser.totalDonations.toLocaleString()}</div>
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