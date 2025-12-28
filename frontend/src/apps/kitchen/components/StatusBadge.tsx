import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let label = status;
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

    switch (status) {
        case 'PENDING':
            label = 'NOVO';
            color = 'warning'; // Laranja para chamar atenção
            break;
        case 'PREPARING':
            label = 'PREPARANDO';
            color = 'info'; // Azul para processo
            break;
        case 'READY':
            label = 'PRONTO';
            color = 'success'; // Verde para fim
            break;
        default:
            label = status;
    }

    return (
        <Chip
            label={label}
            color={color}
            size="small"
            sx={{ fontWeight: 'bold', borderRadius: 1 }}
        />
    );
};

export default StatusBadge;
