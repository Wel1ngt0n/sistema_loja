import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import type { PaymentMethod } from '../../../../types';

interface PreOrderItem {
    id: number;
    product_name: string; // derived or from relation
    product: { name: string, unit: string, price: number };
    qty: number;
    desired_weight_kg?: number;
    final_weight_kg?: number;
    unit_price_snapshot: number;
    price_per_kg_snapshot: number;
    notes?: string;
}

interface PreOrder {
    id: number;
    customer_name: string;
    paid_amount: number;
    items: PreOrderItem[];
    status: string;
}

const PreOrderCheckout: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<PreOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Weights State: { itemId: weight }
    const [weights, setWeights] = useState<{ [key: number]: string }>({});

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [amountToPay, setAmountToPay] = useState(''); // User input for payment

    useEffect(() => {
        api.get(`/preorders/${id}`).then(res => {
            setOrder(res.data);
            // Initialize weights with previously saved final or desired
            const initialWeights: any = {};
            res.data.items.forEach((item: PreOrderItem) => {
                if (item.product.unit === 'KG') {
                    const w = item.final_weight_kg ?? item.desired_weight_kg ?? 0;
                    initialWeights[item.id] = w.toString();
                }
            });
            setWeights(initialWeights);
        }).catch(err => {
            console.error(err);
            alert("Erro ao carregar encomenda");
        }).finally(() => setLoading(false));
    }, [id]);

    const handleWeightChange = (itemId: number, val: string) => {
        setWeights(prev => ({ ...prev, [itemId]: val }));
    };

    // Calculate Totals Live
    const calculateTotals = () => {
        if (!order) return { total: 0, remaining: 0 };

        let total = 0;
        order.items.forEach(item => {
            let lineTotal = 0;
            const price = item.price_per_kg_snapshot || item.unit_price_snapshot || item.product.price;

            if (item.product.unit === 'KG') {
                const w = parseFloat(weights[item.id] || '0');
                lineTotal = w * price;
            } else {
                lineTotal = item.qty * price;
            }
            total += lineTotal;
        });

        const remaining = Math.max(0, total - order.paid_amount);
        return { total, remaining };
    };

    const { total, remaining } = calculateTotals();

    // Auto-fill payment amount with remaining when remaining changes (only if pristine?)
    // Simpler: just default the input to remaining if empty? 
    // Effect might update it constantly, annoying if user typing.
    // Let's just set it on load/calc once or let user type.
    // Better: Helper button "Valor Restante".

    const handleCheckout = async () => {
        if (!order) return;

        const paymentAmount = parseFloat(amountToPay);
        if (remaining > 0 && (!paymentAmount || paymentAmount < remaining - 0.01)) {
            // Allow partial? The backend logic checks total_paid vs total.
            // Backend throws error if insufficient.
            if (!window.confirm(`O valor informado (R$ ${paymentAmount || 0}) é menor que o restante (R$ ${remaining.toFixed(2)}). Deseja continuar (falhará se backend exigir total)?`)) {
                return;
            }
        }

        setProcessing(true);
        try {
            const itemsPayload = Object.keys(weights).map(kid => ({
                id: parseInt(kid),
                final_weight_kg: parseFloat(weights[parseInt(kid)])
            }));

            // Include non-weighable items just in case backend wants them? 
            // My backend logic iterates payload. Logic doesn't require non-weighable if no change.

            const payload = {
                items: itemsPayload,
                payments: [
                    {
                        method: paymentMethod,
                        amount: paymentAmount || 0 // If 0 (e.g. fully paid by signal), send 0 or empty list?
                        // Backend checks sum(payments) vs remaining (total - discount).
                        // If remaining is 0, payment 0 is fine.
                    }
                ]
            };

            await api.post(`/preorders/${order.id}/checkout`, payload);
            alert("Checkout realizado com sucesso!");
            navigate('/admin/sales'); // Redirect to Sales or List
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Erro ao realizar checkout");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Typography p={3}>Carregando...</Typography>;
    if (!order) return <Typography p={3}>Encomenda não encontrada</Typography>;

    return (
        <Box p={3} maxWidth={1200} margin="auto">
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/preorders')} sx={{ mb: 2 }}>
                Voltar
            </Button>

            <Typography variant="h4" fontWeight="bold" mb={1}>Checkout de Encomenda #{order.id}</Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={3}>Cliente: {order.customer_name}</Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                <Box width={{ xs: '100%', md: '65%' }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>Conferência de Itens</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell align="center">Qtd/Peso (Est.)</TableCell>
                                    <TableCell align="center">Peso Final (KG)</TableCell>
                                    <TableCell align="right">Preço Unit/KG</TableCell>
                                    <TableCell align="right">Total Item</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.items.map(item => {
                                    const isKg = item.product.unit === 'KG';
                                    const price = item.price_per_kg_snapshot || item.unit_price_snapshot || item.product.price;
                                    const currentWeight = isKg ? parseFloat(weights[item.id] || '0') : 0;
                                    const lineTotal = isKg ? currentWeight * price : item.qty * price;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell align="center">
                                                {isKg ? `${item.desired_weight_kg} kg` : item.qty}
                                            </TableCell>
                                            <TableCell align="center">
                                                {isKg ? (
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        inputProps={{ step: 0.001 }}
                                                        value={weights[item.id]}
                                                        onChange={(e) => handleWeightChange(item.id, e.target.value)}
                                                        sx={{ width: 100 }}
                                                    />
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell align="right">R$ {price.toFixed(2)}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                R$ {lineTotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>

                <Box width={{ xs: '100%', md: '35%' }}>
                    <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                        <Typography variant="h6" mb={2}>Resumo Financeiro</Typography>

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography>Total Final:</Typography>
                            <Typography fontWeight="bold" variant="h6">R$ {total.toFixed(2)}</Typography>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mb={1} color="success.main">
                            <Typography>Já Pago (Sinal):</Typography>
                            <Typography fontWeight="bold">- R$ {order.paid_amount.toFixed(2)}</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h5">A Pagar:</Typography>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                R$ {remaining.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>

                    {remaining > 0 ? (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" mb={2}>Pagamento Restante</Typography>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Forma de Pagamento</InputLabel>
                                <Select
                                    value={paymentMethod}
                                    label="Forma de Pagamento"
                                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                >
                                    <MenuItem value="CASH">Dinheiro</MenuItem>
                                    <MenuItem value="CREDIT_CARD">Crédito</MenuItem>
                                    <MenuItem value="DEBIT_CARD">Débito</MenuItem>
                                    <MenuItem value="PIX">PIX</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Valor a Pagar"
                                type="number"
                                margin="normal"
                                value={amountToPay}
                                onChange={(e) => setAmountToPay(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <Button size="small" onClick={() => setAmountToPay(remaining.toFixed(2))}>
                                            Total
                                        </Button>
                                    )
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                color="success"
                                startIcon={<AttachMoneyIcon />}
                                onClick={handleCheckout}
                                disabled={processing}
                                sx={{ mt: 3 }}
                            >
                                Finalizar Encomenda
                            </Button>
                        </Paper>
                    ) : (
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            color="success"
                            onClick={handleCheckout}
                            disabled={processing}
                            startIcon={<SaveIcon />}
                        >
                            Confirmar Retirada
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PreOrderCheckout;
