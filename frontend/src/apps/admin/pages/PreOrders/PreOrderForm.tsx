import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Autocomplete, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
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
    const { id } = useParams(); // Get ID from URL
    const isEditMode = !!id;

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
        // Fetch Products
        api.get('/products?active=true&per_page=100').then(res => {
            if (res.data.items && Array.isArray(res.data.items)) {
                setProducts(res.data.items);
            } else if (Array.isArray(res.data)) {
                setProducts(res.data);
            }
        });

        // Fetch Order if Edit Mode
        if (isEditMode) {
            setLoading(true);
            api.get(`/preorders/${id}`).then(res => {
                const order = res.data;
                setCustomerName(order.customer_name);
                setCustomerPhone(order.customer_phone);
                setNotes(order.notes || '');

                if (order.pickup_datetime) {
                    const dt = new Date(order.pickup_datetime);
                    // Format to YYYY-MM-DD and HH:MM
                    setPickupDate(dt.toISOString().split('T')[0]);
                    setPickupTime(dt.toTimeString().slice(0, 5));
                }

                // Map items
                // Need to ensure product object structure matches what Autocomplete expects or create minimal version
                const mappedItems: OrderItemDraft[] = order.items.map((i: any) => ({
                    product: i.product, // Assuming backend returns nested product
                    qty: i.qty,
                    desired_weight_kg: i.desired_weight_kg,
                    notes: i.notes
                }));
                setItems(mappedItems);
            }).catch(err => {
                console.error(err);
                alert("Erro ao carregar encomenda para edição.");
                navigate('/admin/preorders');
            }).finally(() => setLoading(false));
        }
    }, [id, isEditMode, navigate]);

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

            if (isEditMode) {
                await api.put(`/preorders/${id}`, payload);
            } else {
                await api.post('/preorders', payload);
            }

            navigate('/admin/preorders');
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar encomenda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={{ xs: 2, md: 3 }} maxWidth={1200} margin="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/preorders')} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Typography variant="h5" fontWeight="bold" mb={3}>
                {isEditMode ? 'Editar Encomenda' : 'Nova Encomenda'}
            </Typography>

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

                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="flex-start" mb={2}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(option) => `${option.name} (R$ ${option.price})`}
                                sx={{ width: { xs: '100%', md: 'auto' }, flex: 1 }}
                                value={selectedProduct}
                                onChange={(_, newVal) => setSelectedProduct(newVal)}
                                renderInput={(params) => <TextField {...params} label="Adicionar Produto" size="small" />}
                            />

                            <Box display="flex" gap={2} width={{ xs: '100%', md: 'auto' }}>
                                {selectedProduct && ['KG', 'G', 'L', 'ML'].includes(selectedProduct.unit) ? (
                                    <TextField
                                        label={`Peso (${selectedProduct.unit})`}
                                        size="small"
                                        sx={{ width: { xs: '100px', md: 140 } }}
                                        type="number"
                                        inputProps={{ step: "0.001" }}
                                        value={weight}
                                        onChange={e => setWeight(e.target.value)}
                                    />
                                ) : (
                                    <TextField
                                        label="Qtd" size="small" type="number" sx={{ width: { xs: '80px', md: 80 } }}
                                        value={qty} onChange={e => setQty(parseInt(e.target.value))}
                                    />
                                )}
                                <TextField
                                    label="Obs" size="small" sx={{ flex: 1, minWidth: { xs: 0, md: 150 } }}
                                    value={itemNotes} onChange={e => setItemNotes(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddItem}
                                    disabled={!selectedProduct}
                                    sx={{ minWidth: 80 }}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>

                        {/* Desktop Item Table */}
                        <Box sx={{ overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
                            <Table size="small" sx={{ minWidth: 500 }}>
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
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">Nenhum item adicionado</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>

                        {/* Mobile Item List (Cards) */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                            {items.map((item, idx) => {
                                const isKg = ['KG', 'G', 'L', 'ML'].includes(item.product.unit);
                                const subtotal = isKg && item.desired_weight_kg
                                    ? item.desired_weight_kg * item.product.price
                                    : item.qty * item.product.price;
                                return (
                                    <Paper key={idx} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography fontWeight="bold" variant="subtitle1">{item.product.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {isKg ? `${item.desired_weight_kg} ${item.product.unit}` : `${item.qty} un`} x R$ {item.product.price.toFixed(2)}
                                            </Typography>
                                            {item.notes && (
                                                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                                                    Obs: {item.notes}
                                                </Typography>
                                            )}
                                            <Typography variant="subtitle2" color="primary.main" mt={0.5}>
                                                Total: R$ {subtotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Paper>
                                );
                            })}
                            {items.length === 0 && (
                                <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                                    Nenhum item adicionado
                                </Typography>
                            )}
                        </Box>

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
                    fullWidth={true}
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ px: 4, width: { xs: '100%', sm: 'auto' } }}
                >
                    {isEditMode ? 'Salvar Alterações' : 'Criar Encomenda'}
                </Button>
            </Box>
        </Box>
    );
};

export default PreOrderForm;
