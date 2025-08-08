import {useSession} from "next-auth/react";
import {hasAllPermissions, hasAnyPermission, hasPermission, hasRole, isAdmin} from "@/hooks/use-permissions";
import React from "react";

type IfAllowedProps = {
    role?: string;
    permission?: string;
    anyOf?: string[];
    allOf?: string[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};

export function IfAllowed(props: IfAllowedProps) {
    const { data: session } = useSession();
    const { role, permission, anyOf, allOf, fallback = null, children } = props;
    const allowed =
        isAdmin(session?.user) ||
        (role ? hasRole(session?.user, role) : false) ||
        (permission ? hasPermission(session?.user, permission) : false) ||
        (anyOf ? hasAnyPermission(session?.user, anyOf) : false) ||
        (allOf ? hasAllPermissions(session?.user, allOf) : false);

    return <>{allowed ? children : fallback}</>;
}
