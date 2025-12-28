import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, Paper, Chip, Box, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../../../services/api';
import type { Order } from '../../../types';

interface OrderListProps {
    onSelectOrder: (order: Order) => void;
    selectedOrderId?: number;
}

const OrderList: React.FC<OrderListProps> = ({ onSelectOrder, selectedOrderId }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            // Get all orders and filter locally
            const res = await api.get('/orders');
            const activeOrders = res.data.filter((o: Order) =>
                ['PENDING', 'PREPARING', 'READY'].includes(o.status)
            );
            setOrders(activeOrders);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <Paper style={{ height: '100%', overflow: 'auto' }}>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center" bgcolor="primary.main" color="white">
                <Typography variant="h6">Pedidos (Totem)</Typography>
                <IconButton color="inherit" onClick={fetchOrders}><RefreshIcon /></IconButton>
            </Box>
            <List>
                {orders.map(order => (
                    <ListItem key={order.id} disablePadding>
                        <ListItemButton
                            selected={selectedOrderId === order.id}
                            onClick={() => onSelectOrder(order)}
                        >
                            <ListItemText
                                primary={`#${order.order_number} - R$ ${order.total?.toFixed(2) || '0.00'}`}
                                secondary={`${new Date(order.created_at).toLocaleTimeString()}`}
                            />
                            {order.status === 'READY' && <Chip label="PRONTO" color="success" size="small" />}
                            {order.status === 'PREPARING' && <Chip label="PREPARANDO" color="warning" size="small" />}
                            {order.status === 'PENDING' && <Chip label="PENDENTE" color="error" size="small" />}
                        </ListItemButton>
                    </ListItem>
                ))}
                {orders.length === 0 && (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">Nenhum pedido pendente</Typography>
                    </Box>
                )}
            </List>
        </Paper>
    );
};

export default OrderList;
