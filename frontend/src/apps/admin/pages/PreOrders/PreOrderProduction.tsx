import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../../../services/api';

interface ProductSummary {
    product_id: number;
    name: string;
    unit: string;
    total_qty: number;
    total_weight: number;
}

interface TimeBucketItem {
    order_id: number;
    customer: string;
    product: string;
    qty: number;
    weight?: number;
    unit: string;
    notes?: string;
}

interface TimeBucket {
    time_window: string;
    items: TimeBucketItem[];
}

const PreOrderProduction: React.FC = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState<ProductSummary[]>([]);
    const [timeline, setTimeline] = useState<TimeBucket[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProduction();
    }, [date]);

    const fetchProduction = async () => {
        setLoading(true);
        try {
            const res = await api.get('/preorders/production-summary', { params: { date } });
            setSummary(res.data.by_product);
            setTimeline(res.data.by_time);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Painel de Produção</Typography>
                <TextField
                    type="date"
                    label="Data de Produção"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 200 }}
                />
            </Box>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* Left Column: Aggregated Totals (Shopping List) */}
                <Box width={{ xs: '100%', md: '40%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} color="primary">Resumo Geral (O que preparar)</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell align="right">Qtd Total</TableCell>
                                    <TableCell align="right">Peso Total (Est.)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {summary.map((item) => (
                                    <TableRow key={item.product_id}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>{item.name}</TableCell>
                                        <TableCell align="right">
                                            {item.unit === 'KG' ? '-' : item.total_qty}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.total_weight > 0 ? `${item.total_weight.toFixed(3)} kg` : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {summary.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">Nenhum pedido para esta data</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Box>

                {/* Right Column: Timeline (When to have it ready) */}
                <Box width={{ xs: '100%', md: '60%' }}>
                    <Typography variant="h6" mb={2} color="text.secondary">Linha do Tempo (Entregas)</Typography>

                    {timeline.map((bucket) => (
                        <Accordion key={bucket.time_window} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontWeight="bold">{bucket.time_window}</Typography>
                                <Chip label={`${bucket.items.length} itens`} size="small" sx={{ ml: 2 }} />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="right">Qtd/Peso</TableCell>
                                            <TableCell>Obs</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bucket.items.map((item, idx) => (
                                            <TableRow key={`${bucket.time_window}-${idx}`}>
                                                <TableCell>{item.customer} (#{item.order_id})</TableCell>
                                                <TableCell>{item.product}</TableCell>
                                                <TableCell align="right">
                                                    {item.unit === 'KG' ? `${item.weight} kg` : item.qty}
                                                </TableCell>
                                                <TableCell>
                                                    {item.notes && <Typography variant="caption" color="error">{item.notes}</Typography>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    {timeline.length === 0 && !loading && (
                        <Typography color="text.secondary">Nenhuma entrega agendada.</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PreOrderProduction;
