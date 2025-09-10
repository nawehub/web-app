"use client";

import {useState, useMemo} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {
    Users,
    Search,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
} from "lucide-react";
import {useListUsersRequireApprovalQuery} from "@/hooks/repository/use-user";
import { User as UserDetail } from "@/types/user";
import UserProviderDetailsDialog from "@/app/dashboard/users/_components/get-partner-dialog";
import {ApproveRejectUserDialog} from "@/app/dashboard/users/_components/approve-reject-dialog";

export default function ListRequireApproval() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [viewUser, setViewUser] = useState<UserDetail | null>(null);
    const {data, isLoading} = useListUsersRequireApprovalQuery()
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"Approve" | "Reject">();
    const [showAlert, setShowAlert] = useState(false);

    const filteredUsers = useMemo(() => {
        return data?.users.filter(user => {
            const matchesSearch =
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data?.users, searchTerm, statusFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active":
                return <CheckCircle className="h-4 w-4 text-green-500"/>;
            case "inactive":
                return <Clock className="h-4 w-4 text-yellow-500"/>;
            case "suspended":
                return <XCircle className="h-4 w-4 text-red-500"/>;
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

    return (
        <div className="space-y-6 mt-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Development Partners Request
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        List of Unapproved Development Partners. You can approve or reject their request.
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
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
                                    <Filter className="h-4 w-4 mr-2"/>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader>
                    <CardTitle>{data?.total} - Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Phone Number</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Development Partner</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Registered On</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers?.map((user) => (
                                <tr key={user.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
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
                                        <span
                                            className="text-sm font-medium text-slate-700">{user.phone}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm text-slate-600">{user.devPartnerName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusBadge(user.approved ? "active" : "inactive")}
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className="text-sm text-slate-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setViewUser(user)
                                                    setOpen(true)
                                                }}
                                                className="hover:bg-emerald-50 hover:border-emerald-300"
                                            >
                                                <Eye className="h-3 w-3"/>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers?.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "No users have been registered yet"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ApproveRejectUserDialog userId={viewUser?.id!} action={selectedStatus as "Approve" | "Reject"} openAlert={showAlert} openAlertAction={setShowAlert} openModalAction={setOpen} />

            {/* View User Dialog */}
            <UserProviderDetailsDialog open={open} onOpenChange={setOpen} user={viewUser} onStatusChange={setSelectedStatus} showAlert={setShowAlert} />
        </div>
    );
}