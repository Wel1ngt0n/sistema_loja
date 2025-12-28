import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, List, ListItem, ListItemButton, ListItemText, Typography, IconButton, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../../../services/api';

interface Customer {
    id: number;
    name: string;
    cpf?: string;
    phone?: string;
    email?: string;
}

interface CustomerSelectionProps {
    open: boolean;
    onClose: () => void;
    onSelect: (customer: Customer | null) => void;
}

const CustomerSelection: React.FC<CustomerSelectionProps> = ({ open, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    const [view, setView] = useState<'SEARCH' | 'REGISTER'>('SEARCH');

    // Register State
    const [newCustomer, setNewCustomer] = useState({ name: '', cpf: '', phone: '', email: '' });
    const [registerLoading, setRegisterLoading] = useState(false);

    // Initial load or search
    useEffect(() => {
        if (open && view === 'SEARCH') { // Only fetch if in search view
            fetchCustomers();
        }
    }, [open, searchTerm, view]); // Added view to dependencies to re-fetch when returning to search

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Assuming we have an endpoint for searching customers
            // If not, we might need to use the list endpoint or add a search param
            const res = await api.get(`/customers?search=${searchTerm}`);
            setCustomers(res.data.data);
        } catch (error) {
            console.error("Error fetching customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (customer: Customer) => {
        onSelect(customer);
        onClose();
    };

    const handleRegister = async () => {
        if (!newCustomer.name) {
            alert("Nome é obrigatório");
            return;
        }
        setRegisterLoading(true);
        try {
            const res = await api.post('/customers', newCustomer);
            onSelect(res.data);
            onClose();
            // Reset
            setNewCustomer({ name: '', cpf: '', phone: '', email: '' });
            setView('SEARCH');
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao cadastrar cliente");
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {view === 'SEARCH' ? 'Selecionar Cliente' : 'Novo Cliente'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {view === 'SEARCH' ? (
                    <>
                        <Box display="flex" gap={1} mb={2}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Buscar por Nome ou CPF"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <PersonAddIcon sx={{ mr: 1, color: 'action.active' }} />
                                }}
                            />
                            <Button variant="contained" onClick={() => setView('REGISTER')} sx={{ whiteSpace: 'nowrap' }}>
                                Novo
                            </Button>
                        </Box>

                        <Box maxHeight="300px" overflow="auto">
                            {loading ? (
                                <Typography variant="body2" align="center">Carregando...</Typography>
                            ) : customers.length === 0 ? (
                                <Typography variant="body2" align="center" color="textSecondary">
                                    Nenhum cliente encontrado.
                                </Typography>
                            ) : (
                                <List>
                                    {customers.map((c) => (
                                        <ListItem key={c.id} disablePadding>
                                            <ListItemButton onClick={() => handleSelect(c)}>
                                                <ListItemText
                                                    primary={c.name}
                                                    secondary={`CPF: ${c.cpf || 'N/A'} - Tel: ${c.phone || 'N/A'}`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Nome Completo *"
                            fullWidth
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                        <TextField
                            label="CPF"
                            fullWidth
                            value={newCustomer.cpf}
                            onChange={(e) => setNewCustomer({ ...newCustomer, cpf: e.target.value })}
                        />
                        <TextField
                            label="Telefone"
                            fullWidth
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {view === 'SEARCH' ? (
                    <>
                        <Button onClick={() => onSelect(null)} color="error">
                            Remover Cliente
                        </Button>
                        <Button onClick={onClose}>
                            Cancelar
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setView('SEARCH')}>
                            Voltar
                        </Button>
                        <Button variant="contained" onClick={handleRegister} disabled={registerLoading}>
                            {registerLoading ? 'Salvando...' : 'Cadastrar e Selecionar'}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CustomerSelection;
