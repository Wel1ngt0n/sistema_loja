import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Chip, IconButton, CircularProgress, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../../../services/api';
import type { Order } from '../../../types';

interface OrderQueueProps {
    onSelectOrder: (order: Order) => void;
}

const OrderQueue: React.FC<OrderQueueProps> = ({ onSelectOrder }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch PENDING, PREPARING, READY
            const res = await api.get('/pdv/orders?status=PENDING,PREPARING,READY');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling every 15s
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'READY': return 'success';
            case 'PREPARING': return 'warning';
            case 'PENDING': return 'default';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'READY': return 'PRONTO';
            case 'PREPARING': return 'PREPARANDO';
            case 'PENDING': return 'PENDENTE';
            default: return status;
        }
    };

    return (
        <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box p={2} bgcolor="white" borderBottom={1} borderColor="divider" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Pedidos (Totem)</Typography>
                <IconButton onClick={fetchOrders} size="small">
                    <RefreshIcon />
                </IconButton>
            </Box>

            <Box flexGrow={1} overflow="auto">
                {loading && orders.length === 0 && (
                    <Box textAlign="center" p={2}><CircularProgress size={24} /></Box>
                )}

                <List sx={{ p: 2 }}>
                    {orders.map((order) => (
                        <ListItem
                            key={order.id}
                            disablePadding
                            sx={{ mb: 2 }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'grey.50',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'white', boxShadow: 2, borderColor: 'primary.main' }
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                                    <Typography fontWeight="800" variant="subtitle1">#{order.order_number}</Typography>
                                    <Chip
                                        label={getStatusLabel(order.status)}
                                        color={getStatusColor(order.status) as any}
                                        size="small"
                                        sx={{ borderRadius: 1, fontWeight: 'bold' }}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {new Date(order.created_at).toLocaleTimeString()} • {order.items.length} itens
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onClick={() => onSelectOrder(order)}
                                    sx={{ mt: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Carregar Pedido
                                </Button>
                            </Paper>
                        </ListItem>
                    ))}
                    {!loading && orders.length === 0 && (
                        <Box p={4} textAlign="center">
                            <Typography color="text.secondary">Sem pedidos na fila</Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Paper>
    );
};

export default OrderQueue;
