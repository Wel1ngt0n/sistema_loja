import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Chip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../../../../services/api';

interface ScheduleItem {
    time: string;
    qty: number;
    weight: number;
}

interface ProductSummary {
    product_id: number;
    name: string;
    category_name: string;
    unit: string;
    total_qty: number;
    total_weight: number;
    schedule: ScheduleItem[];
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

interface Category {
    id: number;
    name: string;
}

const PreOrderProduction: React.FC = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState<ProductSummary[]>([]);
    const [filteredSummary, setFilteredSummary] = useState<ProductSummary[]>([]);
    const [timeline, setTimeline] = useState<TimeBucket[]>([]);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        // Fetch Categories
        api.get('/categories?active=true').then(res => {
            // Handle paginated or list response
            if (res.data.items) setCategories(res.data.items);
            else if (Array.isArray(res.data)) setCategories(res.data);
        });
    }, []);

    useEffect(() => {
        fetchProduction();
    }, [date]);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredSummary(summary);
        } else {
            setFilteredSummary(summary.filter(i => i.category_name === selectedCategory));
        }
    }, [summary, selectedCategory]);

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                <Typography variant="h4" fontWeight="bold">Painel de Produção</Typography>

                <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filtrar por Categoria</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Filtrar por Categoria"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="all">Todas</MenuItem>
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="date"
                        label="Data de Produção"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                        size="small"
                    />
                </Box>
            </Box>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* Left Column: Aggregated Totals with Schedule */}
                <Box width={{ xs: '100%', md: '50%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" color="primary">Resumo por Produto</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Mostrando {filteredSummary.length} itens
                            </Typography>
                        </Box>

                        <Box sx={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSummary.map((item) => (
                                        <TableRow key={item.product_id}>
                                            <TableCell>
                                                <Typography fontWeight="bold">{item.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {item.category_name}
                                                </Typography>
                                                {/* Schedule Breakdown */}
                                                {item.schedule && item.schedule.length > 0 && (
                                                    <Box display="flex" flexDirection="column" mt={0.5} ml={1}>
                                                        {item.schedule.map((sch, i) => (
                                                            <Typography key={i} variant="caption" color="text.secondary">
                                                                • <strong>{sch.qty}</strong> às {sch.time}
                                                                {sch.weight > 0 ? ` (${sch.weight.toFixed(3)}kg)` : ''}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell align="right" valign="top">
                                                <Typography fontWeight="bold">
                                                    {item.unit === 'KG'
                                                        ? (item.total_weight > 0 ? `${item.total_weight.toFixed(3)} kg` : '-')
                                                        : item.total_qty
                                                    }
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredSummary.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">Nenhum item encontrado</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column: Timeline (When to have it ready) */}
                <Box width={{ xs: '100%', md: '50%' }}>
                    <Typography variant="h6" mb={2} color="text.secondary">Linha do Tempo (Detalhada)</Typography>

                    {timeline.map((bucket) => (
                        <Accordion key={bucket.time_window} defaultExpanded sx={{ mb: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" fontWeight="bold">{bucket.time_window}</Typography>
                                <Chip label={`${bucket.items.length} entregas`} size="small" sx={{ ml: 2, height: 24 }} />
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 1, overflowX: 'auto' }}>
                                {/* Desktop Table */}
                                <Box display={{ xs: 'none', sm: 'block' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Cliente</TableCell>
                                                <TableCell>Produto</TableCell>
                                                <TableCell align="right">Qtd</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bucket.items.map((item, idx) => (
                                                <TableRow key={`${bucket.time_window}-${idx}`}>
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="body2">{item.customer}</Typography>
                                                        {item.notes && <Typography variant="caption" display="block" color="error">{item.notes}</Typography>}
                                                    </TableCell>
                                                    <TableCell><Typography variant="body2">{item.product}</Typography></TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">
                                                            {item.unit === 'KG' ? `${item.weight} kg` : item.qty}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>

                                {/* Mobile List */}
                                <Box display={{ xs: 'flex', sm: 'none' }} flexDirection="column" gap={1}>
                                    {bucket.items.map((item, idx) => (
                                        <Box key={idx} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle2" fontWeight="bold">{item.customer}</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    {item.unit === 'KG' ? `${item.weight} kg` : `${item.qty} un`}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">{item.product}</Typography>
                                            {item.notes && <Typography variant="caption" color="error">{item.notes}</Typography>}
                                        </Box>
                                    ))}
                                </Box>
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
