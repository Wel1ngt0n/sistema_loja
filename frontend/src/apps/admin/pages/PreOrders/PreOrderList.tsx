import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Chip, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';

interface PreOrder {
    id: number;
    customer_name: string;
    customer_phone: string;
    pickup_datetime: string;
    status: string;
    estimated_total: number;
}

const PreOrderList: React.FC = () => {
    const [orders, setOrders] = useState<PreOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/preorders', { params: { search } });
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'default';
            case 'CONFIRMED': return 'info';
            case 'READY_FOR_PICKUP': return 'warning';
            case 'PICKED_UP': return 'success';
            case 'CANCELED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" color="text.secondary">
                    Encomendas
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/preorders/new')}
                >
                    Nova Encomenda
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <Box display="flex" gap={2}>
                    <TextField
                        label="Buscar (Nome/Tel)"
                        size="small"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                    />
                    <Button variant="outlined" onClick={fetchOrders} startIcon={<RefreshIcon />}>
                        Filtrar
                    </Button>
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Retirada</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Total Est.</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.customer_name}</TableCell>
                                <TableCell>{row.customer_phone}</TableCell>
                                <TableCell>
                                    {row.pickup_datetime ? new Date(row.pickup_datetime).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        color={getStatusColor(row.status) as any}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell>R$ {row.estimated_total?.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/admin/preorders/${row.id}`)}
                                        title="Editar"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="success"
                                        onClick={() => navigate(`/admin/preorders/${row.id}/checkout`)}
                                        title="Checkout / Retirada"
                                    >
                                        <ShoppingCartCheckoutIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Nenhuma encomenda encontrada</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PreOrderList;
