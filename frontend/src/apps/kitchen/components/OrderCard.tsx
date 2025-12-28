import React from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'; // Icon for Totem/Mobile
import MonitorIcon from '@mui/icons-material/Monitor'; // Icon for PDV
import OrderTimer from './OrderTimer';
import StatusBadge from './StatusBadge';
import type { Order } from '../../../types';

interface OrderCardProps {
    order: Order;
    onAction: (id: number, status: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onAction }) => {
    // Determine border color based on status
    const getStatusColor = () => {
        if (order.status === 'PREPARING') return 'info.main';
        if (order.status === 'READY') return 'success.main';
        return 'warning.main'; // PENDING
    };

    const isTotem = order.origin === 'TOTEM'; // Assuming origin field exists or inferring

    return (
        <Paper
            elevation={2}
            sx={{
                borderRadius: 4, // 16px radius
                borderLeft: 6,
                borderColor: getStatusColor(),
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                }
            }}
        >
            {/* Header */}
            <Box p={2} borderBottom="1px solid" borderColor="divider" bgcolor="grey.50">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h5" fontWeight="800" color="text.primary">
                            #{order.order_number}
                        </Typography>
                        {isTotem ? (
                            <PhoneIphoneIcon fontSize="small" color="disabled" titleAccess="Origem: Totem" />
                        ) : (
                            <MonitorIcon fontSize="small" color="disabled" titleAccess="Origem: PDV" />
                        )}
                    </Box>
                    <OrderTimer createdAt={order.created_at} />
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <StatusBadge status={order.status} />
                    <Typography variant="caption" color="text.secondary">
                        {order.items.length} itens
                    </Typography>
                </Box>
            </Box>

            {/* Body */}
            <Box p={0} flexGrow={1}>
                <List dense sx={{ py: 0 }}>
                    {order.items.map((item, idx) => (
                        <ListItem key={idx} divider={idx < order.items.length - 1} sx={{ py: 1.5, px: 2 }}>
                            <ListItemText
                                primary={
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography fontWeight="600" variant="body1">
                                            {item.qty}x {item.product_name}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    item.notes && (
                                        <Box mt={0.5} bgcolor="warning.lighter" p={0.5} borderRadius={1} color="warning.dark">
                                            <Typography variant="body2" fontWeight="bold">
                                                Observation: {item.notes}
                                            </Typography>
                                        </Box>
                                    )
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Actions */}
            <Box p={2} borderTop="1px solid" borderColor="divider">
                {order.status === 'PENDING' && (
                    <Button
                        variant="contained"
                        color="primary" // Changed from generic color to primary
                        fullWidth
                        size="large"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => onAction(order.id, 'PREPARING')}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Iniciar Preparo
                    </Button>
                )}
                {order.status === 'PREPARING' && (
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onAction(order.id, 'READY')}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                    >
                        Pronto!
                    </Button>
                )}
                {order.status === 'READY' && (
                    <Typography variant="caption" color="success.main" display="block" textAlign="center" fontWeight="bold">
                        AGUARDANDO RETIRADA
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default OrderCard;
