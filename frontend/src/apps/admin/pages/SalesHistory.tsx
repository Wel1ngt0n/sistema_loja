import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Button, IconButton, Collapse, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../../../services/api';
import type { Sale } from '../../../types';

const SaleRow: React.FC<{ sale: Sale }> = ({ sale }) => {
    const [open, setOpen] = useState(false);

    // Helper to format date
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{formatDate(sale.created_at)}</TableCell>
                <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                <TableCell>{sale.user_name}</TableCell>
                <TableCell>
                    {/* Show payments summarized */}
                    {sale.payments.map((p, i) => (
                        <Chip key={i} label={`${p.method}: R$ ${p.amount.toFixed(2)}`} size="small" sx={{ mr: 0.5 }} />
                    ))}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Itens da Venda
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="right">Qtd</TableCell>
                                        <TableCell align="right">Preço Un.</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sale.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.product_name}</TableCell>
                                            <TableCell align="right">{item.qty}</TableCell>
                                            <TableCell align="right">R$ {item.unit_price.toFixed(2)}</TableCell>
                                            <TableCell align="right">R$ {item.total_price.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {sale.discount_value > 0 && (
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <Typography color="error">Desconto: - R$ {sale.discount_value.toFixed(2)}</Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const SalesHistory: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (paymentMethod) params.payment_method = paymentMethod;

            const res = await api.get('/reports/sales-history', { params });
            setSales(res.data);
        } catch (error) {
            console.error(error);
            alert("Erro ao buscar histórico de vendas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Histórico de Vendas</Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
                    <TextField
                        label="Data Início"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="Data Fim"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        select
                        label="Método Pagamento"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="CASH">Dinheiro</MenuItem>
                        <MenuItem value="CREDIT_CARD">Cartão Crédito</MenuItem>
                        <MenuItem value="DEBIT_CARD">Cartão Débito</MenuItem>
                        <MenuItem value="PIX">PIX</MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={fetchSales} disabled={loading}>
                        Filtrar
                    </Button>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>ID</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Vendedor</TableCell>
                            <TableCell>Pagamento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales.map((sale) => (
                            <SaleRow key={sale.id} sale={sale} />
                        ))}
                        {sales.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Nenhuma venda encontrada</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SalesHistory;
