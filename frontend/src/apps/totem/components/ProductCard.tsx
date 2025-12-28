import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip } from '@mui/material';
import type { Product } from '../../../types';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                }
            }}
        >
            <CardActionArea
                onClick={() => onAdd(product)}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    height: '100%'
                }}
            >
                <Box position="relative">
                    <CardMedia
                        component="img"
                        height="200" // Imagem maior (era 140)
                        image={product.image_url ? product.image_url : 'https://placehold.co/400x300?text=Sem+Foto'}
                        alt={product.name}
                        sx={{ objectFit: 'contain', p: 1 }}
                    />
                    {/* Tags (Ex: Destaque) */}
                    {product.featured && (
                        <Box position="absolute" top={12} left={12}>
                            <Chip
                                label="Destaque"
                                color="warning"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>
                    )}
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box mb={2}>
                        <Typography variant="h6" component="div" fontWeight="700" lineHeight={1.2} mb={1}>
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Limita a 2 linhas
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {product.description}
                        </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary.main" fontWeight="800">
                            R$ {Number(product.price).toFixed(2)}
                        </Typography>

                        {/* Botão de ação visual (fake) já que o card todo clica */}
                        <Typography variant="button" color="primary" fontWeight="bold">
                            Adicionar
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ProductCard;
