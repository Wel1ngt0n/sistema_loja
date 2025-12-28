import React from 'react';
import { Dialog, DialogContent, Button, Typography, Box, Grid } from '@mui/material';
import type { Product } from '../../../types';

interface UpsellModalProps {
    open: boolean;
    products: Product[];
    onClose: () => void;
    onAddProduct: (product: Product) => void;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ open, products, onClose, onAddProduct }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
        >
            <DialogContent>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        Que tal experimentar também?
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Aproveite para complementar seu pedido
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {products.map(product => (
                        <Grid item xs={12} sm={4} key={product.id}>
                            <Box
                                border={1}
                                borderColor="grey.200"
                                borderRadius={4}
                                p={2}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                height="100%"
                                sx={{ transition: 'all 0.2s', '&:hover': { transform: 'scale(1.02)', borderColor: 'primary.main' } }}
                            >
                                <Box
                                    component="img"
                                    src={product.image_url || 'https://placehold.co/150x150'}
                                    alt={product.name}
                                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 4, mb: 2 }}
                                />
                                <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Typography variant="h6" color="primary" fontWeight="800" mb={2}>
                                    + R$ {Number(product.price).toFixed(2)}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => onAddProduct(product)}
                                    sx={{ mt: 'auto', borderRadius: 99, fontWeight: 'bold', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                                >
                                    ADICIONAR
                                </Button>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box mt={4} textAlign="center">
                    <Button
                        onClick={onClose}
                        size="large"
                        color="inherit"
                        sx={{ fontWeight: 'bold', fontSize: '1rem', px: 4 }}
                    >
                        Não, obrigado. Finalizar pedido &gt;
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UpsellModal;
