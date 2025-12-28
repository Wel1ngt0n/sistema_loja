import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../services/api';
import type { Customer } from '../../../types';

const CustomerList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Modal State
    const [open, setOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({ name: '', cpf: '', phone: '', email: '' });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/customers', { params: { search } });
            setCustomers(res.data.data); // data property from pagination response
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(fetchCustomers, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleOpen = (customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                name: customer.name || '',
                cpf: customer.cpf || '',
                phone: customer.phone || '',
                email: customer.email || ''
            });
        } else {
            setEditingCustomer(null);
            setFormData({ name: '', cpf: '', phone: '', email: '' });
        }
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, formData);
            } else {
                await api.post('/customers', formData);
            }
            fetchCustomers();
            setOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao salvar cliente");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja realmente remover este cliente?")) return;
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao remover cliente");
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Clientes</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Novo Cliente
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 2 }}>
                <TextField
                    label="Buscar Cliente (Nome, CPF)"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>CPF</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{c.cpf}</TableCell>
                                <TableCell>{c.phone}</TableCell>
                                <TableCell>{c.email}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleOpen(c)}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Nome"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="CPF"
                            fullWidth
                            value={formData.cpf}
                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        />
                        <TextField
                            label="Telefone"
                            fullWidth
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerList;
