import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel,
    Select, MenuItem, InputLabel, FormControl, LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../services/api';
import type { Product, Category } from '../../../types';
import KitEditor from '../components/KitEditor';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    // Form
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', barcode: '', category_id: 0, price: 0, unit: 'UN', active: true,
        controls_stock: false, stock_qty: 0, available_in_totem: true, description: ''
    });

    // Import Results
    const [importResult, setImportResult] = useState<{ created: number, updated: number, errors: string[] } | null>(null);
    const [showImportDetails, setShowImportDetails] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importStatusMsg, setImportStatusMsg] = useState('');

    // Filter State
    const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');

    const fetchData = async () => {
        try {
            let url = '/products';
            if (filterCategory !== 'all') {
                url += `?category_id=${filterCategory}`;
            }

            const [prodRes, catRes] = await Promise.all([
                api.get(url),
                api.get('/categories')
            ]);
            setProducts(prodRes.data.items || prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterCategory]);

    const handleOpen = (prod?: Product) => {
        if (prod) {
            setEditing(prod);
            setFormData({ ...prod });
        } else {
            setEditing(null);
            setFormData({
                name: '', barcode: '', category_id: categories[0]?.id || 0, price: 0, unit: 'UN', active: true,
                controls_stock: false, stock_qty: 0, available_in_totem: true, description: ''
            });
        }
        setOpen(true);
    };

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData };

            // Ensure kit_options is an object/array, though KitEditor handles it.
            // No manual parsing needed anymore.

            if (editing) {
                await api.put(`/products/${editing.id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            fetchData();
            setOpen(false);
        } catch (error) {
            alert('Erro ao salvar');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (error: any) {
                if (error.response && error.response.status === 409) {
                    // Start of logical flow for archiving
                    if (window.confirm("Este produto não pode ser excluído pois possui histórico de vendas/pedidos.\n\nDeseja apenas desativá-lo (arquivar) para que não apareça mais em novos pedidos?")) {
                        try {
                            await api.put(`/products/${id}`, { active: false });
                            alert("Produto desativado com sucesso.");
                            fetchData();
                        } catch (e) {
                            alert("Erro ao desativar produto.");
                        }
                    }
                } else {
                    console.error(error);
                    alert('Erro ao deletar produto.');
                }
            }
        }
    };

    const handleExportCSV = () => {
        window.open(`${api.defaults.baseURL}/products/export/csv`, '_blank');
    };

    const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                // 1. Start Import Job
                const res = await api.post('/products/import/csv', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const jobId = res.data.jobId;
                setImporting(true);
                setImportProgress(0);
                setImportStatusMsg('Iniciando importação...');

                // 2. Poll Status
                const interval = setInterval(async () => {
                    try {
                        const statusRes = await api.get(`/products/import/status/${jobId}`);
                        const job = statusRes.data;

                        if (job.status === 'processing') {
                            const percent = job.total > 0 ? Math.round((job.current / job.total) * 100) : 0;
                            setImportProgress(percent);
                            setImportStatusMsg(`Processando ${job.current} de ${job.total} produtos...`);
                        } else if (job.status === 'completed') {
                            clearInterval(interval);
                            setImporting(false);
                            setImportResult(job.result);
                            setShowImportDetails(true);
                            fetchData();
                        } else if (job.status === 'failed') {
                            clearInterval(interval);
                            setImporting(false);
                            alert(`Erro na importação: ${job.error}`);
                        }
                    } catch (err) {
                        console.error("Polling error", err);
                        // Don't stop polling on transient network errors, but maybe limit retries in a real app
                    }
                }, 1000);

            } catch (error: any) {
                alert('Erro ao iniciar importação: ' + (error.response?.data?.message || 'Erro desconhecido'));
                console.error(error);
            }
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2} flexWrap="wrap">
                <Typography variant="h4">Produtos</Typography>

                <Box display="flex" gap={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filtrar por Categoria</InputLabel>
                        <Select
                            value={filterCategory}
                            label="Filtrar por Categoria"
                            onChange={(e) => setFilterCategory(e.target.value as number | 'all')}
                        >
                            <MenuItem value="all">Todas</MenuItem>
                            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" onClick={handleExportCSV}>
                        Exportar CSV
                    </Button>
                    <Button variant="outlined" component="label">
                        Importar CSV
                        <input type="file" hidden accept=".csv" onChange={handleImportCSV} />
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Novo Produto</Button>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Unidade</TableCell>
                            <TableCell>Estoque</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>R$ {Number(row.price).toFixed(2)}</TableCell>
                                <TableCell>{row.unit}</TableCell>
                                <TableCell>{row.controls_stock ? row.stock_qty : '-'}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(row)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
                <DialogContent>
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                        <TextField label="Nome" fullWidth value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                        <TextField label="Código de Barras" fullWidth value={formData.barcode} onChange={e => handleChange('barcode', e.target.value)} />

                        <TextField label="Preço" type="number" fullWidth value={formData.price} onChange={e => handleChange('price', Number(e.target.value))} />

                        <FormControl fullWidth>
                            <InputLabel>Categoria</InputLabel>
                            <Select value={formData.category_id} label="Categoria" onChange={e => handleChange('category_id', Number(e.target.value))}>
                                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Unidade</InputLabel>
                            <Select value={formData.unit} label="Unidade" onChange={e => handleChange('unit', e.target.value)}>
                                {['UN', 'KG', 'G', 'PORCAO'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControlLabel control={<Switch checked={formData.active} onChange={e => handleChange('active', e.target.checked)} />} label="Ativo" />
                        <FormControlLabel control={<Switch checked={formData.available_in_totem} onChange={e => handleChange('available_in_totem', e.target.checked)} />} label="Disponível no Totem" />

                        <FormControlLabel control={<Switch checked={formData.controls_stock} onChange={e => handleChange('controls_stock', e.target.checked)} />} label="Controla Estoque" />
                        {formData.controls_stock && (
                            <TextField label="Qtd em Estoque" type="number" fullWidth value={formData.stock_qty} onChange={e => handleChange('stock_qty', Number(e.target.value))} />
                        )}

                        <FormControlLabel control={<Switch checked={formData.is_kit || false} onChange={e => handleChange('is_kit', e.target.checked)} />} label="É um Kit/Combo (Marmita)?" sx={{ gridColumn: 'span 2' }} />

                        {formData.is_kit && (
                            <Box sx={{ gridColumn: 'span 2' }}>
                                <KitEditor
                                    value={typeof formData.kit_options === 'string' ? JSON.parse(formData.kit_options || '[]') : (formData.kit_options || [])}
                                    onChange={(val) => handleChange('kit_options', val)}
                                    availableProducts={products}
                                />
                            </Box>
                        )}

                        <Box sx={{ gridColumn: 'span 2' }}>
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<AddIcon />}
                            >
                                Upload Imagem
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            const formDataUpload = new FormData();
                                            formDataUpload.append('file', file);

                                            try {
                                                const res = await api.post('/uploads/', formDataUpload, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                handleChange('image_url', res.data.url);
                                            } catch (err) {
                                                alert('Erro no upload');
                                            }
                                        }
                                    }}
                                />
                            </Button>
                            {formData.image_url && (
                                <Box mt={2} display="flex" alignItems="center" gap={2}>
                                    <img src={formData.image_url} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                                    <Button color="error" size="small" onClick={() => handleChange('image_url', '')}>Remover</Button>
                                </Box>
                            )}
                        </Box>

                        <TextField label="Descrição" fullWidth multiline rows={2} value={formData.description} onChange={e => handleChange('description', e.target.value)} sx={{ gridColumn: 'span 2' }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Progress Dialog */}
            <Dialog open={importing}>
                <DialogTitle>Importando Produtos</DialogTitle>
                <DialogContent sx={{ minWidth: 300 }}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>{importStatusMsg}</Typography>
                        <LinearProgress variant="determinate" value={importProgress} />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>{importProgress}%</Typography>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Import Results Dialog */}
            <Dialog open={showImportDetails} onClose={() => setShowImportDetails(false)} maxWidth="md" fullWidth>
                <DialogTitle>Resultado da Importação</DialogTitle>
                <DialogContent>
                    {importResult && (
                        <Box>
                            <Box display="flex" gap={4} mb={3} mt={1}>
                                <Paper sx={{ p: 2, bgcolor: '#e8f5e9', flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" color="success.main">{importResult.created}</Typography>
                                    <Typography variant="body2">Criados</Typography>
                                </Paper>
                                <Paper sx={{ p: 2, bgcolor: '#e3f2fd', flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" color="primary.main">{importResult.updated}</Typography>
                                    <Typography variant="body2">Atualizados</Typography>
                                </Paper>
                                <Paper sx={{ p: 2, bgcolor: importResult.errors.length > 0 ? '#ffebee' : '#f5f5f5', flex: 1, textAlign: 'center' }}>
                                    <Typography variant="h6" color={importResult.errors.length > 0 ? "error.main" : "text.secondary"}>
                                        {importResult.errors.length}
                                    </Typography>
                                    <Typography variant="body2">Erros</Typography>
                                </Paper>
                            </Box>

                            {importResult.errors.length > 0 && (
                                <Box>
                                    <Typography variant="h6" color="error" gutterBottom>Detalhes dos Erros:</Typography>
                                    <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 2, bgcolor: '#fff4f4' }}>
                                        {importResult.errors.map((err, idx) => (
                                            <Typography key={idx} color="error" sx={{ mb: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                • {err}
                                            </Typography>
                                        ))}
                                    </Paper>
                                </Box>
                            )}

                            {importResult.errors.length === 0 && (
                                <Typography color="success.main" align="center" variant="h6">
                                    Sucesso! Nenhum erro encontrado.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowImportDetails(false)} variant="contained" autoFocus>
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductList;
