import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface OrderTimerProps {
    createdAt: string;
}

const OrderTimer: React.FC<OrderTimerProps> = ({ createdAt }) => {
    const [elapsed, setElapsed] = useState<number>(0);

    useEffect(() => {
        const calculateElapsed = () => {
            const start = new Date(createdAt).getTime();
            const now = new Date().getTime();
            return Math.floor((now - start) / 1000 / 60); // Minutes
        };

        setElapsed(calculateElapsed());
        const interval = setInterval(() => setElapsed(calculateElapsed()), 60000); // Update every minute
        return () => clearInterval(interval);
    }, [createdAt]);

    let color = 'text.secondary';
    let bgcolor = 'transparent';

    if (elapsed > 20) {
        color = 'error.main';
        bgcolor = 'error.lighter';
    } else if (elapsed > 10) {
        color = 'warning.main';
        bgcolor = 'warning.lighter';
    } else {
        color = 'success.main';
        bgcolor = 'success.lighter'; // Need to ensure these exist or use standard
    }

    // Fallback colors if theme 'lighter' not defined
    if (elapsed > 20) color = '#d32f2f'; // Red
    else if (elapsed > 10) color = '#ed6c02'; // Orange
    else color = '#2e7d32'; // Green

    return (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ color: color, bgcolor: bgcolor, px: 1, py: 0.5, borderRadius: 1 }}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2" fontWeight="bold">
                {elapsed} min
            </Typography>
        </Box>
    );
};

export default OrderTimer;
