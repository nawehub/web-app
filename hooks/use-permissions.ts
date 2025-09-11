import {signOut, useSession} from 'next-auth/react';
import {redirect} from "next/navigation";
import {UserRole} from "@/types/user";

type Permission = { id: string };
type UserLike = { role?: UserRole | null } | null | undefined;

const norm = (v?: string | null) => (v ?? '').trim().toLowerCase();

const collectPermissionIds = (user: UserLike): Set<string> => {
    const set = new Set<string>();
    user?.role?.permissions?.forEach(p => {
        if (p) set.add(norm(p));
    });
    return set;
};

export const isAdmin = (user: UserLike): boolean =>
    user?.role?.name === "admin";

export const isEntrepreneur = (user: UserLike): boolean =>
    user?.role?.name === "entrepreneur";

export const isDevPartner = (user: UserLike): boolean =>
    user?.role?.name === "development-partner";

export const hasRole = (user: UserLike, roleName: string): boolean => {
    if (!user?.role) return false;
    if (isAdmin(user)) return true; // admin shortcut
    return user.role.name === roleName;
};

export const hasPermission = (user: UserLike, permission: string): boolean => {
    if (!permission) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const target = norm(permission);
    const userPerms = collectPermissionIds(user);
    return userPerms.has(target);
};

export const hasAnyPermission = (user: UserLike, permissions: string[]): boolean => {
    if (!permissions?.length) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const userPerms = collectPermissionIds(user);
    return permissions.some(p => userPerms.has(norm(p)));
};

export const hasAllPermissions = (user: UserLike, permissions: string[]): boolean => {
    if (!permissions?.length) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const userPerms = collectPermissionIds(user);
    return permissions.every(p => userPerms.has(norm(p)));
};

// React-friendly API: bind to a specific user (e.g., from your session)
export function usePermissions() {
    const { data: session } = useSession();
    if (!session) {
        signOut().then()
        redirect("/login");
    }
    const user = session.user;
    return {
        isAdmin: () => isAdmin(user),
        hasRole: (roleName: string) => hasRole(user, roleName),
        hasPermission: (permission: string) => hasPermission(user, permission),
        hasAnyPermission: (permissions: string[]) => hasAnyPermission(user, permissions),
        hasAllPermissions: (permissions: string[]) => hasAllPermissions(user, permissions),
        // Small alias that accepts either role or permission
        can: (opts: { role?: string; permission?: string; anyOf?: string[]; allOf?: string[] }) => {
            if (isAdmin(user)) return true;
            if (opts.role && hasRole(user, opts.role)) return true;
            if (opts.permission && hasPermission(user, opts.permission)) return true;
            if (opts.anyOf && hasAnyPermission(user, opts.anyOf)) return true;
            if (opts.allOf && hasAllPermissions(user, opts.allOf)) return true;
            return false;
        },
    };
}

