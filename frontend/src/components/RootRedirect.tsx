import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const RootRedirect: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (isAuthenticated && user) {
            // Smart Redirect based on Role
            if (user.roles.includes('SUPER_ADMIN') || user.roles.includes('ADMIN')) {
                navigate('/admin');
            } else if (user.roles.includes('KITCHEN')) {
                navigate('/kitchen');
            } else if (user.roles.includes('CASHIER')) {
                navigate('/pdv');
            } else {
                navigate('/totem'); // Default fallback for weird roles
            }
        } else {
            // Not authenticated -> Default Public App (Totem)
            navigate('/totem');
        }
    }, [isAuthenticated, user, loading, navigate]);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
        </Box>
    );
};

export default RootRedirect;
