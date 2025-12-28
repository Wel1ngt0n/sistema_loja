import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import OrderCard from './OrderCard';
import type { Order } from '../../../types';

interface KanbanColumnProps {
    title: string;
    orders: Order[];
    status: string; // PENDING, PREPARING, READY
    color: string;
    onAction: (id: number, status: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, orders, color, onAction }) => {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'grey.100', // Slightly darker than main bg
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Header */}
            <Box
                p={2}
                bgcolor="white"
                borderBottom="1px solid"
                borderColor="divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Box width={12} height={12} borderRadius="50%" bgcolor={color} />
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                </Box>
                <Chip label={orders.length} size="small" sx={{ fontWeight: 'bold' }} />
            </Box>

            {/* Body */}
            <Box
                p={2}
                flexGrow={1}
                overflow="auto"
                sx={{
                    // Custom Scrollbar
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 }
                }}
            >
                <Stack spacing={2}>
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} onAction={onAction} />
                    ))}
                    {orders.length === 0 && (
                        <Box textAlign="center" py={4} color="text.disabled">
                            <Typography variant="body2">Sem pedidos</Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default KanbanColumn;
