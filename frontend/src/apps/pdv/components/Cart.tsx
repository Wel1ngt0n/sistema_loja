import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, IconButton, Divider, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { SaleItem } from '../../../types';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface CartProps {
    items: SaleItem[];
    onRemoveItem: (index: number) => void;
    onClearCart: () => void;
    onPay: () => void;
    onAddDiscount: () => void;
    onSelectCustomer: () => void;
    selectedCustomer: { id: number; name: string } | null;
    subtotal: number;
    discount: number;
    total: number;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onClearCart, onPay, onAddDiscount, onSelectCustomer, selectedCustomer, subtotal, discount, total }) => {
    return (
        <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box p={2} bgcolor="white" borderBottom={1} borderColor="divider" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Carrinho</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={selectedCustomer ? <PersonIcon /> : <PersonAddIcon />}
                    onClick={onSelectCustomer}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    {selectedCustomer ? selectedCustomer.name.split(' ')[0] : 'Cliente'}
                </Button>
            </Box>

            <Box flexGrow={1} overflow="auto">
                <List dense>
                    {items.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => onRemoveItem(idx)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${item.qty}x ${item.product_name}`}
                                    secondary={`R$ ${item.total_price.toFixed(2)}`}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                    {items.length === 0 && (
                        <Box p={4} textAlign="center">
                            <Typography color="text.secondary">Carrinho vazio</Typography>
                        </Box>
                    )}
                </List>
            </Box>

            <Paper square elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight="500">R$ {subtotal.toFixed(2)}</Typography>
                </Box>
                {discount > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1} color="success.main">
                        <Typography>Desconto</Typography>
                        <Typography>- R$ {discount.toFixed(2)}</Typography>
                    </Box>
                )}
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="800">Total</Typography>
                    <Typography variant="h5" fontWeight="800" color="primary">R$ {total.toFixed(2)}</Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button variant="outlined" color="error" sx={{ flex: 1, borderRadius: 2 }} onClick={onClearCart} disabled={items.length === 0}>
                        Cancelar
                    </Button>
                    <Button variant="outlined" color="warning" sx={{ flex: 1, borderRadius: 2 }} onClick={onAddDiscount} disabled={items.length === 0}>
                        Desc.
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={onPay}
                    disabled={items.length === 0}
                    sx={{
                        mt: 2,
                        height: 56,
                        borderRadius: 3,
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        boxShadow: 3
                    }}
                >
                    PAGAR (F4)
                </Button>
            </Paper>
        </Paper>
    );
};


export default Cart;
