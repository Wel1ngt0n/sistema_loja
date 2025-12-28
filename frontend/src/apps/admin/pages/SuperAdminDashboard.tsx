import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Paper, Tab, Tabs, Button,
    Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Checkbox, FormControlLabel, FormGroup, Alert, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../services/api';
import type { User, Device } from '../../../types/auth';

const SuperAdminDashboard: React.FC = () => {
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);

    // Dialogs
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openDeviceDialog, setOpenDeviceDialog] = useState(false);

    // Forms
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userData, setUserData] = useState({ username: '', password: '', name: '', active: true, roles: [] as string[] });
    const [newDeviceName, setNewDeviceName] = useState('');
    const [createdToken, setCreatedToken] = useState(''); // Plain text token after creation

    const fetchData = async () => {
        if (tab === 0) {
            const res = await api.get('/superadmin/users');
            setUsers(res.data);
        } else {
            const res = await api.get('/superadmin/devices');
            setDevices(res.data);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tab]);

    const handleOpenUserDialog = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setUserData({
                username: user.username,
                password: '', // Leave empty to not change
                name: user.name || '',
                active: user.active,
                roles: user.roles
            });
        } else {
            setEditingUser(null);
            setUserData({ username: '', password: '', name: '', active: true, roles: [] });
        }
        setOpenUserDialog(true);
    };

    const handleSaveUser = async () => {
        try {
            if (editingUser) {
                await api.put(`/superadmin/users/${editingUser.id}`, userData);
            } else {
                await api.post('/superadmin/users', userData);
            }
            setOpenUserDialog(false);
            fetchData();
        } catch (e: any) {
            alert(e.response?.data?.message || 'Error');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await api.delete(`/superadmin/users/${id}`);
                fetchData();
            } catch (e: any) {
                alert(e.response?.data?.message || 'Erro ao excluir');
            }
        }
    };

    const handleCreateDevice = async () => {
        try {
            const res = await api.post('/superadmin/devices', { name: newDeviceName });
            setCreatedToken(res.data.token); // Show token!
            await fetchData();
            // Don't close dialog yet, user needs to copy token
        } catch (e: any) {
            alert(e.response?.data?.message || 'Error');
        }
    };

    const handleDeleteDevice = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este totem? O token deixará de funcionar.')) {
            try {
                await api.delete(`/superadmin/devices/${id}`);
                fetchData();
            } catch (e: any) {
                alert(e.response?.data?.message || 'Erro ao excluir totem');
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" mb={2}>Super Admin</Typography>
            <Paper square>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Usuários" />
                    <Tab label="Dispositivos (Totem)" />
                </Tabs>
            </Paper>

            <Box p={3}>
                {tab === 0 && (
                    <>
                        <Button variant="contained" onClick={() => handleOpenUserDialog()} sx={{ mb: 2 }}>
                            Novo Usuário
                        </Button>
                        <Table component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Roles</TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(u => (
                                    <TableRow key={u.id}>
                                        <TableCell>{u.id}</TableCell>
                                        <TableCell>{u.username}</TableCell>
                                        <TableCell>{u.roles.join(', ')}</TableCell>
                                        <TableCell>{u.active ? 'Yes' : 'No'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleOpenUserDialog(u)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteUser(u.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}

                {tab === 1 && (
                    <>
                        <Button variant="contained" onClick={() => { setCreatedToken(''); setOpenDeviceDialog(true); }} sx={{ mb: 2 }}>
                            Novo Totem
                        </Button>
                        <Button color="inherit" component={Link} to="/totem/config" sx={{ mb: 2, ml: 2 }}>
                            Configurar Este Dispositivo
                        </Button>
                        <Table component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Visto por último</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devices.map(d => (
                                    <TableRow key={d.id}>
                                        <TableCell>{d.id}</TableCell>
                                        <TableCell>{d.name}</TableCell>
                                        <TableCell>{d.active ? 'Ativo' : 'Inativo'}</TableCell>
                                        <TableCell>{d.last_seen || 'Nunca'}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="error" onClick={() => handleDeleteDevice(d.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </Box>

            {/* Create User Dialog */}
            <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
                <DialogTitle>{editingUser ? 'Editar Usuário' : 'Criar Usuário'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username" fullWidth margin="normal"
                        value={userData.username}
                        disabled={!!editingUser}
                        onChange={e => setUserData({ ...userData, username: e.target.value })}
                    />
                    <TextField
                        label="Nome" fullWidth margin="normal"
                        value={userData.name}
                        onChange={e => setUserData({ ...userData, name: e.target.value })}
                    />
                    <TextField
                        label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                        type="password" fullWidth margin="normal"
                        value={userData.password}
                        onChange={e => setUserData({ ...userData, password: e.target.value })}
                    />
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={userData.active} onChange={e => setUserData({ ...userData, active: e.target.checked })} />}
                            label="Ativo"
                        />
                    </FormGroup>
                    <Typography mt={2}>Roles (Permissões):</Typography>
                    <FormGroup>
                        {['SUPER_ADMIN', 'ADMIN', 'CASHIER', 'KITCHEN', 'VIEWER'].map(role => (
                            <FormControlLabel
                                key={role}
                                control={<Checkbox checked={userData.roles.includes(role)} onChange={e => {
                                    if (e.target.checked) setUserData({ ...userData, roles: [...userData.roles, role] });
                                    else setUserData({ ...userData, roles: userData.roles.filter(r => r !== role) });
                                }} />}
                                label={role}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUserDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveUser} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>

            {/* Create Device Dialog */}
            <Dialog open={openDeviceDialog} onClose={() => setOpenDeviceDialog(false)}>
                <DialogTitle>Novo Totem</DialogTitle>
                <DialogContent>
                    {!createdToken ? (
                        <TextField
                            label="Nome do Totem" fullWidth margin="normal"
                            value={newDeviceName}
                            onChange={e => setNewDeviceName(e.target.value)}
                        />
                    ) : (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            <Typography variant="h6">Token Gerado:</Typography>
                            <Box component="pre" sx={{ bgcolor: '#eee', p: 1, overflow: 'auto' }}>
                                {createdToken}
                            </Box>
                            <Typography variant="caption">
                                COPIE AGORA! Ele não será mostrado novamente.
                                Configure este token no header X-Device-Token do Totem.
                            </Typography>
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeviceDialog(false)}>Fechar</Button>
                    {!createdToken && <Button onClick={handleCreateDevice} variant="contained">Gerar Token</Button>}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SuperAdminDashboard;
