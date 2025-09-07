import {signOut, useSession} from 'next-auth/react';
// import {Role} from "@/types/api-types";
import {redirect} from "next/navigation";

export function usePermissions1() {
    const { data: session } = useSession();
    const hasPermission = (permissionId: string) => {
        return session?.user.roles.some((role: Role) =>
            role.permissions?.some(permission => permission.id === permissionId)
        );
    };
    const hasRole = (roleId: string) => {
        return session?.user.roles.some((role: Role) => role.id === roleId);
    };
    return { hasPermission, hasRole };
}

type Permission = { id: string };
type Role = { id: string; name?: string; permissions?: Permission[] };
type UserLike = { roles?: Role[] | null } | null | undefined;

const norm = (v?: string | null) => (v ?? '').trim().toLowerCase();

const collectPermissionIds = (user: UserLike): Set<string> => {
    const set = new Set<string>();
    user?.roles?.forEach(role => {
        role?.permissions?.forEach(p => {
            if (p?.id) set.add(norm(p.id));
        });
    });
    return set;
};

export const isAdmin = (user: UserLike): boolean =>
    !!user?.roles?.some(r => norm(r?.id) === 'admin' || norm(r?.name) === 'admin');

export const isEntrepreneur = (user: UserLike): boolean =>
    !!user?.roles?.some(r => norm(r?.id) === 'entrepreneur' || norm(r?.name) === 'entrepreneur');

export const isDevPartner = (user: UserLike): boolean =>
    !!user?.roles?.some(r => norm(r?.id) === 'development-partner' || norm(r?.name) === 'development-partner');

export const hasRole = (user: UserLike, roleIdOrName: string): boolean => {
    if (!user?.roles?.length) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const target = norm(roleIdOrName);
    return user.roles.some(r => norm(r?.id) === target || norm(r?.name) === target);
};

export const hasPermission = (user: UserLike, permissionId: string): boolean => {
    if (!permissionId) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const target = norm(permissionId);
    const userPerms = collectPermissionIds(user);
    return userPerms.has(target);
};

export const hasAnyPermission = (user: UserLike, permissionIds: string[]): boolean => {
    if (!permissionIds?.length) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const userPerms = collectPermissionIds(user);
    return permissionIds.some(p => userPerms.has(norm(p)));
};

export const hasAllPermissions = (user: UserLike, permissionIds: string[]): boolean => {
    if (!permissionIds?.length) return false;
    if (isAdmin(user)) return true; // admin shortcut
    const userPerms = collectPermissionIds(user);
    return permissionIds.every(p => userPerms.has(norm(p)));
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
        hasRole: (roleIdOrName: string) => hasRole(user, roleIdOrName),
        hasPermission: (permissionId: string) => hasPermission(user, permissionId),
        hasAnyPermission: (permissionIds: string[]) => hasAnyPermission(user, permissionIds),
        hasAllPermissions: (permissionIds: string[]) => hasAllPermissions(user, permissionIds),
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

