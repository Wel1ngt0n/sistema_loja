import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, requiredPermission }) => {
    const { isAuthenticated, loading, user, hasPermission } = useAuth();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Role Check (if any matches)
    if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = user.is_super_admin || allowedRoles.some(role => user.roles.includes(role));
        if (!hasRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Permission Check
    if (requiredPermission) {
        if (!hasPermission(requiredPermission)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
