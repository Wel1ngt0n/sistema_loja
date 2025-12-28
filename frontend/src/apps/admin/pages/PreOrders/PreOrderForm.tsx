import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Autocomplete, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import type { Product } from '../../../../types';

interface OrderItemDraft {
    product: Product;
    qty: number;
    desired_weight_kg?: number;
    notes?: string;
}

const PreOrderForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [notes, setNotes] = useState('');

    // Items State
    const [items, setItems] = useState<OrderItemDraft[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Add Item State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [weight, setWeight] = useState('');
    const [itemNotes, setItemNotes] = useState('');

    useEffect(() => {
        api.get('/products?active=true&per_page=100').then(res => {
            // API returns paginated: { items: [], ... }
            if (res.data.items && Array.isArray(res.data.items)) {
                setProducts(res.data.items);
            } else if (Array.isArray(res.data)) {
                // Fallback if API changes
                setProducts(res.data);
            }
        });
    }, []);

    const handleAddItem = () => {
        if (!selectedProduct) return;

        const newItem: OrderItemDraft = {
            product: selectedProduct,
            qty: qty,
            desired_weight_kg: weight ? parseFloat(weight) : undefined,
            notes: itemNotes
        };

        setItems([...items, newItem]);
        setSelectedProduct(null);
        setQty(1);
        setWeight('');
        setItemNotes('');
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => {
            const isWeight = ['KG', 'G', 'L', 'ML'].includes(item.product.unit);
            if (isWeight && item.desired_weight_kg) {
                return acc + (item.desired_weight_kg * item.product.price);
            }
            return acc + (item.qty * item.product.price);
        }, 0);
    };

    const handleSubmit = async () => {
        if (!customerName || !customerPhone || !pickupDate || !pickupTime || items.length === 0) {
            alert("Preencha todos os campos obrigatórios e adicione itens.");
            return;
        }

        setLoading(true);
        try {
            const pickupDateTime = `${pickupDate}T${pickupTime}:00`;

            const payload = {
                customer_name: customerName,
                customer_phone: customerPhone,
                pickup_datetime: pickupDateTime,
                notes: notes,
                items: items.map(i => ({
                    product_id: i.product.id,
                    qty: i.qty,
                    desired_weight_kg: i.desired_weight_kg,

                    price_per_kg: ['KG', 'G', 'L', 'ML'].includes(i.product.unit) ? i.product.price : undefined,
                    notes: i.notes
                }))
            };

            await api.post('/preorders', payload);
            navigate('/admin/preorders');
        } catch (error) {
            console.error(error);
            alert("Erro ao criar encomenda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3} maxWidth={1200} margin="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/preorders')} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Typography variant="h5" fontWeight="bold" mb={3}>Nova Encomenda</Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* Customer Info */}
                <Box width={{ xs: '100%', md: '35%' }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Dados do Cliente</Typography>
                        <TextField
                            fullWidth label="Nome do Cliente" margin="normal"
                            value={customerName} onChange={e => setCustomerName(e.target.value)}
                        />
                        <TextField
                            fullWidth label="Telefone / WhatsApp" margin="normal"
                            value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                        />
                        <Typography variant="subtitle2" mt={2} mb={1}>Data de Retirada</Typography>
                        <Box display="flex" gap={2}>
                            <TextField
                                type="date" fullWidth
                                value={pickupDate} onChange={e => setPickupDate(e.target.value)}
                            />
                            <TextField
                                type="time" fullWidth
                                value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                            />
                        </Box>
                        <TextField
                            fullWidth label="Observações Gerais" margin="normal" multiline rows={3}
                            value={notes} onChange={e => setNotes(e.target.value)}
                        />
                    </Paper>
                </Box>

                {/* Items */}
                <Box width={{ xs: '100%', md: '65%' }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>Itens da Encomenda</Typography>

                        <Box display="flex" gap={2} alignItems="flex-start" mb={2} flexWrap="wrap">
                            <Autocomplete
                                options={products}
                                getOptionLabel={(option) => `${option.name} (R$ ${option.price})`}
                                style={{ flex: 1, minWidth: 200 }}
                                value={selectedProduct}
                                onChange={(_, newVal) => setSelectedProduct(newVal)}
                                renderInput={(params) => <TextField {...params} label="Adicionar Produto" size="small" />}
                            />
                            {selectedProduct && ['KG', 'G', 'L', 'ML'].includes(selectedProduct.unit) ? (
                                <TextField
                                    label={`Peso/Qtd (${selectedProduct.unit})`}
                                    size="small"
                                    sx={{ width: 140 }}
                                    type="number"
                                    inputProps={{ step: "0.001" }}
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                />
                            ) : (
                                <TextField
                                    label="Qtd" size="small" type="number" sx={{ width: 80 }}
                                    value={qty} onChange={e => setQty(parseInt(e.target.value))}
                                />
                            )}
                            <TextField
                                label="Obs" size="small" sx={{ width: 150 }}
                                value={itemNotes} onChange={e => setItemNotes(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddItem} disabled={!selectedProduct}>
                                Add
                            </Button>
                        </Box>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell align="right">Qtd/Peso</TableCell>
                                    <TableCell align="right">Preço</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                    <TableCell width={50}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, idx) => {
                                    const isKg = ['KG', 'G', 'L', 'ML'].includes(item.product.unit);
                                    const subtotal = isKg && item.desired_weight_kg
                                        ? item.desired_weight_kg * item.product.price
                                        : item.qty * item.product.price;
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <Typography fontWeight="bold">{item.product.name}</Typography>
                                                {item.notes && <Typography variant="caption" color="text.secondary">{item.notes}</Typography>}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isKg ? `${item.desired_weight_kg} ${item.product.unit}` : item.qty}
                                            </TableCell>
                                            <TableCell align="right">
                                                R$ {item.product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                R$ {subtotal.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6">Total Estimado:</Typography>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                R$ {calculateTotal().toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ px: 4 }}
                >
                    Criar Encomenda
                </Button>
            </Box>
        </Box>
    );
};

export default PreOrderForm;
