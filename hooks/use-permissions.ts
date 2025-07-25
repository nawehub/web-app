import { useSession } from 'next-auth/react';
import {Role} from "@/types/api-types";

export function usePermissions() {
    const { data: session } = useSession();
    const hasPermission = (permissionId: string) => {
        return session?.user.roles.some((role: Role) =>
            role.permissions.some(permission => permission.id === permissionId)
        );
    };
    const hasRole = (roleId: string) => {
        return session?.user.roles.some((role: Role) => role.id === roleId);
    };
    return { hasPermission, hasRole };
}
