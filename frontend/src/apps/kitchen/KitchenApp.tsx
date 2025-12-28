import React, { useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../../services/api';
import KanbanBoard from './components/KanbanBoard';
import type { Order } from '../../types';

const KitchenApp: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            // Fetch PENDING, PREPARING and READY (to show finished ones briefly or persistent)
            // Backend supports comma separated status
            const response = await api.get('/orders?status=PENDING,PREPARING,READY');
            setOrders(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos da cozinha", error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling every 5s
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (orderId: number, newStatus: string) => {
        try {
            // Optimistic update
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status: newStatus as any } : o
            ));

            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh to ensure sync
        } catch (error) {
            console.error("Erro ao atualizar status", error);
            fetchOrders(); // Revert on error
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#F6F7F9' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'warning.main', color: 'white' }}>
                <Toolbar>
                    <RestaurantIcon sx={{ mr: 2 }} />
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: '800', letterSpacing: '-0.5px' }}>
                        Cozinha <Typography component="span" variant="h5" color="inherit" fontWeight="400" sx={{ opacity: 0.8 }}>KDS</Typography>
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box flexGrow={1} overflow="hidden">
                <KanbanBoard orders={orders} onAction={handleUpdateStatus} />
            </Box>
        </Box>
    );
};

export default KitchenApp;
