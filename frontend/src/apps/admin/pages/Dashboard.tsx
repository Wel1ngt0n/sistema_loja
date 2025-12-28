import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import api from '../../../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Dashboard: React.FC = () => {
    const [kpis, setKpis] = useState<any>(null);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiRes, topRes] = await Promise.all([
                    api.get('/reports/dashboard'),
                    api.get('/reports/top-products')
                ]);
                setKpis(kpiRes.data.today);
                setTopProducts(topRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000); // Live refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>Visão Geral de Hoje</Typography>

            {/* KPIs */}
            <Box display="flex" gap={3} mb={4} flexWrap="wrap">
                <Card sx={{ minWidth: 250, flex: 1 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <AttachMoneyIcon color="primary" />
                            <Typography color="text.secondary">Vendas Totais</Typography>
                        </Box>
                        <Typography variant="h4">R$ {kpis?.total_sales?.toFixed(2)}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 250, flex: 1 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <ShoppingBagIcon color="secondary" />
                            <Typography color="text.secondary">Pedidos</Typography>
                        </Box>
                        <Typography variant="h4">{kpis?.total_orders}</Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 250, flex: 1 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <ReceiptIcon color="success" />
                            <Typography color="text.secondary">Ticket Médio</Typography>
                        </Box>
                        <Typography variant="h4">R$ {kpis?.avg_ticket?.toFixed(2)}</Typography>
                    </CardContent>
                </Card>
            </Box>

            {/* Top Products */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Produtos Mais Vendidos (Top 5)</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produto</TableCell>
                            <TableCell align="right">Qtd. Vendida</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topProducts.map((p, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell align="right">{p.qty}</TableCell>
                            </TableRow>
                        ))}
                        {topProducts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} align="center">Sem dados de vendas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default Dashboard;
