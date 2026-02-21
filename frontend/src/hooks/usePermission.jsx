import { useAuth } from '../context/AuthContext';

/**
 * Hook to check if the current user has a specific permission.
 */
export const usePermission = () => {
    const { user } = useAuth();

    const hasPermission = (code) => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(code.toUpperCase());
    };

    return { hasPermission };
};

/**
 * Component and Guard for permission-based rendering.
 */
import React from 'react';

export const PermissionGate = ({ permission, children, fallback = null }) => {
    const { hasPermission } = usePermission();

    if (!hasPermission(permission)) {
        return fallback;
    }

    return <>{children}</>;
};
