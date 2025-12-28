import React from 'react';
import { Box, Typography } from '@mui/material';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';

interface OfflineBannerProps {
    visible: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
    if (!visible) return null;

    return (
        <Box
            position="fixed"
            bottom={24}
            left="50%"
            sx={{ transform: 'translateX(-50%)' }}
            bgcolor="warning.main"
            color="warning.contrastText"
            py={1.5}
            px={3}
            borderRadius={99}
            textAlign="center"
            zIndex={9999}
            display="flex"
            gap={1.5}
            alignItems="center"
            boxShadow={4}
        >
            <SignalWifiStatusbarConnectedNoInternet4Icon />
            <Typography variant="body2" fontWeight="bold">
                Sem conexão. Modo Offline ativado.
            </Typography>
        </Box>
    );
};

export default OfflineBanner;
