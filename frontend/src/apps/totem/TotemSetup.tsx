import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TotemSetup: React.FC = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const existing = localStorage.getItem('device_token');
        if (existing) setToken(existing);
    }, []);

    const handleSave = () => {
        if (token) {
            localStorage.setItem('device_token', token);
            alert('Token salvo com sucesso!');
            navigate('/totem');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#eee">
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={2}>Configuração do Totem</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Insira o Token do Dispositivo gerado no painel Super Admin.
                </Alert>
                <TextField
                    label="Device Token"
                    fullWidth
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    margin="normal"
                />
                <Button variant="contained" fullWidth onClick={handleSave} sx={{ mt: 2 }}>
                    Salvar e Ir para Totem
                </Button>
            </Paper>
        </Box>
    );
};

export default TotemSetup;
