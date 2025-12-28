import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade, Container } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface OrderSuccessScreenProps {
    orderNumber: string;
    onReset: () => void;
}

const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ orderNumber, onReset }) => {
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onReset();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onReset]);

    return (
        <Fade in={true} timeout={500}>
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgcolor="success.main"
                zIndex={9999}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                color="white"
            >
                <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 120, mb: 4, opacity: 0.9 }} />

                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Pedido Enviado!
                    </Typography>

                    <Typography variant="h6" sx={{ opacity: 0.9, mb: 6 }}>
                        Aguarde sua senha ser chamada no painel.
                    </Typography>

                    <Box
                        bgcolor="white"
                        color="success.main"
                        py={4}
                        px={6}
                        borderRadius={6}
                        boxShadow={3}
                        mb={6}
                    >
                        <Typography variant="overline" color="text.secondary" fontWeight="bold" fontSize="1rem">
                            SUA SENHA
                        </Typography>
                        <Typography variant="h1" fontWeight="900" sx={{ fontSize: '6rem', lineHeight: 1 }}>
                            {orderNumber}
                        </Typography>
                    </Box>

                    <Box
                        border={1}
                        borderColor="rgba(255,255,255,0.3)"
                        borderRadius={99}
                        py={1.5}
                        px={4}
                        onClick={onReset}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        <Typography variant="button" fontWeight="bold">
                            Voltar ao início ({timeLeft}s)
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Fade>
    );
};

export default OrderSuccessScreen;
