import React, {useMemo} from "react";
import Link from "next/link";
import {Mail, Phone, Globe, Building2, CheckCircle, XCircle, Clock} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useGetProviderQuery} from "@/hooks/repository/use-funding";
import type {User} from "@/types/user";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    showAlert: (alert: boolean) => void;

    // Callbacks to perform approval/rejection (e.g., API calls + cache invalidation)
    onStatusChange: (status: "Approve" | "Reject") => void;
};

function StatusBadge({approved, status}: { approved: boolean; status: string }) {
    if (approved) {
        return (
            <Badge className="bg-green-100 text-green-800 border-green-200 flex gap-1 items-center">
                <CheckCircle className="h-3.5 w-3.5"/>
                Approved
            </Badge>
        );
    }
    if (status === "suspended") {
        return (
            <Badge className="bg-red-100 text-red-800 border-red-200 flex gap-1 items-center">
                <XCircle className="h-3.5 w-3.5"/>
                Suspended
            </Badge>
        );
    }
    return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex gap-1 items-center">
            <Clock className="h-3.5 w-3.5"/>
            Pending
        </Badge>
    );
}

export default function UserProviderDetailsDialog({
                                                      open,
                                                      onOpenChange,
                                                      user,
                                                      onStatusChange,
                                                      showAlert
                                                  }: Props) {
    const providerId = user?.devPartnerId ?? "";
    const {data: provider, isLoading, isError} = useGetProviderQuery(providerId);

    const initials = useMemo(
        () =>
            ((user?.firstName?.[0] ?? "").toUpperCase() +
                (user?.lastName?.[0] ?? "").toUpperCase()) || "U",
        [user?.firstName, user?.lastName]
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-3xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                        <div
                            className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center">
                            <span className="text-sm font-semibold">{initials}</span>
                        </div>
                        <span>
                            {user?.firstName} {user?.lastName}
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        Detailed user information with linked funding provider
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 pb-6">
                    {/* Top meta */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge approved={!!user?.approved} status={user?.status ?? ""}/>
                            {user?.devPartnerName && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Building2 className="h-3.5 w-3.5"/>
                                    {user.devPartnerName}
                                </Badge>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Registered:{" "}
                            {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "Unknown"}
                        </div>
                    </div>

                    <Separator className="my-6"/>

                    {/* Content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User details */}
                        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-5">
                            <h3 className="text-lg font-semibold mb-4 text-emerald-600">User Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Name</span>
                                    <span className="font-medium text-right">
                                        {user?.firstName} {user?.lastName}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Email</span>
                                    <span className="font-medium text-right break-all inline-flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-500"/>
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Phone</span>
                                    <span className="font-medium text-right inline-flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-slate-500"/>
                                        {user?.phone || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Gender</span>
                                    <span className="font-medium text-right">{user?.gender || "—"}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium text-right capitalize">
                                        {user?.status || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <span className="text-muted-foreground">Approved</span>
                                    <span className="font-medium text-right">
                                        {user?.approved ? "Yes" : "No"}
                                    </span>
                                </div>
                                {user?.updatedAt && (
                                    <div className="flex justify-between gap-3">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <span className="font-medium text-right">
                                            {new Date(user.updatedAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Provider details */}
                        <div className="rounded-xl border bg-white dark:bg-zinc-900 p-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-emerald-600">Funding Provider</h3>
                                {provider?.providerType && (
                                    <Badge variant="secondary" className="capitalize">
                                        {String(provider.providerType).toLowerCase().replaceAll("_", " ")}
                                    </Badge>
                                )}
                            </div>

                            {/* Loading state */}
                            {isLoading && (
                                <div className="mt-4 space-y-3">
                                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"/>
                                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"/>
                                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"/>
                                    <div className="h-4 w-3/5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"/>
                                </div>
                            )}

                            {/* Error / Empty state */}
                            {!isLoading && (isError || !provider) && (
                                <div className="mt-4 text-sm text-muted-foreground">
                                    {providerId ? "Unable to load provider details." : "No linked provider found."}
                                </div>
                            )}

                            {/* Provider content */}
                            {!isLoading && provider && (
                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between gap-3">
                                        <span className="text-muted-foreground">Name</span>
                                        <span className="font-medium text-right">{provider.name}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span className="text-muted-foreground">Email</span>
                                        <span className="font-medium text-right inline-flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-slate-500"/>
                                            {provider.contactEmail || "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span className="text-muted-foreground">Phone</span>
                                        <span className="font-medium text-right inline-flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-slate-500"/>
                                            {provider.contactPhone || "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span className="text-muted-foreground">Website</span>
                                        <span className="font-medium text-right inline-flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-slate-500"/>
                                            {provider.websiteUrl ? (
                                                <Link
                                                    href={provider.websiteUrl}
                                                    target="_blank"
                                                    className="text-emerald-600 hover:underline break-all"
                                                >
                                                    {provider.websiteUrl}
                                                </Link>
                                            ) : (
                                                "—"
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Description</span>
                                        <p className="mt-1 font-medium leading-relaxed">
                                            {provider.description || "—"}
                                        </p>
                                    </div>
                                    {provider.createdAt && (
                                        <div className="flex justify-between gap-3">
                                            <span className="text-muted-foreground">Created</span>
                                            <span className="font-medium text-right">
                                                {new Date(provider.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-6"/>

                    {/* Footer actions */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>User ID:</span>
                            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                {user?.id || "—"}
                            </code>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onStatusChange("Reject")
                                    showAlert(true)
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                    onStatusChange("Approve")
                                    showAlert(true)
                                }}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}