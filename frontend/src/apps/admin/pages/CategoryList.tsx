import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../services/api';
import type { Category } from '../../../types';

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [active, setActive] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpen = (category?: Category) => {
        if (category) {
            setEditing(category);
            setName(category.name);
            setSortOrder(category.sort_order);
            setActive(category.active);
        } else {
            setEditing(null);
            setName('');
            setSortOrder(0);
            setActive(true);
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            const payload = { name, sort_order: sortOrder, active };
            if (editing) {
                await api.put(`/categories/${editing.id}`, payload);
            } else {
                await api.post('/categories', payload);
            }
            fetchCategories();
            handleClose();
        } catch (error) {
            alert('Erro ao salvar');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                alert('Erro ao deletar (verifique se tem produtos vinculados)');
            }
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h4">Categorias</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Nova Categoria</Button>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Ordem</TableCell>
                            <TableCell>Ativa</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.sort_order}</TableCell>
                                <TableCell>{row.active ? 'Sim' : 'Não'}</TableCell>
                                <TableCell align="right">
                                    <Box display="flex" justifyContent="flex-end">
                                        <IconButton color="primary" onClick={() => handleOpen(row)}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Ordem de Exibição"
                        type="number"
                        fullWidth
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                    />
                    <FormControlLabel
                        control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
                        label="Ativa"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryList;
