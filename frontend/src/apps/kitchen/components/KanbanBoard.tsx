import React from 'react';
import { Box } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import type { Order } from '../../../types';

interface KanbanBoardProps {
    orders: Order[];
    onAction: (id: number, status: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onAction }) => {
    // Filter orders by status
    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');
    const readyOrders = orders.filter(o => o.status === 'READY');

    return (
        <Box p={3} height="100%" overflow="hidden">
            <Box
                display="grid"
                gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
                gap={3}
                height="100%"
            >
                {/* Column 1: PENDING */}
                <Box height="100%" minWidth={0}>
                    <KanbanColumn
                        title="A FAZER"
                        status="PENDING"
                        orders={pendingOrders}
                        color="warning.main"
                        onAction={onAction}
                    />
                </Box>

                {/* Column 2: PREPARING */}
                <Box height="100%" minWidth={0}>
                    <KanbanColumn
                        title="PREPARANDO"
                        status="PREPARING"
                        orders={preparingOrders}
                        color="info.main"
                        onAction={onAction}
                    />
                </Box>

                {/* Column 3: READY */}
                <Box height="100%" minWidth={0}>
                    <KanbanColumn
                        title="PRONTO"
                        status="READY"
                        orders={readyOrders}
                        color="success.main"
                        onAction={onAction}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default KanbanBoard;
