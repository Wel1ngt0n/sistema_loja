import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // Removido
import api from '../services/api';

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    title?: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, title = 'Login do Sistema' }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao fazer login');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" gutterBottom align="center">
                    {title}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Usuário"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Senha"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Entrar
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
