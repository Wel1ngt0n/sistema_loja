import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/'); // Smart redirect via RootRedirect
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Sistema Loja
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage;
