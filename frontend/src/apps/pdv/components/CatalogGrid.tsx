import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Typography, Grid, Button, CircularProgress, Card, CardContent, CardActionArea } from '@mui/material';
import api from '../../../services/api';
import type { Product, Category } from '../../../types';

interface CatalogGridProps {
    onAddProduct: (product: Product) => void;
}

const CatalogGrid: React.FC<CatalogGridProps> = ({ onAddProduct }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        // Debounce search or load on category change
        const timeout = setTimeout(() => {
            loadProducts();
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, selectedCategory]);

    const loadCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.filter((c: Category) => c.active));
        } catch (error) {
            console.error(error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: any = { search };
            if (selectedCategory) params.category_id = selectedCategory;

            const res = await api.get('/pdv/products', { params });
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box p={2} bgcolor="white" borderBottom={1} borderColor="divider">
                <TextField
                    fullWidth
                    placeholder="Buscar Produto (Nome, ID...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="outlined"
                    size="small"
                    autoFocus
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 999, // Pill
                            bgcolor: 'background.paper'
                        }
                    }}
                />
                <Box mt={2} display="flex" gap={1} overflow="auto" pb={1} sx={{ '&::-webkit-scrollbar': { height: 6 } }}>
                    <Button
                        variant={selectedCategory === null ? "contained" : "text"}
                        size="small"
                        onClick={() => setSelectedCategory(null)}
                        sx={{ minWidth: 'auto', borderRadius: 4, px: 2 }}
                    >
                        Todos
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? "contained" : "text"}
                            size="small"
                            onClick={() => setSelectedCategory(cat.id)}
                            sx={{ minWidth: 'auto', whiteSpace: 'nowrap', borderRadius: 4, px: 2, color: selectedCategory === cat.id ? 'white' : 'text.secondary' }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </Box>
            </Box>
            <Box flexGrow={1} overflow="auto" p={2} bgcolor="#f8f9fa">
                {loading && <Box textAlign="center"><CircularProgress /></Box>}
                {!loading && (
                    <Grid container spacing={2}>
                        {products.map(product => (
                            <Grid size={{ xs: 6, md: 4, lg: 3 }} key={product.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        boxShadow: 1,
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                                    }}
                                >
                                    <CardActionArea onClick={() => onAddProduct(product)} sx={{ height: '100%', p: 1 }}>
                                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                            <Typography variant="body2" fontWeight="600" noWrap title={product.name} gutterBottom>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                                R$ {product.price.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                        {products.length === 0 && (
                            <Box width="100%" textAlign="center" mt={4}>
                                <Typography color="text.secondary">Nenhum produto encontrado</Typography>
                            </Box>
                        )}
                    </Grid>
                )}
            </Box>
        </Paper>
    );
};

export default CatalogGrid;
