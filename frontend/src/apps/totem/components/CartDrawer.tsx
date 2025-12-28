import React from 'react';
import { Drawer, Box, Typography, List, ListItem, IconButton, Button, Divider, Chip, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Product } from '../../../types';

interface CartItem {
    product: Product;
    qty: number;
    notes?: string;
    kitOptions?: string[];
}

interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
    cart: CartItem[];
    onUpdateQty: (index: number, delta: number) => void;
    onRemove: (index: number) => void;
    onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, cart, onUpdateQty, onRemove, onCheckout }) => {
    const total = cart.reduce((acc, item) => acc + (item.qty * item.product.price), 0);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, borderRadius: { xs: 0, sm: '24px 0 0 24px' } }
            }}
        >
            <Box display="flex" flexDirection="column" height="100%" bgcolor="background.default">
                {/* Header do Drawer */}
                <Box p={3} bgcolor="white" display="flex" justifyContent="space-between" alignItems="center" boxShadow={1} zIndex={1}>
                    <Typography variant="h5" fontWeight="800">Seu Pedido</Typography>
                    <IconButton onClick={onClose} size="large" sx={{ bgcolor: 'grey.100' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Lista de Itens */}
                <Box flexGrow={1} overflow="auto" p={2}>
                    {cart.length === 0 ? (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" opacity={0.5}>
                            <Box sx={{ fontSize: 60, mb: 2 }}>🛒</Box>
                            <Typography variant="h6" color="text.secondary">Seu carrinho está vazio</Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {cart.map((item, index) => (
                                <Paper key={index} elevation={0} sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1" fontWeight="700" lineHeight={1.2}>
                                            {item.product.name}
                                        </Typography>
                                        <Typography variant="body1" fontWeight="700" color="primary">
                                            R$ {(item.product.price * item.qty).toFixed(2)}
                                        </Typography>
                                    </Box>

                                    {/* Notas e Opções */}
                                    {(item.notes || (item.kitOptions && item.kitOptions.length > 0)) && (
                                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                            {item.kitOptions?.map((opt, i) => (
                                                <Chip key={i} label={opt} size="small" variant="outlined" />
                                            ))}
                                            {/* Fallback para notes se não for kit estruturado ou se tiver obs extra */}
                                            {item.notes && !item.kitOptions && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {item.notes}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Controles */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" bgcolor="grey.100" borderRadius={99} p={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQty(index, -1)}
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' }, boxShadow: 1, width: 32, height: 32 }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>

                                            <Typography sx={{ mx: 2.5, fontWeight: 'bold' }}>{item.qty}</Typography>

                                            <IconButton
                                                size="small"
                                                onClick={() => onUpdateQty(index, 1)}
                                                sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' }, boxShadow: 1, color: 'primary.main', width: 32, height: 32 }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onRemove(index)}
                                            sx={{ opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'error.50' } }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer Fixo */}
                <Paper elevation={4} sx={{ p: 3, borderRadius: '24px 24px 0 0', bgcolor: 'white' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" color="text.secondary">Total</Typography>
                        <Typography variant="h4" fontWeight="800" color="primary">R$ {total.toFixed(2)}</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={onCheckout}
                        disabled={cart.length === 0}
                        sx={{
                            height: 64,
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            borderRadius: 4
                        }}
                    >
                        Finalizar Pedido
                    </Button>
                </Paper>
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
